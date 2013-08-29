socket.on('connect', function () {
    socket.emit('listener', function (error) {
        if (!error) return;
          socket.disconnect();
          $('#connection').trigger('disconnected');
          message('There is already a listener connected');
        });
    console.log('connected');
    document.getElementById('v0').play();
});

socket.on('play', function(e){
    console.log('play command logged '+ e);
    document.getElementById('v0').currentTime=e;
    document.getElementById('v0').play();
})


// $(function (){
// var vid = $('#v0')[0];

// $('#v0').on('play', function() {
//     console.log('playing');
//     setInterval(function() { // needs to only do it while video is playing.
//         $('#time').html(vid.currentTime);
//         socket.emit('timestamp', vid.currentTime);
//     }, 100);
// });

// });