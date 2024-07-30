

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(10);
  //createCanvas(2000,1200);
  createCanvas(displayWidth,DisplayHeight);

  gobutton = createButton("GO!");
  gobutton.mouseClicked(generate);
  gobutton.size(150,375);
  gobutton.position(1300,50);
  resetbutton = createButton("RESET!");
  resetbutton.mouseClicked(resetButton);
  resetbutton.size(150,375);
  resetbutton.position(1300,475);

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
  rect(0,0,width,height);
  rect(ceil((mouseX-75)/50)*50,ceil((mouseY-75)/50)*50,100,100,20);
  text('v0.1', 20, 20);

  text(jsondmp, 20, 80);
 
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
  loop();
}