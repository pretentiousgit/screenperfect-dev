var playTime,
    pauseTime,
    current,
    timeFromControl;

socket.on('connect', function () {
    socket.emit('listener', function (error) {
        if (!error) return;
          socket.disconnect();
          $('#connection').trigger('disconnected');
          message('There is already a listener connected');
        });
    console.log('connected');
});

socket.on('play', function(e){
    var clientTime = document.getElementById('v0').currentTime;
    console.log('time in other window '+ e);
    console.log('currentTime this window '+ clientTime);
    console.log('time difference '+ (e-clientTime));
    document.getElementById('v0').currentTime = e + 0.024;
    document.getElementById('v0').playbackRate = 1.00000000001;
    document.getElementById('v0').play();
    $('#time').text(e - clientTime);
});

socket.on('pause', function(e){
    var clientTime = document.getElementById('v0').currentTime;
    console.log('time in other window '+ e);
    console.log('this window '+ clientTime);
    console.log('time difference '+ (e-clientTime));
    document.getElementById('v0').pause();
    $('#time').text(e - clientTime);
});

socket.on('time', function(e){
    var curtime = document.getElementById('v0').currentTime;
    curtime = e - curtime;
    console.log('difference '+ curtime);
    timeFromControl = e;
});

setInterval(function() {
    $('#clock').text(current);
    current = document.getElementById('v0').currentTime;
    //document.getElementById('v0').currentTime = timeFromControl;
    // $('#gap').text(gapCount);
}, 24);