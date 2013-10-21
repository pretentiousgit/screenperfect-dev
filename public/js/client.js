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
	if (e){ // needs to be adjusted slightly, does not detect if video is 1
		var curVid = document.getElementsByClassName('visible')[0].getAttribute("id");
		var nxtVid = e;

		video_swap(curVid, nxtVid);
		
		console.log(e);
	}
	
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