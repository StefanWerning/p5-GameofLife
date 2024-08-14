class Predator extends Boid {
	constructor(x, y, col, r) {
		super(x, y, col, r)
		this.maxForce = 0.4;
		this.maxSpeed = 4
	}

	eat(list, perception) {
		let record = Infinity;
		let closest = null;
		for (let i = list.length - 1; i >= 0; i--) {
			let d = this.position.dist(list[i].position)

			//eat
			if (d < this.maxSpeed) {
				list.splice(i, 1)
			} else {
				if (d < record) {
					record = d;
					closest = list[i];
				}
			}
		}

		if (closest != null) {
			if (closest.position.dist(this.position) < perception) {
				return this.seek(closest.position)
			}
		}

		return createVector(0, 0)
	}

	update() {
		super.update()
		let steering = this.eat(flock, 200)
		this.applyForce(steering)
	}
}