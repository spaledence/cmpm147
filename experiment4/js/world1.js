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

let lakeSize = 50; // Adjust the size of the lake
let treeDensity = 0.02; // Adjust the density of trees

function p3_drawTile(i, j) {
  noStroke();

  // Use Perlin noise to generate terrain height
  let noiseValue = noise(i * 0.1, j * 0.1);
  let terrainHeight = map(noiseValue, 0, 1, -20, 20);

  // Determine if the tile is part of the lake
  let distanceToCenter = dist(i, j, tile_columns / 2, tile_rows / 2);
  let isLake = distanceToCenter < lakeSize;

  // Determine if the tile is part of the tree area
  let isTree = noise(i * treeDensity, j * treeDensity) > 0.6;

  // Use hash function for randomness
  let hashValue = XXH.h32("" + i + "," + j, 0); // Hash based on tile coordinates

  if (isLake && !isTree) {
    fill(50, 100, 255); // Blue color for lake
  } else if (terrainHeight > 0) {
    fill(34, 139, 34); // Green color for land
  } else {
    fill(255, 240, 180); // Sand color for beach
  }

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th + terrainHeight);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  if (isTree) {
    fill(139, 69, 19); // Brown color for tree trunk
    rect(-5, -5, 10, 15); // Tree trunk
    fill(0, 128, 0); // Green color for tree top
    ellipse(0, -10, 20, 20); // Tree top
  }

  // Add randomness based on hash value
  if (hashValue % 5 === 0 && !isLake && !isTree) {
    fill(100, 255, 100, 200); // White color with transparency
    ellipse(0, 0, 5, 5); // Random dots on the landscape
  }
  
  if (clicks[[i, j]] && !isLake && !isTree) {
    fill(139, 69, 19); // Brown color for tree trunk
    rect(-5, -5, 10, 15); // Tree trunk
    fill(0, 128, 0); // Green color for tree top
    ellipse(0, -10, 20, 20); // Tree top
  }

  pop();
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