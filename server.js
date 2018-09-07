var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var cors = require('cors');

app.use(cors()); 
app.use(express.static('public'));

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/public/index.html')
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