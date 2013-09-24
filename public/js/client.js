var videoQuant;
var videoList;

socket.on('connect', function(e) {
	//on connection, tell the server what kind of client you are. This is a listener.
	socket.emit('listener', function (error) {
		if (!error) return;
		socket.disconnect();
		$('#connection').trigger('disconnected');
		message('Server thinks only one listener can be connected'); // debug message
	});
});


socket.on('video quant',function(e) {
	videoQuant = e;
	console.log('number of videos '+ videoQuant);
});

socket.on('video list', function(e){
	videoList = e;
	console.log('videoList var '+ videoList);
})

socket.on('control event', function(e) {
	// connection passes server's current video number to listener clients
	if (e){
		screenControl(e, videoQuant);
		console.log(e);

		//  provide currentTime from playing video
		var updater = $('video.fullscreen');
		var vidObj = $('video.fullscreen')[0];
		var ts = $('#timestamp');

		ts.css('color','#FFF');
		updater.on('timeupdate', function() {
			ts.text(vidObj.currentTime);
			
		});
	}
	
});


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


function screenControl(video, finalVid) {
	
	// video container variables
     var videoNext = video,
    	 videoLast = video-1,
    	 videoLoad = video+1;

    // video object variables
    var videoA= $('#' + videoLast)[0],
		videoB= $('#' + videoNext)[0],
		videoC= $('#' + videoLoad)[0];

    $(this).attr('nextVid', videoNext);

	$('#'+ videoLast)
		.removeClass("fullscreen")
		.removeAttr("autoplay")
		.addClass("hidden")
		.removeAttr('loop')
	;

  	$('#'+ videoNext)
  		.removeClass("hidden")
  		.addClass("fullscreen")
  		.attr('loop',true)
  	;
	
	if (video > 1) {
		console.log('video '+video);
		videoA.pause();
	}
	else{
		console.log('final video '+finalVid);
		
		$('#'+ finalVid)
			.removeClass("fullscreen")
			.removeAttr("autoplay")
			.addClass("hidden")
			.removeAttr('loop')
		;

		$('#'+finalVid)[0].pause();
	}
  	
  	videoB.play();


// debug notes - using these to test video performance and check for sameframe display.

	// $('#' + videoLast)[0].addEventListener('stalled',currentStall,false);
	// 	function currentStall(e) {
	// 		if(!e) { e = window.event; }
	// 		// What you want to do after the event
	// 		console.log("'\033[90m:Whoops, I'm stalled out: "+ e);
	// 		var buffer = $('#'+videoLast).get(0).buffered.end(0);
	// 		var end = $('#'+videoLast).get(0).duration;
	// 		var progressRatio = buffer/end;
	// 		if (progressRatio > 0.01){
	// 			$('.swap')
	// 			.addClass("hidden");
	// 		};
	// 		console.log("video "+ videoLast +" ratio: "+progressRatio);

	// 	}
    
 //    $('#' + videoNext)[0].addEventListener('canplay',playThrough,false);
	// 	function playThrough(e) {
	// 		if(!e) { e = window.event; }
	// 		// What you want to do after the event
	// 		console.log("'\033[90m:I can totally play!: "+ e);
	// 	}
    
}