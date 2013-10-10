socket.on('connect', function () {
  socket.emit('role', 'setup', function (error) {
  if (!error) return;
  	socket.disconnect();
	$('#connection').trigger('disconnected');
	message('setup connected, please do not connect a server just now.');
  });
 });

