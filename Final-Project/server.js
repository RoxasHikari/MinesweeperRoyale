var express = require('express');
var app = express();
var http = require('http')
var server = http.Server(app)
var socketio = require("socket.io");
var io = socketio(server);
app.use(express.static("pub"));
//---------------------------------------------

//TODO: spectator list
//TODO: Create New User/LoginAs
//TODO: If a user disconnects, remove them from spectators/playing
//TODO: if they click a bomb, take them out of turn rotation/make them lose

//user-related variables
var usernameList = new Object();
var numberOfSpectators = 0;

//board variables
var percentageBombs = .2;
var board = null; //0 is empty space, 1 is bomb
var limboard = null; //tracks num of bombs around each square. bomb square is -1
var displayedBoard = null; // 0 is empty(unclicked) space, 1 is bomb(revealed), 2 is clicked empty space

//game-state variables
var turnOrderOfUsers = []; //array that stores currently playing players.
var userTakingTurn = null; //by socketID

function handleClickAt(xCD, yCD){
    if(isValidSpace(xCD, yCD)){
        if(bombAt(xCD, yCD)){
            bombClickHandler(xCD, yCD);
        }
        else{
            safeClickHandler(xCD, yCD);
        }
    }
}

function bombClickHandler(xCD, yCD){
    //if its not already displayed then display it
    if(displayedBoard[xCD][yCD] == 0){
        displayedBoard[xCD][yCD] == 1;
        io.emit('updateBoardAt', xCD,yCD,limboard[xCD][yCD]);
    }
    //TODO: make them lose
}

function safeClickHandler(xCD, yCD){
    //if its not already displayed then display it
    if(displayedBoard[xCD][yCD] == 0){
        handlerHelper(xCD, yCD);
    }
}
function handlerHelper(xCD, yCD){
        //if I have no bombs around me and im not revealed
        if(limboard[xCD][yCD] == 0 && displayedBoard[xCD][yCD] == 0){
            //reveal me.
            displayedBoard[xCD][yCD] = 2;
            io.emit('updateBoardAt', xCD, yCD, limboard[xCD][yCD]);
            //check others around me, call myself on them
            handlerHelper(xCD-1, yCD-1);
            handlerHelper(xCD, yCD-1);
            handlerHelper(xCD+1, yCD-1);
            handlerHelper(xCD-1, yCD);
            handlerHelper(xCD+1, yCD);
            handlerHelper(xCD-1, yCD+1);
            handlerHelper(xCD, yCD+1);
            handlerHelper(xCD+1, yCD+1);
        }
        //if im a square that has a bomb around me
        else{
            //reveal yourself if not already revealed, update client about you, and your value
            if(displayedBoard[xCD][yCD] == 0){
                displayedBoard[xCD][yCD] = 2;
                io.emit('updateBoardAt', xCD, yCD, limboard[xCD][yCD]);
            }
        }
}

function numBombAround(xCD, yCD){
    var bombCount = 0;
    //check if its a bomb space
    if(isValidSpace(xCD,yCD) && bombAt(xCD, yCD)) return -1;
    //check around space
    if(isValidSpace(xCD,yCD) && board[xCD-1][yCD-1] == 1) bombCount++;
    if(isValidSpace(xCD,yCD) && board[xCD][yCD-1] == 1) bombCount++;
    if(isValidSpace(xCD,yCD) && board[xCD+1][yCD-1] == 1) bombCount++;
    if(isValidSpace(xCD,yCD) && board[xCD-1][yCD] == 1) bombCount++;
    if(isValidSpace(xCD,yCD) && board[xCD+1][yCD] == 1) bombCount++;
    if(isValidSpace(xCD,yCD) && board[xCD-1][yCD+1] == 1) bombCount++;
    if(isValidSpace(xCD,yCD) && board[xCD][yCD+1] == 1) bombCount++;
    if(isValidSpace(xCD,yCD) && board[xCD+1][yCD+1] == 1) bombCount++;
    return bombCount;
}

function bombAt(xCD, yCD){
    if(board[xCD][yCD] == 1){
        return true;
    }
    return false;
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
    generateLimbo(size);
}

function generateLimbo(size){
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            limboard[i][j] = numBombAround(i,j);
        }
    }
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
    limboard = new Array(size);
    displayedBoard = new Array(size);
    for(let i=0;i<size;i++){
        board[i] = new Array(size);
        limboard[i] = new Array(size);
        displayedBoard[i] = new Array(size);
    }
    //initialize all to 0
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            board[i][j] = 0;
            limboard[i][j] = 0;
            displayedBoard[i][j] = 0;
        }
    }
}

io.on('connection', function(socket){
    console.log("User Connected")
    //default them to guest
    usernameList[socket.id] = "guest";

    socket.on("loginAs", function(username, password, callbackFunctionOnClient){
        //TODO: MongoDB lookup 
        // check username is in DB, and hash of PW = hash stored in DB
        if(){
            //if true, change their username to the username
        }
        //else failed
        else{
            console.log("User failed to login as:" + username);
            callbackFunctionOnClient(false);
        }
    });

    socket.on("createUser", function(username, password, callbackFunctionOnClient){
        //TODO: if username is not already in MongoDB
        if(){
            //add the username and hashed PW to the DB
        }
        else{
            callbackFunctionOnClient(false);
        }
    });

    socket.on("newClickAt", function(xCD, yCD){
        //if it is their turn,
        if(userTakingTurn == socket.id){
            handleClickAt(xCD, yCD);
        }
        else{
            console.log(usernameList[socket.id] + " tried to make a move while not their turn.");
        }
    });
    socket.on('disconnect', function(){
        //remove username from object
        console.log("User Disconnected")
        usernameList[socket.id] = null;
    });
})

server.listen(80, function(){
    console.log('listening on port 80');
});