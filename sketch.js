var socket;
var myPlayer;
var myId;

//everything that loads before the game starts
function preload() {
    holyBread = loadImage('assets/holyBread.png')
    //write code
}

//first thing to be called when the game is started; only happens once
function setup() {
    players = [];
    myId = 0;

    socket = io();
    
    socket.emit("imReady", {name: "Steve"});

    socket.on("yourId", function(data) {
        myId = data.id;
    });

    socket.on("newPlayer", function(data) {
        var player = new Player(data.id, data.name, data.x, data.y);
        players.push(player);
    });

    socket.on("initPack", function(data) {
        for(var i in data.initPack) {
            var player = new Player(data.initPack[i].id, data.initPack[i].name, data.initPack[i].x, data.initPack[i].y);
            players.push(player);
            console.log(myId);
        }
    });

    socket.on("updatePack", function(data) {
        for(var i in data.updatePack) {
            for(var j in players) {
                if(players[j].id === data.updatePack[i].id) {
                    players[j].location.x = data.updatePack[i].x;
                    players[j].location.y = data.updatePack[i].y;
                    players[j].angle = data.updatePack[i].angle;
                }
            }
        }
    });

    socket.on("someoneLeft", function(data) {
        for(var i in players) {
            if(players[i].id === data.id) {
                players.splice(i, 1);
            }
        }
    });
    

    createCanvas(windowWidth, windowHeight);
}



//fill(color)
//rect(x, y, w, h);

//beginShape();
//vertex(x, y);
//endShape(CLOSE);

//this is drawn many times per second (fps)
function draw() {
    background(255, 200, 100);
    sendInputData();


    rect(mouseX, mouseY, 10, 10);
    for (var i in players) {
        if (players[i].id === myId) {
            translate(width/2 - players[i].location.x, height/2 - players[i].location.y);
        }
    }

    fill(51, 0, 0);
    
    rect(0, 0, 600, 600);


    for (var i in players) {
        players[i].draw();
    }
}


//the player object constructor

var Player = function(id, name, x, y) {
    this.id = id;
    this.name = name;
    this.location = createVector(x, y);
    this.angle = 0;

    

    this.draw = function() { 
        
        push();
        translate(this.location.x, this.location.y);
        rotate(this.angle); 
        image(holyBread, 0, -50);
        pop();

        // this.speed.x = cos(angle) * 3;
        // this.speed.y = sin(angle) * 3;

        // if (this.speed.x > 3){
        //     this.speed.x = 3;
        // }
        // if (this.speed.y > 3){
        //     this.speed.y = 3;
        // }

        // this.location.x += this.speed.x;
        // this.location.y += this.speed.y; 
    }
    return this;
}


function sendInputData() {
    var angle = atan2(mouseY - windowHeight/2, mouseX - windowWidth/2);
    socket.emit("inputData", {mouseX, mouseY, angle, windowWidth, windowHeight});
}

