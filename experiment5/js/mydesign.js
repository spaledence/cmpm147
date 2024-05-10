  /* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


  function getInspirations() {
    return [
      {
        name: "Super Mario", 
        assetUrl: "img/mario.webp",
        credit: "Super Mario Winking",
        color: true, 
        ellipse: false
      },
      {
        name: "Jupiter", 
        assetUrl: "img/jupiter.jpeg",
        credit: "A photograph of Jupiter",
        color: true,
        ellipse: true 
      },
      {
        name: "Einstein", 
        assetUrl: "img/einstein.jpeg",
        credit: "Albert Einstein sticking his tongue out, 1951",
        color: false,
        ellipse: false
      },
      {
        name: "Tiananmen Square Man", 
        assetUrl: "img/tankman.jpeg",
        credit: "Tank Man, Tiananmen Square, 1989",
        color: false,
        ellipse: false
      },
    ];
  }

  function initDesign(inspiration) {
    // set the canvas size based on the container
    let canvasContainer = $('.image-container'); // Select the container using jQuery
    let canvasWidth = canvasContainer.width(); // Get the width of the container
    let aspectRatio = inspiration.image.height / inspiration.image.width;
    let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
    resizeCanvas(canvasWidth / 2, canvasHeight / 2);
    //resizeCanvas(inspiration.image.width / 2, inspiration.image.height / 2);

    $(".caption").text(inspiration.credit); // Set the caption text

    const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
    $('#original').empty();
    $('#original').append(imgHTML);

    
    let design = {
      bg: 128,
      fg: []
    }
    
    for(let i = 0; i < 200; i++) {
      design.fg.push({x: random(width),
                      y: random(height),
                      w: random(width/2),
                      h: random(height/2),
                      fill: random(255)})
    }
    return design;
  }

  function renderDesign(design, inspiration) {
    background(design.bg);
    noStroke();
    for(let box of design.fg) {
      if (inspiration.color) {
        if (inspiration.ellipse){
          fill(box.r, box.g, box.b, 255);
        }
        else{
          fill(box.r, box.g, box.b, 128); // Render in color

        }
      } else {
        fill(box.fill, 128); // Render in black and white
      }
      if (inspiration.ellipse){
        ellipse(box.x, box.y, box.w, box.h)
      }
      else{
        rect(box.x, box.y, box.w, box.h);

      }
      
      
    }
  }



  function mutateDesign(design, inspiration, rate) {
    design.bg = mut(design.bg, 0, 255, rate);
    const propertiesToMutate = [
      { prop: 'r', min: 0, max: 255 },
      { prop: 'g', min: 0, max: 255 },
      { prop: 'b', min: 0, max: 255 },
      { prop: 'fill', min: 0, max: 255 },
      { prop: 'x', min: 0, max: width },
      { prop: 'y', min: 0, max: height },
      { prop: 'w', min: 0, max: width / 2 },
      { prop: 'h', min: 0, max: height / 2 }
  ];
  
  for (let box of design.fg) {
    for (let { prop, min, max } of propertiesToMutate) {
      box[prop] = mut(box[prop], min, max, rate);
    }
  }
}


  function mut(num, min, max, rate) {
      return constrain(randomGaussian(num, (rate * (max - min)) / 15), min, max);
  }


