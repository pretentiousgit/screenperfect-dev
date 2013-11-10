var app = require('http').createServer(handler)
  , fs = require('fs')
  , io = require('socket.io').listen(app, { log: false })
  , D = require('daimio')
  , mongo = require('mongodb')
  , db = new mongo.Db('screenperfect', new mongo.Server('localhost', 27017, {auto_reconnect: true}), {w: 0});

D.Etc.db = db // expose DB connection to Daimio

function handler (req, res) {
  // NOTE: we're grabbing these fresh in response to each request for development. DO NOT DO THIS IN PRODUCTION.
  // move these lines outside the handler so the html is cached over the lifetime of the server.
  var menu_html = fs.readFileSync(__dirname+'/daimio_sp_menu.html', 'utf8')
    , client_html = fs.readFileSync(__dirname+'/daimio_sp_client_control.html', 'utf8')
    , admin_html  = fs.readFileSync(__dirname+'/daimio_sp_admin.html', 'utf8')
    , daimio_js  = fs.readFileSync(__dirname+'/daimio_composite.js', 'utf8')

  if(req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'})
    res.end()
    return
  }
  
  if(req.url === '/daimio_composite.js') {
    res.writeHead(200, {"Content-Type": "application/javascript"})
    res.end(daimio_js)
    return
  }
  
  if(req.url.replace(/\/$/, '').split('/').slice(-1)[0] == 'admin') {
    res.writeHead(200, {"Content-Type": "text/html"})
    res.end(admin_html)
    return
  }
  
  if(req.url.match(/(client|control)\/?$/)) {
    res.writeHead(200, {"Content-Type": "text/html"})
    res.end(client_html)
    return
  }
  
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(menu_html)
}


io.on('connection', function (socket) {
  socket.on('get-games', function (data) {
    var query = {}
    
    console.log(query, data)
    
    try {
      D.Etc.db.collection('games', function(err, c) {
        c.find(query).toArray(function(err, games) {
          socket.emit('games-data', games)
        })
      })
    } catch (e) {return false}
    
  })
  
  socket.on('get-data', function (data) {
    var game_id = data.game
      , session = data.session || 1 // TODO: randomize
      , query = {}
      
    if(!game_id || game_id.length != 24)
      return false
    
    try {
      query = {_id: new mongo.ObjectID(game_id)}      

      console.log(query, data)
    
      socket.join(game_id)
    
      D.Etc.db.collection('games', function(err, c) {
        c.find(query).limit(1).toArray(function(err, games) {
          io.sockets.in(game_id).emit('game-data', games[0])
        })
      })
    } catch (e) {return false}
  })
  
  // TODO: track active video and bounce it to new clients on connection
  // TODO: allow local video paths to punch through, then change the mongo urls
  // TODO: move to joyent
  // YAGNI: multiple sessions
    
  socket.on('save-game', function (game) {
    try {
      db.collection('games', function(err, c) {
        if(game._id)
          game._id = mongo.ObjectID(game._id)
      
        console.log(game)

        c.save(game) // sync-style is ok here, because we're not waiting for confirmation

        db.collection('history', function(err, c) {
          c.insert({cron: new Date(), game: game}) 
        })

        io.sockets.in(game._id).emit('game-data', game)
      })
    } catch (e) {return false}
  })
  
  socket.on('bounce', function (data) {
    socket.broadcast.emit('bounced', data)
    console.log(['bouncing', data])
  })
})


db.open(function(err, db) {
  if(err) return onerror('DB refused to open: ', err)
  app.listen(8888)
})

