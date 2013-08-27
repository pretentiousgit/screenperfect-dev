var socket = io.connect();

//simple bindings for standard socket.io events
socket.on('connect', function() {
  $('#connection').trigger('connected');
});

socket.on('reconnecting', function() {
  $('#connection').trigger('reconnecting');
});

socket.on('reconnect', function () {
  $('#connection').trigger('connected');
});

socket.on('error', function () {
  $('#connection').trigger('disconnected');
});

//dom stuff for triggered events
$('#connection').on('connected', function() {
  message('connected')
}).on('reconnecting', function() {
  message('reconnected')
}).on('disconnected', function() {
  message('disconnected')
});

//on an announcement prepend a new event
socket.on('announcement', function (msg) {
  message(msg);
});

//log messages to the console
var message = function message(msg, level) {
  console.log(msg);
};