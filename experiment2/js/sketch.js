// sketch.js - purpose and description here
// Author: Your Name
// Date:

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

$("#reimagine").click(function() {
  seed++;
});

// setup() function is called once when the program starts


function setup() {  
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}


/* exported setup, draw */
let offset = 0;
let seed = 239;
function draw() {

  randomSeed(seed);
  background(100);

// Calculate the y-coordinate of the skyline
  let skylineY = height / 3;

  // Calculate the y-coordinates for the grassline

  fill(0, 0, 230);
  // Draw the skyline rectangle
  rect(0, 0, width, height);
  // Set the fill color to light blue
  fill(173, 216, 230);
  // Draw the skyline rectangle
  rect(0, 0, width, skylineY);
  
  
  
  

  noStroke();
  fill(0, 200, 50);

  // Draw a rectangle to fill the area below the grassline
  //triangle(0, 2 * height / 3, 0, height * 2, width + 50, 8 * height / 9)
  
  beginShape();
    for (let x = 0; x <= width + 50; x += 10) {
        let noiseValue = noise(seed + (x +offset) * 0.01);
        let y = map(noiseValue, 0, 1, 2 * height / 3, 8 * height / 9);
        vertex(x, y);
    }
    vertex(width + 50, height);
    vertex(-50 , height + 50);
    endShape(CLOSE);
    
  
  fill(54, 16, 16);

    // Calculate the y-coordinate of the top of the mountain range
    let mountainTopY = skylineY - (height / 5);

    // Draw the mountain range
    beginShape();
    randomSeed(seed);
    for (let x = 0; x <= width; x += 10) {
        let noiseValue = noise(seed + (x + offset) * 0.04);
        let y = map(noiseValue, 0, 1, mountainTopY, skylineY);
        vertex(x, y);
    }
    vertex(width, skylineY + 10);
    vertex(0, skylineY + 10);
    endShape(CLOSE);
  

  
  
  fill(0, 100, 0);

    // Draw individual tree shapes
    for (let x = 0; x < width; x += 15) {
        let treeHeight = random(15, 30);
        let treeWidth = random(10, 25);

        triangle(x, skylineY + 15, x + treeWidth / 2, skylineY - treeHeight, x + treeWidth, skylineY + 15);
    }
  
  
  
  fill(0, 150, 0);

    // Draw the grass line using Perlin noise
    beginShape();
    let noiseFactor = 0.02;
    for (let x = 0; x <= width; x += 5) {
        let noiseValue = noise(seed + x * noiseFactor);
        let grassHeight = map(noiseValue, 0, 1, skylineY + 12, skylineY + 10);
        vertex(x, grassHeight);
    }
    vertex(width, skylineY + 20);
    vertex(0, skylineY + 20);
    endShape(CLOSE);
  
    offset += 1;
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}