// initializing socket, connection to server
var socket = io.connect('https://mighty-brushlands-26857.herokuapp.com/');
socket.on('connect', function(data) {
    socket.emit('join', 'Hello server from client');
});

function setUsername() {
    socket.emit('setUsername', document.getElementById('name').value);
};

$('#chatpage').hide();

var user;
    socket.on('userExists', function(data) {
        document.getElementById('error-container').innerHTML = data;
    });

    socket.on('userSet', function(data) {
        user = data.username;
        console.log(user);
        $('#myForm').prepend('<div id="thread"></div>');
        $('#intro').hide();
        $('#chatpage').show();
     });

// listener for 'thread' event, which updates messages
socket.on('thread', function(data) {
    $('#thread').append('<div><b>' + data.user + '</b>: ' + data.message + '</div>');
});

socket.on('broadcast',function(data) {
    //document.getElementById('users').innerHTML = data.description;
    $('#users').append('<a href="#!" class="collection-item"><span class="online"></span>' + data.description + '</a>');
 });

// sends message to server, resets & prevents default form action
$('form').submit(function() {
    var message = $('#message').val();
    socket.emit('messages', {message: message, user: user});
    this.reset();
    return false;
});