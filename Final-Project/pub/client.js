var socket = io();

var vm = new Vue({
    el: "#app",
    data: {
        chatLog: [],
        playerList: [],
        currentPlayer: "",
        gameBoard: []
    },
    methods: {
        updateBoard(getxcord, getycord){
            //make board in for loop that when made knows its x and y possition then set click to report back the posistion.
        },
        makeclickyboard(){
            //use vue
        }
    },
    computed:{
    }
});
