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
		.removeAttr('loop')
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
	

  	// hotspot reader
	$.getJSON('/tmp/'+videoNext+'.json', function(data) {
		for (var i in data.spots) {
			var skeleton = $('<a class="send-video">&nbsp;</a>');
        	$(skeleton).attr('nextvid', data.spots[i].link);
        	$(skeleton).attr('style', data.spots[i].css);
        	$("#controlSpots").html(skeleton);
	    }
	 });

	return false;
	});   
});