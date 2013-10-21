socket.on('connect', function () {
	socket.emit('role', 'control', function (error) {
		if (!error) return;
		  socket.disconnect();
		  $('#connection').trigger('disconnected');
		  message('There is already a control connected');
		});
});

$(document).on('click', '.send-video', function(e){
	var curVid = document.getElementsByClassName('visible')[0].getAttribute("id");
	var nxtVid = parseInt($(this).attr('nextVid'));

	video_swap(curVid, nxtVid);

	$.getJSON('/tmp/'+nxtVid+'.json', function(data) {
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
	
	console.log(cur+' this is cur within video_swap');

	cur.classList.toggle('hidden');
	cur.classList.toggle('visible'); // for use with selectors

	nxt.classList.toggle('hidden'); 
	nxt.classList.toggle('visible');

	cur.pause();
	nxt.play();
};