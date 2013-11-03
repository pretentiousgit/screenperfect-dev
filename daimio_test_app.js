var app = require('http').createServer(handler)
  , fs = require('fs')
  , io = require('socket.io').listen(app, { log: false })
  , D = require('daimio')
  , mongo = require('mongodb')
  , db = new mongo.Db('screenperfect', new mongo.Server('localhost', 27017, {auto_reconnect: true}), {w: 0});

D.Etc.db = db // expose DB connection to Daimio

var html = fs.readFileSync(__dirname+'/daimio_test.html', 'utf8')

function handler (req, res) {
  if(req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'})
    res.end()
    return
  }
  
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(html)
}


io.on('connection', function (socket) {
  socket.on('get-data', function (data) {
    var game = data.game
      , session = data.session || 1 // TODO: randomize
    
    socket.emit('game-data', {
      videos: 
        { 1: { urls: { client: "http://sherpa.local/~dann/screenperfect/public/video/webm/A/1A.webm"
                     , control: "http://sherpa.local/~dann/screenperfect/public/video/webm/B/1B.webm"
                     , client_thumb: "http://sherpa.local/~dann/screenperfect/public/image/A/1A.png"
                     , control_thumb: "http://sherpa.local/~dann/screenperfect/public/image/A/1A.png"}
             , spots: [{"css":"top: 37%; left: 40%; width: 30%; height: 25%;","link":"2"}] }
        , 2: { urls: { client: "http://sherpa.local/~dann/screenperfect/public/video/webm/A/2A.webm"
                     , control: "http://sherpa.local/~dann/screenperfect/public/video/webm/B/2B.webm"
                     , client_thumb: "http://sherpa.local/~dann/screenperfect/public/image/A/2A.png"
                     , control_thumb: "http://sherpa.local/~dann/screenperfect/public/image/A/2A.png"}
             , spots: [{"css":"top: 37%; left: 40%; width: 30%; height: 25%;","link":"3"}] }
        , 3: { urls: { client: "http://sherpa.local/~dann/screenperfect/public/video/webm/A/3A.webm"
                     , control: "http://sherpa.local/~dann/screenperfect/public/video/webm/B/3B.webm"
                     , client_thumb: "http://sherpa.local/~dann/screenperfect/public/image/A/3A.png"
                     , control_thumb: "http://sherpa.local/~dann/screenperfect/public/image/A/3A.png"}
             , spots: [{"css":"top: 37%; left: 40%; width: 30%; height: 25%;","link":"1"}] }
        }
    })
  })
  
  // TODO: track active video and bounce it to new clients on connection
  // TODO: save/load from mongo
  // TODO: multiple games and sessions
  
  socket.on('bounce', function (data) {
    io.sockets.emit('bounced', data)
    console.log(['bouncing', data])
  })
})


db.open(function(err, db) {
  if(err) return onerror('DB refused to open: ', err)
  app.listen(8888)
})
