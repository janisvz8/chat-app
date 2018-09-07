var express = require('express');
var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

var server = require('http').createServer(app);
var io = require('socket.io')(server, {log:false, origins:'*:*'});

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/public/index.html')
});

app.use(express.static('public'));

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

server.listen(process.env.PORT || 3001);