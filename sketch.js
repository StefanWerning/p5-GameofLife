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
  gobutton.size(150,375);
  gobutton.position(1300,50);
  resetbutton = createButton("RESET!");
  resetbutton.mouseClicked(resetButton);
  resetbutton.size(150,375);
  resetbutton.position(1300,475);

  describe(
    "Grid of squares that switch between white and black, demonstrating a simulation of John Conway's Game of Life. When clicked, the simulation resets."
  );

  let url = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=e7402cc176aacd446829a856f2723b57&units=metric';
  url = "https://www.alphavantage.co/query?function=WHEAT&interval=monthly&apikey=demo";
  loadJSON(url,gotDataFunction);
  let jsondmp = "";

}

function gotDataFunction(jsondata){
  //jsondmp="Wind speed is "+data.wind.speed+" mph";
  jsondmp="Price of wheat: "+round(jsondata.data[0].value,2)+" "+jsondata.unit+" on "+jsondata.data[0].date; // get date of first entry
  //print(data);  
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
      if (nextcell==1) {fill(0,128,0,127);rect(50+column * cellSize, 50+row * cellSize, cellSize, cellSize)};
      if (cell==1) {
        fill(128,128,128); rect(50+column * cellSize, 50+row * cellSize, cellSize, cellSize);
        if (nextcell==0) {stroke(64,0,0);strokeWeight(5);rect(50+column * cellSize, 50+row * cellSize, cellSize, cellSize)};
      }
    }
  }
  
   noFill();stroke(200,0,0);
  rect(0,0,width,height);
  rect(ceil((mouseX-75)/50)*50,ceil((mouseY-75)/50)*50,100,100,20);
  text('v0.9', 20, 20);

  text(jsondmp, 20, 80);
 
}

// Reset board when mouse is pressed
function mousePressed() {
  tr=floor((mouseY-50)/50);
  tc=floor((mouseX-50)/50);
  currentCells[tc][tr]=1-currentCells[tc][tr];
  nextCells[tc][tr]=currentCells[tc][tr];
}

// Fill board randomly
function randomizeBoard() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Randomly select value of either 0 (dead) or 1 (alive)
      if (random(0,10)<2) {
        currentCells[column][row] = 1;
      } else {
        currentCells[column][row] = 0;
      }
    }
  }
  generate();
}

// Create a new generation
function generate() {
  // Loop through every spot in our 2D array and count living neighbors
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
  // Swap the current and next arrays for next generation
  let temp = currentCells;
  currentCells = nextCells;
  nextCells = temp;
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

function resetButton() {
  noLoop();
  randomizeBoard();
  loop();
}