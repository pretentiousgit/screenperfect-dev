socket.on('connect', function () {
	socket.emit('role', 'control', function (error) {
		if (!error) return;
		  socket.disconnect();
		  $('#connection').trigger('disconnected');
		  message('There is already a control connected');
		});
});

$('#controlSpots').on('click', '.send-video', function(e){

	var curVid = $('.fullscreen').attr('id');
	var nxtVid = parseInt($(this).attr('nextVid'));

	video_swap(curVid, nxtVid);

	$.getJSON('/tmp/'+videoNext+'.json', function(data) {
		for (var i in data.spots) {
			var skeleton = $('<a class="send-video">&nbsp;</a>');
        	$(skeleton).attr('nextvid', data.spots[i].link);
        	$(skeleton).attr('style', data.spots[i].css);
        	$("#controlSpots").html(skeleton);
	 }
	});

	message('emitted \'' + nxtVid + '\'');
    socket.emit('control event', nxtVid);

	return false;
});   	

function video_swap(from_id, to_id){
	var cur = document.getElementById(from_id);
	var nxt = document.getElementById(to_id);
	var videoA = cur[0]; //gets <video> element itself
	var videoB = nxt[0];

	cur.classList.toggle('hidden');
	nxt.classList.toggle('hidden');

	videoA.pause();
	videoB.play();
};
 

	/*
		function change_video(from_id, to_id) {
			// NOTE: try to avoid id arthimetic like from_id+1

		}

		call it like this:

		var videoNext = parseInt($(this).attr('nextVid')),
    	videoCurrent = $('.fullscreen').attr('id'),
    
    	message('emitted \'' + videoNext + '\'');
    	socket.emit('control event', videoNext);

		change_video(videoCurrent, videoNext)

		// hotspot reader
		...

	*/