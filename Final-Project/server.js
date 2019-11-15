var express = require('express');
var server = express();
var bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({extended: true}));
var http = require('http').createServer(server);
var io = require("socket.io")(http);
//---------------------------------------------

var percentageBombs = .2;
var board = null;
var displayedBoard = null;

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
    console.log('new connection');
})

server.use(express.static("./pub"));
http.listen(80, function(){
    console.log('listening on port 80');
});