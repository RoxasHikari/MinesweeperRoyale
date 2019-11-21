var express = require('express');
var app = express();
var http = require('http')
var server = http.Server(app)
var socketio = require("socket.io");
var io = socketio(server);
app.use(express.static("pub"));
//---------------------------------------------
//user-related variables
var usernameList = new Object();
var guestNumber = 1;

//board variables
var percentageBombs = .2;
var board = null;
var displayedBoard = null;

function addUsernameFrom(socketID, username){
    usernameList[socketID] = username;
}

function removeUsernameFrom(socketID){
    usernameList[socketID] = null;
}

function getUserList(){
    var users = [];
    for(var i in usernameList){
        if(usernameList[i] != null)
            users.push(usernameList[i]);
    }
    return users;
}

function createAndSetBoard(size){
    createEmptyBoard(size);
    populateBoard(size);
}

function populateBoard(size){
    var bombsLeftToPlace = Math.floor(((size*size)*percentageBombs));

    while(bombsLeftToPlace != 0){
        placeRandomBomb(size);
        bombsLeftToPlace--;
    }
}

function placeRandomBomb(size){
    var rX = Math.floor(Math.random()*size);
    var rY = Math.floor(Math.random()*size);
    if(board[rX][rY] != 1){
        board[rX][rY] = 1;
    }
    else{
        placeRandomBomb(size);
    }
}

function createEmptyBoard(size){
    board = new Array(size);
    displayedBoard = new Array(size);
    for(let i=0;i<size;i++){
        board[i] = new Array(size);
        displayedBoard[i] = new Array(size);
    }
    //initialize all to 0
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            board[i][j] = 0;
            displayedBoard[i][j] = 0;
        }
    }
}

io.on('connection', function(socket){
    //add username to object    
    console.log("User Connected")
    socket.on('disconnect', function(){
        //remove username from object
        console.log("User Disconnected")
    });
})

server.listen(80, function(){
    console.log('listening on port 80');
});