# lightGallery
An electron and nodejs based image viewer for Mac, Windows and Linux.

Main features
---

* Built with Electron
  * LightGallery uses HTML, CSS, and JavaScript with Chromium and Node.js to build the app.
* Cross-platform
* 20+ Animations
* Animated thumbnails
* Zoom & Fullscreen
* Mouse Drag & Keyboard Navigation
* Slideshow
* Image formats (jpg, png, gif, webp)

Settings
---

| Name        | Default           | Description  |
| ------------- |:-------------:| -----|
|mode|`'lg-slide'`|Type of transition between images|
|cssEasing|`'ease'`|Type of easing to be used for animations|
|speed|`600`|Transition duration (in ms)|
|hideBarsDelay|`6000`|Delay for hiding gallery controls in ms|
|useLeft|`false`|force lightgallery to use css left property instead of transform|
|closeable|`true`|allows clicks on dimmer to close gallery|
|loop|`true`|If `false`, will disable the ability to loop back to the beginning of the gallery when on the last element|
|keyPress|`true`|Enable keyboard navigation|
|controls|`true`|If `false`, prev/next buttons will not be displayed|
|slideEndAnimation|`true`|Enable slideEnd animation|
|hideControlOnEnd|`false`|If `true`, prev/next button will be hidden on first/last image|
|mousewheel|`true`|Change slide on mousewheel|
|preload|`1`|Number of preload slides. will execute only after the current slide is fully loaded. Example: on 4th image, if preload = 1 then 3rd + 5th slide loaded in background after 4th is fully loaded. If preload is 2 then 2nd 3rd 5th 6th slides will be preloaded|
|showAfterLoad|`true`|Show Content once it is fully loaded|
|counter|`true`|Whether to show total number of images and index number of currently displayed image|
|swipeThreshold|`50`|By setting the swipeThreshold (in px) you can set how far the user must swipe for the next/prev image|
|enableDrag|`true`|Enables desktop mouse drag support|
|thumbnail|`true`|Enable thumbnails for the gallery|
|animateThumb|`true`|Enable thumbnail animation|
|currentPagerPosition |`'middle'`|Position of selected thumbnail. `'left'` or `'middle'` or `'right'`|
|thumbWidth|`100`|Width of each thumbnails|
|thumbContHeight|`100`|Height of the thumbnail container including padding and border|
|thumbMargin|`5`|Spacing between each thumbnails|
|toggleThumb|true|Whether to display thumbnail toggle button|
|enableThumbDrag|`true`|Enables desktop mouse drag support for thumbnails|
|autoplay|`true`|Enable gallery autoplay|
|pause|`5000`|The time (in ms) between each auto transition|
|progressBar |`true`|Enable autoplay progress bar|
|forceAutoplay|`false`|If `false` autoplay will be stopped after first user action|
|autoplayControls|`true`|Show/hide autoplay controls|
|pager|`true`|Enable/Disable pager|
|zoom|`true`|Enable/Disable zoom option|
|scale|`1`|Value of zoom should be incremented/decremented|


Development
---
#### Project's folders

- `app` - application source code
- `build` - built, runnable application.
- `config` - environment specific stuff
- `releases` - ready for distribution installers
- `resources` - resources for particular operating system
- `tasks` - build and development environment scripts


#### Installation

```
npm install
```

It will also download Electron runtime, and install dependencies for second `package.json` file inside the `app` folder.

#### Starting the app

```
npm start
```



Making a release
----

To make ready for distribution installer use command:
```
npm run release
```

It will start the packaging process for the operating system you are running this command on. The file which is ready for distribution will be put into `releases` directory.

Installers can only be build on the target operating system.

Original idea and implementation by [@sachinchoolur](https://twitter.com/sachinchoolur).

### License

MIT License
