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

let cactusSize = 20; // Size of the cactus
let waveSpeed = 0.1; // Speed of the waves
let waveHeight = 5; // Amplitude of the waves
let waveFrequency = 0.02; // Frequency of the waves

function p3_drawTile(i, j) {
  noStroke();

  // Determine if the tile is part of the watering hole
  let isWateringHole = dist(i, j, tile_columns / 2, tile_rows / 2) < 10;

  // Determine if the tile is part of the cacti area
  let isCactus = noise(i * 0.1, j * 0.1) > 0.67;

  if (isWateringHole) {
    fill(100, 149, 237); // Blue color for watering hole
  } else if (isCactus) {
    fill(107, 142, 35); // Green color for cacti
  } else {
    fill(255, 204, 102); // Sand color for desert
  }

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  pop();

  let key = [i, j];
  if (clicks[key] && clicks[key] % 2 === 1) {
    // Draw cactus body
    if( !isWateringHole){
        fill(107, 142, 35); 
        rect(-cactusSize / 2, -cactusSize, cactusSize, cactusSize * 2, 5); // Cactus body
    }


    
  }

  // Add ripple effect to water
  if (!isCactus && isWateringHole) {
    fill(100, 149, 237); // Blue color for water
    let waveOffset = sin(frameCount * waveSpeed + i * waveFrequency) * waveHeight;
    beginShape();
    vertex(-tw, waveOffset);
    vertex(0, th + waveOffset);
    vertex(tw, waveOffset);
    vertex(0, -th + waveOffset);
    endShape(CLOSE);
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