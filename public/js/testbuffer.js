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
    
    // setTimeout(function() {
    //     vid.pause();
    //     setInterval(function() {
    //             vid.currentTime += (1 / 29.97);
    //     }, 2000);
    // }, 32000);
    $('v0').on('canplay', function() {
        socket.emit(timestamp, vid.currentTime);
    });

$('#v0').on('play', function() {
    console.log('playing');
    setInterval(function() { // needs to only do it while video is playing.
        $('#time').html(vid.currentTime);
        console.log(vid.currentTime);
        socket.emit('timestamp', vid.currentTime);
    }, 100);
    socket.broadcast.emit('playNow');
});

});