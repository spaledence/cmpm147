// sketch.js - purpose and description here
// Author: Dale Spence
// Date: 4/25/24

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}


var s = function ( d ){

  let seed = 0;
  let tilesetImage;
  let currentGrid = [];
  let numRows, numCols;

  d.preload = function() {
    tilesetImage = d.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  }

  d.reseed = function() {
    seed = (seed | 0) + 1109;
    d.randomSeed(seed);
    d.noiseSeed(seed);
    d.select("#seedReport").html("seed " + seed);
    d.regenerateGrid();
  }

  d.regenerateGrid = function() {
    d.select("#asciiBox1").value(d.gridToString(d.generateGrid(numCols, numRows)));
    d.reparseGrid();
  }

  d.reparseGrid = function() {
    currentGrid = d.stringToGrid(d.select("#asciiBox1").value());
  }

  d.gridToString = function(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }

  d.stringToGrid = function(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }

  d.setup = function() {
    numCols = d.select("#asciiBox1").attribute("rows") | 0;
    numRows = d.select("#asciiBox1").attribute("cols") | 0;

    d.createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer1");
    d.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

    d.select("#reseedButton").mousePressed(d.reseed);
    d.select("#asciiBox1").input(d.reparseGrid);

    d.reseed();
  }


  d.draw = function() {
    d.randomSeed(seed);
    d.drawGrid(currentGrid);
  }

  d.placeTile = function(i, j, ti, tj) {
    d.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }



  /* exported generateGrid, drawGrid */
  /* global placeTile */

  d.generateGrid = function(numCols, numRows) {
    //let numRows1 = numRows
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push("_");
      }
      grid.push(row);
    }

    let numRooms = 7;

    // Array to store the positions of the rooms
    let roomPositions = [];

    // Generate rooms
    for (let r = 0; r < numRooms; r++) {
      // Calculate the size of the rectangular room
      let roomWidth = d.floor(d.random(3, d.min(6, numCols)));  // Ensure room is at least 2x2 and fits within the grid
      let roomHeight = d.floor(d.random(3, d.min(6, numRows)));

      // Calculate the starting position of the rectangular room
      let startX = d.floor(d.random(0, numCols - roomWidth));
      let startY = d.floor(d.random(0, numRows - roomHeight));

      // Check if the new room overlaps with any existing rooms
      let overlaps = roomPositions.some(pos => {
        let [x, y, width, height] = pos;
        return startX < x + width + 2 && startX + roomWidth > x - 2 &&
              startY < y + height + 2 && startY + roomHeight > y - 2;
      });

      // If there are no overlaps, add the new room to the grid
      if (!overlaps) {
        roomPositions.push([startX, startY, roomWidth, roomHeight]);
        for (let i = startY; i < startY + roomHeight; i++) {
          for (let j = startX; j < startX + roomWidth; j++) {
            grid[i][j] = ".";
          }

        }
      }
    }

    // Connect the rooms with paths
    for (let r = 0; r < roomPositions.length - 1; r++) {
      let [x1, y1, w1, h1] = roomPositions[r];
      let [x2, y2, w2, h2] = roomPositions[r + 1];

      // Calculate the center of each room
      let center1 = { x: x1 + Math.floor(w1 / 2), y: y1 + Math.floor(h1 / 2) };
      let center2 = { x: x2 + Math.floor(w2 / 2), y: y2 + Math.floor(h2 / 2) };

      // Calculate the Manhattan distance between the centers
      //let dx = Math.abs(center2.x - center1.x);
      //let dy = Math.abs(center2.y - center1.y);

      // Determine the direction of the path (horizontal first or vertical first)
      if (Math.random() < 0.5) {
        // Horizontal path
        let startX = Math.min(center1.x, center2.x);
        let endX = Math.max(center1.x, center2.x);
        let startY = center1.y;

        for (let i = startX; i <= endX; i++) {
          grid[startY][i] = "p";
        }

        let startX_vert = center2.x;
        let endY_vert = Math.max(center1.y, center2.y);
        let startY_vert = Math.min(center1.y, center2.y);

        for (let i = startY_vert; i <= endY_vert; i++) {
          grid[i][startX_vert] = "p";
        }
      } else {
        // Vertical path
        let startY = Math.min(center1.y, center2.y);
        let endY = Math.max(center1.y, center2.y);
        let startX = center1.x;

        for (let i = startY; i <= endY; i++) {
          grid[i][startX] = "p";
        }

        let startY_horiz = center2.y;
        let endX_horiz = Math.max(center1.x, center2.x);
        let startX_horiz = Math.min(center1.x, center2.x);

        for (let i = startX_horiz; i <= endX_horiz; i++) {
          grid[startY_horiz][i] = "p";
        }
      }
    }
    
    let roomCenters = [];

    // Calculate the center of each room
    for (let i = 0; i < roomPositions.length; i++) {
      let [x, y, w, h] = roomPositions[i];
      let centerX = x + Math.floor(w / 2);
      let centerY = y + Math.floor(h / 2);
      roomCenters.push({ x: centerX, y: centerY });
    }
    
    //add chests
    for (let i = 0; i < roomCenters.length; i++) {
      let center = roomCenters[i];
      grid[center.y][center.x] = "c";
      
    }
    
    
    
    // Check edges 
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === '.') {
          if (grid[i - 1][j] === '_') {
            grid[i - 1][j] = 'j'; // Check north
          }
          if (grid[i + 1][j] === '_') {
            grid[i + 1][j] = 'j'; // Check south
          }
          if (grid[i][j - 1] === '_') {
            grid[i][j - 1] = 'j'; // Check west
          }
          if (grid[i][j + 1] === '_') {
            grid[i][j + 1] = 'j'; // Check east
          }
          if (grid[i+1][j + 1] === '_') {
            grid[i+1][j + 1] = 'j'; // Check east
          }
          if (grid[i-1][j -1] === '_') {
            grid[i-1][j -1] = 'j'; // Check east
          }
          if (grid[i-1][j + 1] === '_') {
            grid[i-1][j + 1] = 'j'; // Check east
          }
          if (grid[i+1][j - 1] === '_') {
            grid[i+1][j - 1] = 'j'; // Check east
          }
        }
      }
    }

    return grid;
  }

  d.mousePressed = function() {
    // Convert mouse coordinates to grid coordinates
    let j = Math.floor(d.mouseX / 16);
    let i = Math.floor(d.mouseY / 16);
  
    // Check if the clicked tile is a chest
    if (currentGrid[i][j] === 'c') {
      currentGrid[i][j] = '.'; // Replace the chest with a wall block
    }
  }

  d.drawGrid = function(grid) {
    
    
    d.background(128);
    
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (d.gridCheck(grid, i, j, "_")){
          d.placeTile(i, j, 20, 22);
        }

        else if (grid[i][j] === '.') {
          d.placeTile(i, j, 21, 21);
        }
        else if (grid[i][j] == 'p'){
          d.placeTile(i, j, 28, 24);
        }
        
        else if (grid[i][j] == 'c'){
          d.placeTile(i, j, d.floor(d.random(3,6)), 29);
        }
        else if (grid[i][j] == 'j'){
          d.placeTile(i, j, 20, 23);
        }
        /*
        else{
          drawContext(grid, i, j, "_", 26, 22);

        }
        */
        
        
        
      }
    }
  }



  d.gridCheck = function(grid, i, j, target) {
    return i >= 0 && i < grid.length && j >= 0 && j < grid[i].length && grid[i][j] == target;
  }

  d.gridCode = function(grid, i, j, target) {
    let northBit = d.gridCheck(grid, i - 1, j, target) ? 1 : 0;
    let southBit = d.gridCheck(grid, i + 1, j, target) ? 1 : 0;
    let eastBit = d.gridCheck(grid, i, j + 1, target) ? 1 : 0;
    let westBit = d.gridCheck(grid, i, j - 1, target) ? 1 : 0;
    return (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
  }

  d.drawContext = function(grid, i, j, target, ti, tj){
    let code = d.gridCode(grid, i, j, target)
    let [tiOffset, tjOffset] = lookup[code]
    d.placeTile(i, j, ti + tiOffset, tj + tjOffset)
  }

  const lookup = [
    [0, 0],  // Code 0
    [0, 1],  // Code 1
    [1, 0],  // Code 2
    [-1, 0], // Code 3
    [0, -1], // Code 4
    [1, 1],  // Code 5
    [-1, 1], // Code 6
    [1, -1], // Code 7
    [-1, -1],// Code 8
    [0, 2],  // Code 9
    [0, -2], // Code 10
    [2, 0],  // Code 11
    [-2, 0], // Code 12
    [1, 2],  // Code 13
    [-1, 2], // Code 14
    [1, -2], // Code 15
    [-1, -2] // Code 16
  ];
}
var overworld = new p5(s, 'overworld')




var s2 = function(p){
  /* exported preload, setup, draw, placeTile */

  /* global generateGrid drawGrid */

  let seed = 0;
  let tilesetImage;
  let currentGrid = [];
  let numRows, numCols;

  p.preload = function() {
    tilesetImage = p.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  }

  p.reseed = function() {
    seed = (seed | 0) + 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    p.select("#seedReport").html("seed " + seed);
    p.regenerateGrid();
  }

  p.regenerateGrid = function() {
    p.select("#asciiBox2").value(p.gridToString(p.generateGrid(numCols, numRows)));
    p.reparseGrid();
  }

  p.reparseGrid = function() {
    currentGrid = p.stringToGrid(p.select("#asciiBox2").value());
  }

  p.gridToString = function(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }

  p.stringToGrid = function(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }

  p.setup = function() {
    numCols = p.select("#asciiBox2").attribute("rows") | 0;
    numRows = p.select("#asciiBox2").attribute("cols") | 0;
  
    p.createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer2");
    p.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  
    p.select("#reseedButton").mousePressed(p.reseed);
    p.select("#asciiBox2").input(p.reparseGrid);
  
    p.reseed();
  }

  p.draw = function() {
    p.randomSeed(seed);
    p.drawGrid(currentGrid);
  }
  
  p.placeTile = function(i, j, ti, tj) {
    p.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }

  p.generateGrid = function(numRows, numCols){
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push("_");
      }
      grid.push(row);
    }

    let riverWidth = p.floor(p.random(2, 5)); // Randomize the width of the river
    let riverStart = p.floor(p.random(2, numCols - riverWidth - 2)); // Randomize the starting column of the river
  
    for (let i = 0; i < numRows; i++) {
      let bend = p.floor(p.random(-1, 2)); // Randomize the bend (-1: left, 0: straight, 1: right)
      riverStart = p.constrain(riverStart + bend, 0, numCols - riverWidth); // Constrain the river within the grid
  
      for (let j = riverStart; j < riverStart + riverWidth; j++) {
        grid[i][j] = "w";
      }
    }
    
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (grid[i][j] != "w" && (grid[i+1] && grid[i+1][j] == "w" || grid[i-1] &&
        grid[i-1][j] == "w" || grid[i][j+1] == "w" || grid[i][j-1] == "w")) {
          grid[i][j] = ".";
        }
      }
    }
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
          if (grid[i][j] != "w" &&
              (!grid[i+1] || grid[i+1][j] != "w") &&
              (!grid[i-1] || grid[i-1][j] != "w") &&
              grid[i][j+2] != "w" &&
              grid[i][j-2] != "w") {
              // Randomly decide whether to place a house
              if (p.random(1) < 0.01) {
                  // Place a house
                  let houseWidth = p.floor(p.random(1, 3)); // Random width between 1 and 2
                  for (let k = 0; k < houseWidth; k++) {
                      grid[i][j+k] = "h"; // Mark house tiles
                  }
              }
          }
      }
    }

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
          if (grid[i][j] === "h") {
              // Mark adjacent tiles as dirt
              for (let dx = -1; dx <= 1; dx++) {
                  for (let dy = -1; dy <= 1; dy++) {
                      const ni = i + dy;
                      const nj = j + dx;
                      if (ni >= 0 && ni < numRows && nj >= 0 && nj < numCols && grid[ni][nj] !== "h") {
                          grid[ni][nj] = "^";
                      }
                  }
              }
          }
      }
    }
  
    return grid;
  }

  p.mousePressed = function() {
    // Convert mouse coordinates to grid coordinates
    let j = Math.floor(p.mouseX / 16);
    let i = Math.floor(p.mouseY / 16);
  
    // Check if the clicked tile is a chest
    if (currentGrid[i][j] === 'h') {
      currentGrid[i][j] = '^'; // Replace the chest with a wall block
    }
  }

  p.drawGrid = function(grid){
    p.background(128);
  
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === "_"){
          p.placeTile(i, j, p.floor(p.random(0,4)), 0);
        }

        else if (grid[i][j] === 'w') {
          p.placeTile(i, j, p.floor(p.random(0, 4)), 14);
        }
        else if (grid[i][j] == '.'){
          p.placeTile(i, j, 28, 24);
        }
        
        else if (grid[i][j] == 'h'){
          p.placeTile(i, j, 26, p.floor(p.random(0,4)));
        }
        else if (grid[i][j] == '^'){
          p.placeTile(i, j, p.floor(p.random(0, 4)), 4);
        }
        
        /*
        else if (grid[i][j] == 'j'){
          placeTile(i, j, 20, 23);
        }
        */
      } 


    }
  }



}


var dungeon = new p5(s2, 'dungeon')