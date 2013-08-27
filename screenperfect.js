var express = require('express'),
    sio = require('socket.io'),
    path = require('path'),
    wrench = require('wrench'),
    exec = require('child_process').exec,
    util = require('util'),
    Files = {}, fs = require('fs'),
    eavesdropper = 0,
    json, app = express.createServer();
require('sugar')

//express setup
app.configure(function () {
    app.set('views', __dirname);
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.logger('\033[90m:date :method :url :response-time\\ms\033[0m \033[31m:referrer \033[0m'));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.use(express.static(__dirname + '/public'));
});

// wrench looks pretty cool and this works reasonably well though you could always replace
// it with a simple loop that loops through each /media directory, if it finds one it sets
// the id to the name of that directory (ie. 'A') and then sticks everything it finds inside
// it into that id. This would then expand well past E and you wouldn't have to write any 
// more code!

// ADDITIONALLY:
// rearchitecting this so that it passes a JSON array with the video name, all the hotspots in one pass


app.locals.videoList = wrench.readdirSyncRecursive(path.join(__dirname, 'public', 'tmp'));

var controlList = wrench.readdirSyncRecursive(path.join(__dirname, 'public', 'video', 'webm', 'A'));
var clientList = wrench.readdirSyncRecursive(path.join(__dirname, 'public', 'video', 'webm', 'B'));

// hidden files that keep re-implementing are the worst. In future, wipe all non-video files in dir.
var keyToDelete = ".DS_Store"; 
    delete controlList[keyToDelete];
    delete clientList[keyToDelete];

var controlLength = controlList.length;
var clientLength = clientList.length;

app.locals.videoA  =  controlList;
app.locals.videoB = clientList;

app.get('/control', function (req, res, next) {
    res.render('control');
});

app.get('/setup', function (req, res, next) {
    res.render('setup');
});

// here i'd do something like replace below app.gets with app.get('/client/:id') and
// res.render('client' + req.params.id). if you were to take it even further you could
// res.render('client', {id: req.params.id, videos: videos[req.params.id]}) basically
// up above instead of app.locals you'd put the videos into an object like video = 
// {a: wrench..., b: wrench..., etc} and you'd only need one client.ejs file which would
// only loop through the videos given to it.

app.get('/client', function (req, res, next) {
    res.render('client');
});

app.get('/clientb', function (req, res, next) {
    res.render('clientB');
});

//socket stuff
var io = sio.listen(app),
    control = false, // this is a flag. it permits a single controller.
    listener; 

//start server
app.listen(3003, function () {
    var addr = app.address();
    console.log('   app is listening on\033[31m http://' + addr.address + ':' + addr.port +'\033[0m');
    console.log('controlList '+controlList);
    console.log('clientList '+clientList);
});

function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        });
}

io.sockets.on('connection', function (socket) { //send various events to connected sockets
				
        socket.on('control event', function (e) {
            socket.broadcast.emit('control event', e);
            console.log('control event ' + e);
            return false;
        });

        socket.on('setup event', function (e) {
            socket.broadcast.emit('setup event', e);
            console.log(e);

            var nameOfFile = e[0]; // this needs to be stringified and parsed to get appropriate file id
            fs.writeFile('tmp/' + nameOfFile + ".json", JSON.stringify(e), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(nameOfFile + " Divlist was saved!");
                }
            });
        });

		socket.on('listener', function (listener, e) {
			eavesdropper++;
			console.log('eavesdropper '+ eavesdropper+' connected');
			socket.broadcast.emit('announcement', 'eavesdropper '+ eavesdropper +' connected' );
            
            socket.emit('video quant', clientLength );
            socket.emit('video list', clientList);
		});


        socket.on('role', function (role, func) { // uses boolean gate to set controller.
            console.log('socket assuming role ' + role); // role passes the var from incoming socket
            if (control){ // if control is true, the function just returns.
             	func(true);
            }
			else {
                control = socket.control = true;
                socket.broadcast.emit('announcement', 'control connected');
                func(false);
            }
            
        });

        socket.on('timestamp', function (timestamp, e){
            socket.broadcast.emit('time', timestamp);
        });

        //if the control disconnects then tell the clients.
        socket.on('disconnect', function () {
            if (!socket.control) { 
                socket.broadcast.emit('announcement', 'eavesdropper has disconnected');
                return};
            control = false;
            socket.broadcast.emit('announcement', 'control disconnected');
        });

        //// uploader controls
        //   	socket.on('Start', function (data) { //data contains the variables that we passed through in the html file
        // 			var Name = data['Name'];
        // 			Files[Name] = {  //Create a new Entry in The Files Variable
        // 				FileSize : data['Size'],
        // 				Data	 : "",
        // 				Downloaded : 0
        // 			}
        // 			var Place = 0;
        // 			try{
        // 				var Stat = fs.statSync('Temp/' +  Name);
        // 				if(Stat.isFile())
        // 				{
        // 					Files[Name]['Downloaded'] = Stat.size;
        // 					Place = Stat.size / 524288;
        // 				}
        // 			}
        // 	  		catch(er){} //It's a New File
        // 			fs.open("Temp/" + Name, 'a', 0755, function(err, fd){
        // 				if(err)
        // 				{
        // 					console.log(err);
        // 				}
        // 				else
        // 				{
        // 					Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
        // 					socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
        // 				}
        // 			});
        // 	});
        // 	
        // 	socket.on('Upload', function (data){
        // 			var Name = data['Name'];
        // 			Files[Name]['Downloaded'] += data['Data'].length;
        // 			Files[Name]['Data'] += data['Data'];
        // 			if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
        // 			{
        // 				fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
        // 					var inp = fs.createReadStream("Temp/" + Name);
        // 					var out = fs.createWriteStream("Video/" + Name);
        // 					util.pump(inp, out, function(){
        // 						fs.unlink("Temp/" + Name, function () { //This Deletes The Temporary File
        // 							exec("ffmpeg -i Video/" + Name  + " -ss 01:30 -r 1 -an -vframes 1 -f mjpeg Video/" + Name  + ".jpg", function(err){
        // 								socket.emit('Done', {'Image' : 'Video/' + Name + '.jpg'});
        // 							});
        // 						});
        // 					});
        // 				});
        // 			}
        // 			else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
        // 				fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
        // 					Files[Name]['Data'] = ""; //Reset The Buffer
        // 					var Place = Files[Name]['Downloaded'] / 524288;
        // 					var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
        // 					socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
        // 				});
        // 			}
        // 			else
        // 			{
        // 				var Place = Files[Name]['Downloaded'] / 524288;
        // 				var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
        // 				socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
        // 			}
        // 		});  
        //   
        // });
});