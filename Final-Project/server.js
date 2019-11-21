var express = require('express');
var app = express();
var http = require('http')
var server = http.Server(app)
var socketio = require("socket.io");
var io = socketio(server);
app.use(express.static("pub"));
//---------------------------------------------
//TODO: add/remove users on connect/disconnect
//TODO: implement limboard
//TODO: finish click handling
//user-related variables
var usernameList = new Object();
var guestNumber = 1;

//board variables
var percentageBombs = .2;
var board = null; //0 is empty space, 1 is bomb
var limboard = null; //serves as intermediary, tracks num of bombs around each square.
var displayedBoard = null; // 0 is empty space, 1 is bomb, 2 is clicked bomb, 3 is clicked empty space

//game-state variables
var userTakingTurn = null; //by socketID

socket.on("updateBoard", function(xCD, yCD){
    //if it is their turn, and they took a move
    if(userTakingTurn == socket.id){

    }
    else{
        //do nothing, dont tell them to update, it wasn't their turn.
    }
});

function handleClickAt(xCD, yCD){
    if(clickedBomb()){
        board[xCD][yCD] == 2;
        displayedBoard[xCD][yCD] == 2;
    }
    else{

    }
}

function numBombAround(xCD, yCD){
    var bombCount = 0;
    if(isValidSpace && board[xCD-1][yCD-1] == 1) bombCount++;
    if(isValidSpace && board[xCD][yCD-1] == 1) bombCount++;
    if(isValidSpace && board[xCD+1][yCD-1] == 1) bombCount++;
    if(isValidSpace && board[xCD-1][yCD] == 1) bombCount++;
    if(isValidSpace && board[xCD+1][yCD] == 1) bombCount++;
    if(isValidSpace && board[xCD-1][yCD+1] == 1) bombCount++;
    if(isValidSpace && board[xCD][yCD+1] == 1) bombCount++;
    if(isValidSpace && board[xCD+1][yCD+1] == 1) bombCount++;
    return bombCount;
}

function isValidSpace(xCD, yCD){
    if(xCD < 0|| yCD < 0) return false;
    if(xCD >= board.length || yCD >= board.length) return false;
    return true;
}

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
    console.log("User Connected")
    //add username to object
    socket.on('disconnect', function(){
        //remove username from object
        console.log("User Disconnected")
    });
})

server.listen(80, function(){
    console.log('listening on port 80');
});