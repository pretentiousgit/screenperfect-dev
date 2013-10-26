socket.on('connect', function(e) {
	//on connection, tell the server what kind of client you are. This is a listener.
	socket.emit('listener', function (error) {
		if (!error) return;
		socket.disconnect();
		$('#connection').trigger('disconnected');
		message('Server thinks only one listener can be connected'); // debug message
	});
});

socket.on('control event', function(e) {
	// connection passes server's current video number to listener clients
	if (e){ // needs to be adjusted slightly, does not detect if video is 1
		
		video_swap(e);
		console.log(e);
	}
	
});


function video_swap(to_id){
	var cur = document.getElementsByClassName('visible')[0].getAttribute("id");
	var nxt = document.getElementById(to_id);
	
	console.log(cur+' this is cur within video_swap');

	cur.classList.toggle('hidden');
	cur.classList.toggle('visible'); // for use with selectors

	nxt.classList.toggle('hidden'); 
	nxt.classList.toggle('visible');

	cur.pause();
	nxt.play();
};

