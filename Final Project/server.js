var express = require("express");
var server = express();
bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({extended: true}));

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
    for(let i=0;i<size;i++){
        board[i] = new Array(size);
    }
    //initialize all to 0
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            board[i][j] = 0;
        }
    }
}

server.use(express.static("./pub"));
server.listen(80, function(){
    console.log("Server is now running on port 80.");
})