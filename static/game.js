
allowedToClick = true;
algorithm = "astar"
draw = false
end_pos = [undefined, undefined]
start_pos = [undefined, undefined]

class Vertex extends GameObject{
    constructor(x, y, type, ctx){
        super(x, y, type, ctx);
        this.width = WIDTH;
        this.height = HEIGHT;
        this.resetObject()
        this.update()
        this.parent = undefined
    }

    resetObject(){
        this.distance_from_start = 0
        this.distance_to_end = -1
        this.heuristic_value = -1
        this.visited = false
        this.parent = undefined
        if(this.type == 'shortestpath'){
            this.type = 'path'
        }
    }

    calculateHeuristicValue(endY, endX){
        this.distance_to_end = Math.abs(endX - this.x) + Math.abs(endY - this.y)
        this.heuristic_value = this.distance_from_start + this.distance_to_end
    }

    update(){
        var color = '';
        if (this.type == 'start'){
            color = 'black';
        }else if (this.type == 'end'){
            color = 'blue';
        }else if (this.type == 'shortestpath'){
            // if(this.color == 'lightblue'){
            //     color = 'blue';
            // }else{
            //     color = 'lightblue';
            // }
            color = 'green';
        }else if(this.visited){
            color = 'lightblue'
        }else if(this.type == 'wall'){
            color = 'red';
        }else if(this.type == 'path'){
            color = 'white';
        }
        this.color = color;
    }

    render(){
        ctx.beginPath();
        ctx.rect(this.getActualX(), this.getActualY(), this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

changeTo = 'wall'


function setStartPoint(){
    draw = false;
    changeTo = 'start'
}

function setEndPoint(){
    draw = false;
    changeTo = 'end'
}

function changeAlgorithm(){
    algorithm = document.getElementById("algorithm").value;
}

function clearMap(){
    for(var i=0;i<MAP_HEIGHT;i++){
        for(var j=0;j<MAP_WIDTH;j++){
            objects[i][j].resetObject()
        }
    }
}

async function backtrace(node){
    while(node!=undefined){
        if(node.type == 'path'){
            node.type = 'shortestpath';
        }
        node = node.parent;
        await sleep(SLEEP_MS);
    }
}

async function visualize(){
    clearMap()
    if(algorithm=="astar"){
        end_node = await astar();
    }else if(algorithm=="BFS"){
        end_node = await bfs();
    }else if(algorithm=="DFS"){
        end_node = await dfs();
    }else{
        alert("Algorithm \""+algorithm+"\" cannot be found")
        return
    }
    backtrace(end_node)
}


function registerInput(){
    canvas.addEventListener('mousedown', function(e){
        if(draw == false && changeTo=='start' || changeTo=='end'){
            coords = canvas.relMouseCoords(e);
            // TODO: Why 24 and 23 
            x = parseInt(coords.x/24);
            y = parseInt(coords.y/23);
            objects[y][x].type = changeTo
            if(changeTo == 'end'){
                if(end_pos[0] == undefined){
                    end_pos[0] = y;
                    end_pos[1] = x;
                }else{
                    objects[end_pos[0]][end_pos[1]].type = 'path';
                    end_pos[0] = y;
                    end_pos[1] = x;
                }
            }else if(changeTo == 'start'){
                if(start_pos[0] == undefined){
                    start_pos[0] = y;
                    start_pos[1] = x;
                }else{
                    objects[start_pos[0]][start_pos[1]].type = 'path';
                    start_pos[0] = y;
                    start_pos[1] = x;
                }
            }
            changeTo = 'wall';
        }else{
            draw = true;
        }
    })

    canvas.addEventListener('mouseup', function(e){
        draw = false;
    });

    canvas.addEventListener('mousemove', function(e){
        coords = canvas.relMouseCoords(e);
        // TODO: Why 24 and 23
        x = parseInt(coords.x/24);
        y = parseInt(coords.y/23);
        if(!draw || (x >= MAP_WIDTH) || (y >= MAP_HEIGHT) || (x < 0) || (y < 0)){
            return;
        }
        if(objects[y][x].type == 'start' || objects[y][x].type == 'end'){
            return;
        }
        if(objects[y][x].type == changeTo){
            // objects[y][x].type = 'path';
            return;
        }
        objects[y][x].type = changeTo;
    })
}

function init(){
    for(var i=0;i<MAP_HEIGHT;i++){
        var object = []
        for(var j=0;j<MAP_WIDTH;j++){
            var temp = new Vertex(i, j, 'path')
            object.push(temp)
        }
        objects.push(object)
    }
}

registerInput();
init();