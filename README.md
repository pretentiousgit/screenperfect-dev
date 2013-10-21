# screenPerfect

screenPerfect serves paired client-control video via a NodeJS server installation to Chrome on desktop, and Android 4.1+ devices.

For actual frameperfect alignment via node and a wifi connection, check testbuffer.js; this is where all demo packages relating to timing are stored.

This presently works perfectly on a single machine, but is dodgy on mobile clients.

ToDo
// Send-video should be linked to the video playback time using Popcorn. 
// it should only link up after the video appears and is loaded appropriately.

// Listener checks if it is on a mobile device.
// If it is on a mobile device, it requests touch event to trigger video playthrough.
// Then plays through videos accordingly (?).
// This could be a big gotcha; it works on main screen but has not been tested cross-device.
// 
// if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
//  $('#clientActivator').removeClass('.hidden').addClass('fullscreen');
//  $(document).on('click','#clientActivator', function(){
//  }
//  }
