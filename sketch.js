let cellSize;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let sliding;
let slider, resetbutton;

function preload() {
  liveimg = loadImage('/assets/livetex.jpg');
  deadimg = loadImage('/assets/deadtex.jpg');
  grassimg = loadImage('/assets/grass.png');
  fireimg = loadImage('/assets/deadtree.png');
}

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(10);
  //createCanvas(2000,1200);
  createCanvas(displayWidth,displayHeight);

  // Calculate columns and rows
  rowCount = 12; 
  cellSize=floor(height/rowCount);
  columnCount = floor((width-150) / cellSize);

  for (let column = 0; column < columnCount; column++) {
    currentCells[column] = [];
  }

  // Repeat the same process for the next cells
  for (let column = 0; column < columnCount; column++) {
    nextCells[column] = [];
  }
  
  generate();

  gobutton = createButton("GO!");
  gobutton.mouseClicked(generate);
  gobutton.size(150,displayHeight/2);
  gobutton.position(displayWidth-150,0);
  resetbutton = createButton("RESET!");
  resetbutton.mouseClicked(resetFunction);
  resetbutton.size(150,displayHeight/2);
  resetbutton.position(displayWidth-150,displayHeight/2);
  slider = createSlider(10, 90, 40);
  slider.position(displayWidth-680, height/2);
  slider.size(height-100, 20);
  slider.style('transform', 'rotate(270deg)');
  slider.input(slideInput);
}

function slideInput() {
  resetbutton.html("Reset at "+slider.value()+"%!");
}

function draw() {
  clear();
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Get cell value (0 or 1)
      let cell = currentCells[column][row];
      let nextcell = nextCells[column][row];
      // Convert cell value to get black (0) for dead or white (255 (white) for alive
      stroke(0);strokeWeight(1); 
      
      if (cell==1) {
        //fill(128,128,128); rect(column * cellSize, row * cellSize, cellSize, cellSize);
        image(liveimg,column * cellSize, row * cellSize, cellSize, cellSize);
        if (nextcell==0) {
          //stroke(64,0,0);strokeWeight(5);rect(column * cellSize, row * cellSize, cellSize, cellSize);
          image(fireimg,column * cellSize, row * cellSize, cellSize, cellSize);
        };
      } else {
        image(deadimg,column * cellSize, row * cellSize, cellSize, cellSize);
        if (nextcell==1) {
          //fill(0,128,0,127);rect(column * cellSize, row * cellSize, cellSize, cellSize)
          image(grassimg,column * cellSize, row * cellSize, cellSize, cellSize);
        };
      }
    }
  }
  
  noFill();stroke(200,0,0);
  rect(0,0,width,height);
  if (mouseX<columnCount*cellSize) {rect(floor(mouseX/cellSize)*cellSize,floor(mouseY/cellSize)*cellSize,cellSize,cellSize,20);}
  text("v0.92 | canvas: "+width+"*"+height+" px | display: "+displayWidth+"*"+displayHeight+" px ", 20, 20);
  stroke(0,0,0);
  //text(slider.value()+" %", width-150,20+height/4*3);
}

function mousePressed() {
  tr=floor(mouseY/cellSize);
  tc=floor(mouseX/cellSize);
  currentCells[tc][tr]=1-currentCells[tc][tr];
  nextCells[tc][tr]=currentCells[tc][tr];
  checkNext();
}

// Fill board randomly
function randomizeBoard() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Randomly select value of either 0 (dead) or 1 (alive)
      if (random(0,100)<slider.value()) {
        currentCells[column][row] = 1;
      } else {
        currentCells[column][row] = 0;
      }
    }
  }
  checkNext();
}

// Create a new generation
function generate() {
  checkNext();
  // Swap the current and next arrays for next generation
  let temp = currentCells;
  currentCells = nextCells;
  nextCells = temp;
  checkNext();
}

function checkNext () {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Column left of current cell; if column is at left edge, use modulus to wrap to right edge
      let left = (column - 1 + columnCount) % columnCount;

      // Column right of current cell; if column is at right edge, use modulus to wrap to left edge
      let right = (column + 1) % columnCount;

      // Row above current cell; if row is at top edge, use modulus to wrap to bottom edge
      let above = (row - 1 + rowCount) % rowCount;

      // Row below current cell; if row is at bottom edge, use modulus to wrap to top edge
      let below = (row + 1) % rowCount;

      // Count living neighbors surrounding current cell
      let neighbours =
        currentCells[left][above] +
        currentCells[column][above] +
        currentCells[right][above] +
        currentCells[left][row] +
        currentCells[right][row] +
        currentCells[left][below] +
        currentCells[column][below] +
        currentCells[right][below];

      // Rules of Life
      // 1. Any live cell with fewer than two live neighbours dies
      // 2. Any live cell with more than three live neighbours dies
      if (neighbours < 2 || neighbours > 3) {
        nextCells[column][row] = 0;
        // 4. Any dead cell with exactly three live neighbours will come to life.
      } else if (neighbours === 3) {
        nextCells[column][row] = 1;
        // 3. Any live cell with two or three live neighbours lives, unchanged, to the next generation.
      } else nextCells[column][row] = currentCells[column][row];
    }
  }
}

function touchStarted () {
  var fs = fullscreen();
  if (!fs) {
    fullscreen(true);
  }
}

/* full screening will change the size of the canvas 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}*/

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling the page.
 */
document.ontouchmove = function(event) {
    event.preventDefault();
};

function resetFunction() {
  noLoop();
  randomizeBoard();
  loop();
}