var app = require('http').createServer(handler)
  , fs = require('fs')
  , io = require('socket.io').listen(app, { log: false })
  , D = require('daimio')

var html = fs.readFileSync(__dirname+'/daimio_test.html', 'utf8')

var onerror = function(err) {
  return console.log(err)
}

// Configure our HTTP server 
function handler (req, res) {
  if(req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} )
    res.end()
    return
  }
  
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(html)
}


io.on('connection', function (socket) {
  
  socket.on('bounce', function (data) {
    data.user = user_id
    io.sockets.emit('bounced', data)
    console.log(['bouncing', data])
  })

})

app.listen(8888)
