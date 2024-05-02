"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {
  
  
}

function p3_setup() {
  
}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {
  
}

function p3_drawTile(i, j) {
  noStroke();

  let midpoint = Math.floor(tile_columns / 3);
  let hash = XXH.h32("tile:" + [i, j], worldSeed);

  // Determine if the tile is on the left or right side of the vertical line
  if (i < midpoint) {
  // Left side (sand)
    
    if (hash % 5 == 0 && i <= 1 && i >= -20) {
      fill(255, 255, 180); // Slightly dark tan color
    } 
    else if (i <= -20){
            fill(105, 185, 100);
    }
    else{
        fill(255, 240, 180); // Sand color
    }
    
    
  } 
  else {
    // Right side (ocean)
    
    if ( hash % 10 == 0 && i > 7){
      fill(100, 50, 255)
    }
    else{
      fill(50, 100, 255); // Ocean color
    }
  }
  
  

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1 && i < 4) {
    // Draw a beach umbrella at the center of the tile
    fill(0, 0, 0, 64); // Semi-transparent black color for shadow
    ellipse(0, 2, 30, 10); // Shadow ellipse

    fill(255); // White color for umbrella pole
    rect(-2, -10, 4, 70); // Umbrella pole
    
    fill(255, 0, 0); // Red color for umbrella top
    ellipse(0, -10, 30, 30); // Umbrella top

    fill(255, 255, 0); // Yellow color for umbrella stripes
    for (let y = -5; y < 20; y += 5) {
      rect(-15, y-15, 30, 3); // Umbrella stripes
    }
  }
  

  pop();
}

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);

  // Check if i is to the right of the midpoint and less than 20
  if (i >= Math.floor(tile_columns / 2) && i < Math.floor(tile_columns / 2) + 20) {
    // Set the tile color to blue
    clicks[key] %= 2; // Toggle between 0 and 1
  }
}



function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
  
}