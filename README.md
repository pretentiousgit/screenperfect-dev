# screenPerfect

screenPerfect serves paired client-control video via a NodeJS server installation to Chrome on desktop, and Android 4.1+ devices.

For actual frameperfect alignment via node and a wifi connection, check testbuffer.js; this is where all demo packages relating to timing are stored.


### screenPerfect Credits


Concept and development by Alex Leitch for Hannah Epstein's synchronous multi-screen/device installation game PsXXYborg.
Additional development support by Dann Toliver (@dxnn).
Interfaces and additional support by Jennie Faber (@jennie).
ScreenPerfect is built with Daimio: https://github.com/dxnn/daimio


### screenPerfect Gotchas

HTML5 Video
* screenPerfect accepts any video format.
* Chrome, as of November 2013, does not support .mp4 or h.264 video. It supports webM.
* Safari will play webm, but iOS devices will not. Not even in Chrome.
* iOS devices generally force play in iOS' video app.
* The poster attribute has extremely uneven support across browsers.


### screenPerfect ToDo

* Add graceful fail by supporting both webm and h.264 video with link files for each.
* further support graceful fail by adding poster support.
