var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/public/index.html')
});

app.use(express.static('public'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

users = [];
io.on('connection', function(socket) {
    console.log('A user connected');
    socket.on('setUsername', function(data) {
        console.log(users);
        if(users.indexOf(data) > -1) {
            socket.emit('userExists', data + ' username is taken! Try some other username.');
            
        } else {
            users.push(data); 
            io.sockets.emit('broadcast',{ description: data });
            socket.emit('userSet', {username: data});
        }
    })
    //io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
    socket.on('disconnect', function(data) {
        console.log('disconnected');
        io.sockets.emit('broadcast',{ description: data + 'disconnected!'});
    });

    socket.on('messages', function(data){
        socket.emit('thread', data);
        socket.broadcast.emit('thread', data);
    });
});

server.listen(process.env.PORT || 3000);