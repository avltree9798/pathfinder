const MAP_WIDTH = 55;
const MAP_HEIGHT = 36;
const WIDTH = 20;
const HEIGHT = 20;
const UP = 1;
const DOWN = 3;
const LEFT = 0;
const RIGHT = 2;
const SLEEP_MS = 15;
const ANIMATION_SPEED = 10;
class GameObject{
    constructor(y, x, type, ctx){
        if (new.target == GameObject){
            throw new TypeError("GameObject is an abstract class")
        }
        this.x = x;
        this.y = y;
        this.type = type;
        this.ctx = ctx
    }

    update(){

    }

    render(){

    }

    getActualX(){
        return this.x * this.width + this.x
    }

    getActualY(){
        return this.y * this.width + this.y
    }
}

var canvas = document.getElementById("grid");
var ctx = canvas.getContext('2d');

var objects = [];

function update(){
    for(var i=0;i<MAP_HEIGHT;i++){
        for(var j=0;j<MAP_WIDTH;j++){
            objects[i][j].update();
        }
    }
}

function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i=0;i<MAP_HEIGHT;i++){
        for(var j=0;j<MAP_WIDTH;j++){
            objects[i][j].render();
        }
    }
}

function gameLoop(){
    update()
    render()
}

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}1117/

setInterval(gameLoop, ANIMATION_SPEED);
