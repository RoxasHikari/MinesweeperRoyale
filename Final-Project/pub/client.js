var io = require('socket.io');
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
    },
    computed:{
    }
});
