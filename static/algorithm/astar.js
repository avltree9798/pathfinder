
function comparer(vertex1, vertex2){
    if(vertex1.heuristic_value < vertex2.heuristic_value){
        return -1;
    }else if(vertex1.heuristic_value > vertex2.heuristic_value){
        return 1;
    }
    return 0;
}

function getNeighbors(vertex){
    neighbors = [undefined, undefined, undefined, undefined]
    if(vertex.x > 0){
        top_vertex = objects[vertex.y][vertex.x-1]
        if (top_vertex.type != 'wall' && top_vertex.visited == false){
            neighbors[UP] = top_vertex
        }
    }
    if(vertex.x < objects[0].length-1){
        bottom_vertex = objects[vertex.y][vertex.x+1];
        if(bottom_vertex.type != 'wall' && bottom_vertex.visited == false){
            neighbors[DOWN] = bottom_vertex
        }
    }
    if(vertex.y > 0){
        left_vertex = objects[vertex.y-1][vertex.x]
        if(left_vertex.type != 'wall' && left_vertex.visited == false){
            neighbors[LEFT] = left_vertex
        }
    }
    if(vertex.y < objects.length-1){
        right_vertex = objects[vertex.y+1][vertex.x];
        if (right_vertex.type != 'wall' && right_vertex.visited == false){
            neighbors[RIGHT] = right_vertex
        }
    }
    return neighbors;
}

async function astar(){
    allowedToClick = false
    if (start_pos[0] == undefined || end_pos[0] == undefined){
        alert("Please set the starting and end point first");
        return;
    }
    end_node = undefined
    objects[start_pos[0]][start_pos[1]].parent = undefined
    vertexes_to_open = [objects[start_pos[0]][start_pos[1]]]
    while(vertexes_to_open.length != 0 || end_node == undefined){
        vertex = vertexes_to_open.shift()
        vertex.visited = true
        neighbors = getNeighbors(vertex)
        
        need_to_sort = false;
        for(var i=0; i<neighbors.length; i++){
            neighbor = neighbors[i];
            if(neighbor == undefined){
                continue
            }
            if(vertexes_to_open.indexOf(neighbor) == -1){
                neighbor.parent = vertex;
                if(neighbor.type == 'end'){
                    end_node = neighbor;
                    return end_node;
                }
                
                neighbor.distance_from_start = 1 + neighbor.parent.distance_from_start;
                neighbor.calculateHeuristicValue(end_pos[0], end_pos[1])
                vertexes_to_open.push(neighbor)
                need_to_sort = true;
            }
        }
        if(need_to_sort || end_node == undefined){
            vertexes_to_open = vertexes_to_open.sort(comparer);   
        }
        await sleep(SLEEP_MS);
    }

    return end_node;
}