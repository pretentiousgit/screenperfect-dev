var app = require('http').createServer(handler)
  , fs = require('fs')
  , io = require('socket.io').listen(app, { log: false })
  , D = require('daimio')
  , mongo = require('mongodb')
  , db = new mongo.Db('screenperfect', new mongo.Server('localhost', 27017, {auto_reconnect: true}), {w: 0});

D.Etc.db = db // expose DB connection to Daimio

var client_html = fs.readFileSync(__dirname+'/daimio_test.html', 'utf8')
  , admin_html  = fs.readFileSync(__dirname+'/daimio_test_admin.html', 'utf8')

function handler (req, res) {
  if(req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'})
    res.end()
    return
  }
  
  if(req.url.replace(/\/$/, '').split('/').slice(-1)[0] == 'admin') {
    res.writeHead(200, {"Content-Type": "text/html"})
    res.end(admin_html)
    return
  }
  
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(client_html)
}


io.on('connection', function (socket) {
  socket.on('get-data', function (data) {
    var game = data.game
      , session = data.session || 1 // TODO: randomize
      , query = game ? {_id: new mongo.ObjectID(game)} : {}
    
    console.log(query, data)
    
    D.Etc.db.collection('games', function(err, c) {
      c.find(query).limit(1).toArray(function(err, games) {
        socket.emit('game-data', games[0])
      })
    })
  })
  
  // TODO: track active video and bounce it to new clients on connection
  // TODO: multiple games and sessions
  
  socket.on('save-game', function (game) {
    db.collection('games', function(err, c) {
      if(game._id)
        game._id = mongo.ObjectID(game._id)
      
      c.save(game) // sync-style is ok here, because we're not waiting for confirmation

      db.collection('history', function(err, c) {
        c.insert({cron: new Date(), game: game}) 
      })

      io.sockets.emit('game-data', game)
    })
  })
  
  socket.on('bounce', function (data) {
    io.sockets.emit('bounced', data)
    console.log(['bouncing', data])
  })
})


db.open(function(err, db) {
  if(err) return onerror('DB refused to open: ', err)
  app.listen(8888)
})

