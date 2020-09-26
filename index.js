var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});
server.listen(5000, function () {
    console.log('starting sever on port 5000');
});


var rooms = {};
var players = {};
io.on('connection', function (socket) {
    socket.on('new player', function () {
        // for later
    })
    socket.on('joinroom', function (roomname) {
        socket.join(roomname);
        players[socket.id] = roomname;
        if (rooms[roomname] == null) {
            rooms[roomname] = goal();
        }
        else {
            let t = shuffle();
            io.to(roomname).emit('start', rooms[roomname], t);
        }
    })
    socket.on('move', function(board){
        io.to(players[socket.id]).emit('update', board, socket.id);
    })
});

function goal() {
    var goal = [];
    // prevent prevents an impossible goal case where more than 4 of the same number is generated
    var prevent = [0,0,0,0,0,0];
    for (var i = 0; i < 9; i++) {
        let t = rng(0, 6);
        while (prevent[t]==4){
            t = rng(0,6);
        }
        goal[i] = t;
        prevent[t]++;
    }
    return goal;
}
function shuffle() {
    let b = [-1, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]; // -1 is the "open space"
    for (var i = 0; i < b.length; i++) {
        let t = rng(i, b.length);
        let s = b[i];
        b[i] = b[t];
        b[t] = s;
    }
    var board = [];
    for (var i=0; i<5; i++){
        let t = [];
        for (var j=0; j<5; j++){
            t[j] = b[i*5+j];
        }
        board[i] = t;
    }
    return board;
}
function rng(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}