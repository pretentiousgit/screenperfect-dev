// get within 50ms, try not to fry the platform. 29.6fps, 1440x HD Galaxy TAB2/Nexus10. High rez.
// content at full HD


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
    document.getElementById('v0').currentTime = e - 0.0290245; // e + 0.0290245 is perfect on one machine. this adjusts client time to allow for lag.
    document.getElementById('v0').playbackRate = 1.00000000001; // ClientB is the control window, Client is the mobile client
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