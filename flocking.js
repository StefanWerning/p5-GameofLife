const flock = [];
// let alignSlider, cohesionSlider, separationSlider;
let predators = [];
let goodCreatureNumber = 200
let predatorNumber = 1
let cellsize;
let running=0;
let turns=0;
let sel=null;
let predButton;

function preload() {
   predButton = createImage("fangs.png", 'Fangs');
}

function setup() {
	let cnv = createCanvas(windowWidth, windowHeight);
	cnv.style('display', 'block');

  cellsize=floor((width-100)/20);

  let button = createButton('X');
  button.position(width-150, 0);
  button.size(150, height);
  button.style("font-family", "Comic Sans MS");
  button.style("font-size", "48px");
  button.mousePressed(advanceGame);

  modeSelect = createSelect();
  modeSelect.position(width-150,20);
  modeSelect.option('Select');
  modeSelect.option('Create Boid');
  modeSelect.option('Create Predator');
  modeSelect.option('Create Wall');
  modeSelect.option('Destroy');
  modeSelect.changed(selectMode);
  
	// alignSlider = createSlider(0, 5, 1, 0.1)
	// cohesionSlider = createSlider(0, 5, 1, 0.1)
	// separationSlider = createSlider(0, 5, 1, 0.1)
	for (let i = 0; i < goodCreatureNumber; i++) {
		flock.push(new Boid(random(width), random(height), 255, 3))
	}

	for (let i = 0; i < predatorNumber; i++) {
		predators.push(new Predator(random(width), random(height), color(255, 0, 0), 5))
	}
}

function selectMode() {

}

function mousePressed() {
  if (modeSelect.value() == 'Select') {
    if (mouseX<width-150) {
      let d=Infinity; 
      for (let boid of flock) {
        if (dist(boid.position.x,boid.position.y,mouseX,mouseY)<d) {
          d=dist(boid.position.x,boid.position.y,mouseX,mouseY);
          sel=boid;
        }
      }
      for (let predator of predators) {
        if (dist(predator.position.x,predator.position.y,mouseX,mouseY)<d) {
          d=dist(predator.position.x,predator.position.y,mouseX,mouseY);
          sel=predator;
        }
      }
    }
  } else if (modeSelect.value() == 'Create Boid') {
    if (mouseX<width-150) flock.push(new Boid(mouseX, mouseY, color(255, 204, 0), 3));
  } else if (modeSelect.value() == 'Create Predator') {
    if (mouseX<width-150) predators.push(new Predator(mouseX, mouseY, color(255, 0, 0), 5));
  } else if (modeSelect.value() == 'Create Wall') {
    if (mouseX<width-150) {
      let tmp=new Predator(floor(mouseX/cellsize)*cellsize+(cellsize/2), floor(mouseY/cellsize)*cellsize+(cellsize/2), color(0, 0, 0), 5);  
      tmp.maxSpeed=0;tmp.maxForce=0.0;
      predators.push(tmp);
      running=3;
    }
  } else if (modeSelect.value() == 'Destroy') {
    if (mouseX<width-150) {
      let d=Infinity; 
      for (let i = flock.length - 1; i >= 0; i--) {
        if (dist(flock[i].position.x,flock[i].position.y,mouseX,mouseY)<d) {
          d=dist(flock[i].position.x,flock[i].position.y,mouseX,mouseY);
          sel=i;
        }
      }
      if (d<10) flock.splice(sel, 1); sel=null;
      d=Infinity;
      for (let i = predators.length - 1; i >= 0; i--) {
        if (dist(predators[i].position.x,predators[i].position.y,mouseX,mouseY)<d) {
          d=dist(predators[i].position.x,predators[i].position.y,mouseX,mouseY);
          sel=i;
        }
      }
      if (d<10) predators.splice(sel, 1);sel=null;
    }
  }
}

function advanceGame () {
  if (running<1) {
    running = 1*frameRate();
    turns++;
  }
}

function draw() {
	background(151)
  if (sel!=null) text("V",sel.position.x-3,sel.position.y-5);
	for (let boid of flock) {
    /*if (mouseIsPressed) { 
      let d = dist(mouseX,mouseY,boid.position.x,boid.position.y);
      if (d<50) text ("d:"+d,boid.position.x,boid.position.y);
    }*/
		boid.show()
		if (running>0) boid.update()

		let flee = boid.survive(predators, 150)
		flee.mult(3)
		boid.applyForce(flee)

		Flock.flock(boid, flock)
	}

	for (let predator of predators) {
		predator.show()
		if (running>0) predator.update()
	}

	if(flock.length < goodCreatureNumber){
		//flock.push(random(flock).clone())
	}
  for (let i=1; i<20;i++) line(cellsize*i,0,cellsize*i,height);
  for (let i=1; i<(height/cellsize);i++) line(0,cellsize*i,width,cellsize*i);
  text ("Flock Test v0.9\nBased on https://github.com/eansengchang/Flocking-Simulation/blob/main/index.html\nBoids: "+flock.length+"\nPredators: "+predators.length+"\nTurn: "+turns,20,20);
  if (running>0) {
    running-=1;
  }
}