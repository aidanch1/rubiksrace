var socket = io();

socket.emit('new player'); // DOES NOTHING (but probably will need once i make username update)

//better canvas locations
//button to "slam down the border" when you think you have won

var menu = document.getElementById('menu');
var roomname = document.getElementById('roomname');
var join = document.getElementById('join');

var goaldisplay = document.getElementById('goaldisplay');
var yourboard = document.getElementById('yourboard');
var oppboard = document.getElementById('oppboard');
let labels = document.getElementsByTagName('label');
for (var i=0; i<labels.length; i++){
    labels[i].style.display = 'none'// hide for menu to show at the start
} 
goaldisplay.width = 150;
goaldisplay.height = 150;
yourboard.width = 500;
yourboard.height = 500;
oppboard.width = 300;
oppboard.height = 300;
var goalcontext = goaldisplay.getContext('2d');
var yourboardcontext = yourboard.getContext('2d');
var oppboardcontext = oppboard.getContext('2d');
yourboardcontext.lineWidth = 5;
yourboardcontext.strokeStyle = 'gray';
oppboardcontext.lineWidth = 5;
oppboardcontext.strokeStyle = 'gray';

join.onclick = function () {
    menu.style.display = 'none';
    socket.emit('joinroom', roomname.value);
    for (var i=0; i<labels.length; i++){
        labels[i].style.display = 'inline-flex'
    }
}

var color = ['white', 'orange', 'yellow', 'red', 'green', 'blue'];
var board;

socket.on('start', function (goal, boardstart) {
    goalcontext.lineWidth = 5;
    goalcontext.strokeStyle = 'gray';
    for (var j = 0; j < 3; j++) {
        for (var i = 0; i < 3; i++) {
            goalcontext.fillStyle = color[goal[j * 3 + i]];
            goalcontext.beginPath();
            goalcontext.rect(i * 50, j * 50, 50, 50);
            goalcontext.fill();
            goalcontext.stroke();
        }
    }

    board = boardstart;
    displayboard(board, yourboardcontext, 100);
    displayboard(board, oppboardcontext, 60);
})

socket.on('update', function(board, id){
    if (id == socket.id){
        displayboard(board, yourboardcontext, 100);
    }
    else {
        displayboard(board, oppboardcontext, 60);
    }
})

yourboard.addEventListener('click', function (e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; 
    var y = e.clientY - rect.top;
    var col = Math.floor(x/100);
    var row = Math.floor(y/100);
    var moved = false;
    if (col > 0 && board[row][col-1] == -1){
        board[row][col-1] = board[row][col];
        board[row][col] = -1;
        moved = true;
    }
    else if (col < 4 && board[row][col+1] == -1){
        board[row][col+1] = board[row][col];
        board[row][col] = -1;
        moved = true;
    }
    else if (row > 0 && board[row-1][col] == -1){
        board[row-1][col] = board[row][col];
        board[row][col] = -1;
        moved = true;
    }
    else if (row < 4 && board[row+1][col] == -1){
        board[row+1][col] = board[row][col];
        board[row][col] = -1;
        moved = true;
    }
    if (moved){
        socket.emit('move', board);
    }
    
})

function displayboard(board, context, size) {
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            if (board[i][j] == -1) {
                context.fillStyle = 'black';
                context.beginPath();
                context.rect(j * size, i * size, size, size);
                context.fill();
            }
            else {
                context.fillStyle = color[board[i][j]];
                context.beginPath();
                context.rect(j * size, i * size, size, size);
                context.fill();
                context.stroke();
            }

        }
    }
}

