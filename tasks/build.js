'use strict';

var pathUtil = require('path');
var Q = require('q');
var gulp = require('gulp');
var rollup = require('rollup');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var globals = require('rollup-plugin-node-globals');
var builtins = require('rollup-plugin-node-builtins');
var less = require('gulp-less');
var jetpack = require('fs-jetpack');

var utils = require('./utils');
var generateSpecsImportFile = require('./generate_specs_import');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

var paths = {
    copyFromAppDir: [
        './node_modules/**',
        './vendor/**',
        './lightgallery/**',
        './**/*.html',
        './**/*.+(jpg|png|svg)'
    ],
}

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', gulp.series(function(callback) { 
    return destDir.dirAsync('.', { empty: false });
}));


var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: paths.copyFromAppDir
    });
};
gulp.task('copy', gulp.series(['clean'], copyTask)) 
gulp.task('copy-watch', copyTask);


var bundle = function (src, dest) {
    var deferred = Q.defer();

    rollup.rollup({
        input: src,
        external: [ 'electron', 'fs', 'fs-jetpack', 'yargs' ],
        plugins: [
            resolve(),
            commonjs({
                include: 'node_modules/**',
            }),
            builtins(),
        ],
    }).then(function (bundle) {
        return bundle.generate({
            format: 'cjs',
            sourcemap: true,
            sourcemapFile: dest,
        });
    }).then(function (result) {
        // Wrap code in self invoking function so the variables don't
        // pollute the global namespace.
        var jsFile = pathUtil.basename(dest);
//        console.log(result.output);
        var isolatedCode = '(function () {' + result.output[0].code + '}());';
            return Q.all([
            destDir.writeAsync(dest, isolatedCode + '\n//# sourceMappingURL=' + jsFile + '.map'),
            destDir.writeAsync(dest + '.map', result.output[0].map.toString()),
        ]);
    }).then(function () {
        deferred.resolve();
    }).catch(function (err) {
        console.error('Build: Error during rollup', err.stack);
    });

    return deferred.promise;
};

var bundleApplication = function () {
    return Q.all([
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        bundle(srcDir.path('app.js'), destDir.path('app.js')),
    ]);
};

var bundleSpecs = function () {
    generateSpecsImportFile().then(function (specEntryPointPath) {
        return Q.all([
            bundle(srcDir.path('background.js'), destDir.path('background.js')),
            bundle(specEntryPointPath, destDir.path('spec.js')),
        ]);
    });
};

var bundleTask = function () {
    if (utils.getEnvName() === 'test') {
        return bundleSpecs();
    }
    return bundleApplication();
};
gulp.task('bundle', gulp.series(['clean'], bundleTask)) 
gulp.task('bundle-watch', bundleTask);


var lessTask = function () {
    return gulp.src('app/stylesheets/main.less')
    .pipe(less())
    .pipe(gulp.dest(destDir.path('stylesheets')));
};
gulp.task('less', gulp.series(['clean'], lessTask)) 
gulp.task('less-watch', lessTask);


gulp.task('finalize', gulp.series(['clean'], function(done) {
    var manifest = srcDir.read('package.json', 'json');

    // Add "dev" or "test" suffix to name, so Electron will write all data
    // like cookies and localStorage in separate places for each environment.
    switch (utils.getEnvName()) {
        case 'development':
            manifest.name += '-dev';
            manifest.productName += ' Dev';
            break;
        case 'test':
            manifest.name += '-test';
            manifest.productName += ' Test';
            break;
    }

    // Copy environment variables to package.json file for easy use
    // in the running application. This is not official way of doing
    // things, but also isn't prohibited ;)
    manifest.env = projectDir.read('config/env_' + utils.getEnvName() + '.json', 'json');

    destDir.write('package.json', manifest);
    done();
}));


gulp.task('watch', function () {
    gulp.watch('app/**/*.js', gulp.series(['bundle-watch']));
    gulp.watch(paths.copyFromAppDir, { cwd: 'app' }, gulp.series(['copy-watch']));
    gulp.watch('app/**/*.less', gulp.series(['less-watch']));
});

gulp.task('build', gulp.series(['bundle', 'less', 'copy', 'finalize'])) 
