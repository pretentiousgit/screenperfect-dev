socket.on('connect', function () {
	socket.emit('role', 'control', function (error) {
		if (!error) return;
		  socket.disconnect();
		  $('#connection').trigger('disconnected');
		  message('There is already a control connected');
		});

});
 
// Send-video should be linked to the video playback time using Popcorn. 
// it should only link up after the video appears and is loaded appropriately.

$(function() {

  $('#controlSpots').on('click', '.send-video', function(e){

  	//  video container variables
    var videoNext = parseInt($(this).attr('nextVid')),
    	videoCurrent = $('.fullscreen').attr('id'),
    	videoLoad = videoNext+1;
    
    // video object variables
    var videoA= $('#' + videoCurrent)[0],
		videoB= $('#' + videoNext)[0],
		videoC= $('#' + videoLoad)[0];	

    message('emitted \'' + videoNext + '\'');
    socket.emit('control event', videoNext);

    $(this).attr('nextVid', videoNext);

	$('#'+ videoCurrent)
		.removeClass("fullscreen")
		.removeAttr("autoplay")
		.attr('preload','none')
		.addClass("hidden")
  	
  	$('#'+ videoNext)
  		.removeClass("hidden")
  		.addClass("fullscreen")
  		.attr('loop',true);
	
	// image swapper
	$('.swap[set="'+videoNext+'"]')
		.removeClass("hidden");
	
	if (videoCurrent != 1){ // video 1 is a gif on android.
		videoA.pause();
	}
	if (videoNext != 1){
		videoB.play();
	}
	
	var updater = $('video.fullscreen');
	var vidObj = $('video.fullscreen')[0];
	var ts = $('#timestamp');

  	// hotspot reader
	$.getJSON('/tmp/'+videoNext+'.json', function(data) {
		 for (var i in data.spots) {
			var skeleton = $('<a class="send-video">&nbsp;</a>');
        	$(skeleton).attr('nextvid', data.spots[i].link);
        	$(skeleton).css('top', data.spots[i].top);
        	$(skeleton).css('left', data.spots[i].left);
        	$(skeleton).css('width', data.spots[i].width);
        	$(skeleton).css('height', data.spots[i].height);
        	$('#controlSpots').html(skeleton);
        }
	 });

	ts.css('color','#FFF');
	updater.on('timeupdate', function() {
		ts.text(vidObj.currentTime);
		socket.emit('timestamp', vidObj.currentTime);
	});

	return false;	

});  // end of send-video	

// socket.on('playController', function(e){
//   var shim = 7.006; // shim is needed on first video load but not after
//   document.getElementById('v1').currentTime = e + shim;
//   document.getElementById('v1').play();
//   $('#timeDiff').text(e - document.getElementById('v1').currentTime);
//   $('#time').text(e);

// });


// $('#v1').on('play', function(){
//   socket.emit('playNow', document.getElementById('v1').currentTime);
// });

// $('#v1').on('pause', function(){
//   socket.emit('pauseNow', document.getElementById('v1').currentTime);
//   $('#time').text(document.getElementById('v1').currentTime);
// });

/* 
Idea File ToDo
// hide the quicktime logo via transforms on load
// add a crossfade effect to the video load over 1/3 second

*/    
});