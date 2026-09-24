let fishes = [];
let ripples = [];
const NUM_FISH = 18;

let fishColors = [
  "#ffee62", "#ff4520", "#fee7a35", "#fd8412", "#ed2a2b", "#e54120"
];

function setup() {
  createCanvas(600, 800);
  
  for (let i = 0; i < NUM_FISH; i++) {
    fishes.push(new Goldfish(random(width), random(height)));
  }
}

function draw() {
  
  drawPoolBackground();

  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].display();
    if (ripples[i].isFinished()) {
      ripples.splice(i, 1);
    }
  }

  for (let fish of fishes) {
    fish.flee(createVector(mouseX, mouseY)); 
    fish.update();
    fish.display();
  }
}

// ripple
function mousePressed() {
  ripples.push(new Ripple(mouseX, mouseY));
}


function drawPoolBackground() {
  background("#d8ecee"); 

  stroke(255, 255, 255, 120);
  strokeWeight(2);
  noFill();

  let gridSize = 50;
  
  for (let x = 0; x <= width; x += gridSize) {
    for (let y = 0; y <= height; y += gridSize) {
      push();
      translate(x, y); 
      rect(0, 0, gridSize, gridSize);
      pop();
    }
  }
}

class Goldfish {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 2));
    this.acc = createVector(0, 0);
    this.maxSpeed = 2.5;
    this.maxForce = 0.15;
    
    this.size = random(12, 18);
    this.color = color(random(fishColors));
    this.tailAngle = random(100);
    this.angle = this.vel.heading();
  }

  // escape mouse
  flee(target) {
    let d = p5.Vector.dist(this.pos, target);
    let fleeRadius = 120; 

    if (d < fleeRadius) {
      let desired = p5.Vector.sub(this.pos, target);
      desired.setMag(this.maxSpeed * 2.2); 
      
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce * 2.5);
      this.acc.add(steer);
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0); 

    let margin = 30;
    if (this.pos.x < margin) this.vel.x += 0.2;
    if (this.pos.x > width - margin) this.vel.x -= 0.2;
    if (this.pos.y < margin) this.vel.y += 0.2;
    if (this.pos.y > height - margin) this.vel.y -= 0.2;

    let targetAngle = this.vel.heading();
    this.angle = lerp(this.angle, targetAngle, 0.1);

    this.tailAngle += this.vel.mag() * 0.15;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    noStroke();
    fill(this.color);

    ellipse(0, 0, this.size * 2, this.size);

    fill(255);
    ellipse(this.size * 0.5, -this.size * 0.25, 4, 4);
    fill(0);
    ellipse(this.size * 0.5 + 1, -this.size * 0.25, 2, 2);

    fill(this.color);
    let swing = sin(this.tailAngle) * 0.4; 
    
    push();
    translate(-this.size * 0.8, 0); 
    rotate(swing);
    
    beginShape();
    vertex(0, 0);
    bezierVertex(-this.size, -this.size * 0.8, -this.size * 1.5, -this.size * 0.5, -this.size * 1.8, -this.size * 0.2);
    bezierVertex(-this.size * 1.2, 0, -this.size * 1.5, this.size * 0.5, -this.size * 1.8, this.size * 0.2);
    bezierVertex(-this.size * 1.5, this.size * 0.5, -this.size, this.size * 0.8, 0, 0);
    endShape(CLOSE);
    pop();

    pop();
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 5;
    this.maxR = 80;
    this.alpha = 255;
  }

  update() {
    this.r += 2.5;
    this.alpha = lerp(this.alpha, 0, 0.04);
  }

  display() {
    push();
    stroke(255, 255, 255, this.alpha);
    strokeWeight(2);
    noFill();
    ellipse(this.x, this.y, this.r * 2);
    pop();
  }

  isFinished() {
    return this.alpha < 5;
  }
}