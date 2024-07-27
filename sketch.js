let cellSize = 50;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(10);
  //createCanvas(2000,1200);
  createCanvas(1500,900);

  // Calculate columns and rows
  columnCount = floor(width / cellSize); columnCount =24;
  rowCount = floor(height / cellSize); rowCount = 16;

  // Set each column in current cells to an empty array
  // This allows cells to be added to this array
  // The index of the cell will be its row number
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
  gobutton.size(200,400);
  gobutton.position(1480,50);
  resetbutton = createButton("RESET!");
  resetbutton.mouseClicked(resetButton);
  resetbutton.size(200,400);
  resetbutton.position(1480,450);

  describe(
    "Grid of squares that switch between white and black, demonstrating a simulation of John Conway's Game of Life. When clicked, the simulation resets."
  );
}

function draw() {
  clear();
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Get cell value (0 or 1)
      let cell = currentCells[column][row];
      // Convert cell value to get black (0) for alive or white (255 (white) for dead
      fill((1 - cell) * 255);
      stroke(0);
      rect(50+column * cellSize, 50+row * cellSize, cellSize, cellSize);
    }
  }
  
  text('hi', 150, 50);
  noFill();stroke(200,0,0);
  rect(0,0,width,height);
  rect(ceil((mouseX-75)/50)*50,ceil((mouseY-75)/50)*50,100,100,20);
}

// Reset board when mouse is pressed
function mousePressed() {
  tr=floor((mouseY-50)/50);
  tc=floor((mouseX-50)/50);
  currentCells[tc][tr]=1-currentCells[tc][tr];
}

// Fill board randomly
function randomizeBoard() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Randomly select value of either 0 (dead) or 1 (alive)
      currentCells[column][row] = random([0, 1]);
    }
  }
}

// Create a new generation
function generate() {
  // Loop through every spot in our 2D array and count living neighbors
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Column left of current cell
      // if column is at left edge, use modulus to wrap to right edge
      let left = (column - 1 + columnCount) % columnCount;

      // Column right of current cell
      // if column is at right edge, use modulus to wrap to left edge
      let right = (column + 1) % columnCount;

      // Row above current cell
      // if row is at top edge, use modulus to wrap to bottom edge
      let above = (row - 1 + rowCount) % rowCount;

      // Row below current cell
      // if row is at bottom edge, use modulus to wrap to top edge
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

  // Swap the current and next arrays for next generation
  let temp = currentCells;
  currentCells = nextCells;
  nextCells = temp;
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

function resetButton() {
  noLoop();
  randomizeBoard();
  loop();
}