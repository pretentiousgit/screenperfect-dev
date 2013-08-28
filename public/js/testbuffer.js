socket.on('connect', function () {
    socket.emit('listener', function (error) {
        if (!error) return;
          socket.disconnect();
          $('#connection').trigger('disconnected');
          message('There is already a listener connected');
        });
});


$(function (){
var vid = $('#v0')[0];

$('#v0').on('play', function() {
    console.log('playing');
    setInterval(function() { // needs to only do it while video is playing.
        $('#time').html(vid.currentTime);
        socket.emit('timestamp', vid.currentTime);
    }, 100);
});

});