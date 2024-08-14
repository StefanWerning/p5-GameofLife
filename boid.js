class Boid {
	constructor(x, y, col, r) {
		this.position = createVector(x, y);
		this.velocity = p5.Vector.random2D();
		this.velocity.setMag(random(2, 4))
		this.acceleration = createVector();
		this.maxForce = 0.05;
		this.maxSpeed = 3
		this.r = r
		this.col = col
	}

	applyForce(steering) {
		this.acceleration.add(steering)
	}

	clone() {
		let boid = new Boid(this.position.x, this.position.y, this.col, this.r)
		boid.velocity.add(this.velocity)
		return boid
	}

	persuit(vehicle, lookAhead) {
		let target = vehicle.position.copy()
		let prediction = vehicle.velocity.copy()
		prediction.mult(lookAhead)
		target.add(prediction)
		return this.seek(target)
	}

	evade(vehicle, lookAhead) {
		return this.persuit(vehicle, lookAhead).mult(-1)
	}

	seek(target, arrival=false) {
		let force = p5.Vector.sub(target, this.position);
		
		let desiredSpeed = this.maxSpeed
		if(arrival){
		  let slowRadius = 10
		  let distance = force.mag()
	
		  if(distance < slowRadius){
			desiredSpeed = map(distance, 0, slowRadius, 3, this.maxSpeed)
		  }
		}
		
		force.setMag(desiredSpeed);
		force.sub(this.vel);
		force.limit(this.maxForce);
		return force;
	  }

	flee(target) {
		return this.seek(target).mult(-1)
	}

	survive(list, perception) {
		let record = Infinity;
		let closest = null;
		for (let i = list.length - 1; i >= 0; i--) {
			let d = this.position.dist(list[i].position)

			if (d < record) {
				record = d;
				closest = list[i];
			}

		}

		if (closest != null) {
			if (closest.position.dist(this.position) < perception) {
				return this.flee(closest.position)
			}
		}

		return createVector(0, 0)
	}

	edges() {
		if (this.position.x > width-150) {
			this.position.x = 0;
		} else if (this.position.x < 0) {
			this.position.x = width-150;
		}

		if (this.position.y > height) {
			this.position.y = 0;
		} else if (this.position.y < 0) {
			this.position.y = height;
		}
	}

	show() {
		var angle = this.velocity.heading() + PI / 2;

		push();
		translate(this.position.x, this.position.y);
		rotate(angle);

		stroke(255);
		fill(this.col);
		noStroke()
    beginShape();
    if (this.maxSpeed==0) {
      vertex(-30, -30);
      vertex(-30, 30);
      vertex(30, 30);
      vertex(30, -30);
    } else {
      vertex(0, -this.r * 2);
      vertex(-this.r, this.r * 2);
      vertex(this.r, this.r * 2)  
    }
    endShape(CLOSE);
		pop()
	}

	update() {
		this.edges()
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed)
		this.acceleration.mult(0)
	}
}