let vines = [];

function setup() {
  createCanvas(800, 900);
  background(0); 
  drawBackgroundGrid();
  vines.push(new Vine(width / 2, height, -HALF_PI, 6, 0));
}

function draw() {
  for (let i = vines.length - 1; i >= 0; i--) {
    let v = vines[i];
    v.grow();
    v.display();

    if (v.shouldBranch()) {
      vines.push(v.branch());
    }

    if (v.isDead()) {
      vines.splice(i, 1);
    }
  }
}

function drawBackgroundGrid() {
  stroke(20, 50, 30);
  strokeWeight(1);
  noFill();

  let gridSize = 60;
  for (let x = 0; x <= width; x += gridSize) {
    for (let y = 0; y <= height; y += gridSize) {
      push(); // 
      translate(x, y); 
      ellipse(0, 0, 2, 2);
      pop();
    }
  }
}


class Vine {
  constructor(x, y, angle, thickness, depth) {
    this.pos = createVector(x, y);
    this.prevPos = this.pos.copy();
    this.angle = angle;
    this.thickness = thickness;
    this.depth = depth;

    this.speed = random(2, 3.5);
    this.life = random(180, 350) / (depth * 0.6 + 1);
    this.age = 0;

    this.isCurling = false;
    this.curlAngle = 0;
    this.curlRadius = random(15, 28);
    this.curlDir = random(1) > 0.5 ? 1 : -1;
    this.curlProgress = 0;

    this.noiseOffset = random(1000);

    this.baseColor = color(40, 220, 90);
    this.tipColor = color(170, 255, 120);
    this.currentColor = this.baseColor;
  }

  grow() {
    this.age++;
    this.prevPos = this.pos.copy();

    if (!this.isCurling && random(1) < 0.022 && this.age > 25) {
      this.isCurling = true;
      this.curlAngle = this.angle;
      this.curlProgress = 0;
      this.curlDir = random(1) > 0.5 ? 1 : -1;
    }

    if (this.isCurling) {
      this.curlProgress += 0.12;
      let currentR = map(this.curlProgress, 0, TWO_PI * 1.2, this.curlRadius, 2);
      this.curlAngle += 0.15 * this.curlDir;

      let offsetX = cos(this.curlAngle) * currentR;
      let offsetY = sin(this.curlAngle) * currentR;
      
      this.pos.add(createVector(offsetX * 0.16, offsetY * 0.16));

      if (this.curlProgress >= TWO_PI * 1.2) {
        this.isCurling = false; 
      }
    } else {
      let noiseVal = noise(this.noiseOffset + frameCount * 0.02);
      let angleChange = map(noiseVal, 0, 1, -0.2, 0.2);
      this.angle += angleChange;

      let moveVec = p5.Vector.fromAngle(this.angle).mult(this.speed);
      this.pos.add(moveVec);
    }

    let progress = this.age / this.life;
    this.currentColor = lerpColor(this.baseColor, this.tipColor, progress);
    this.currentThickness = lerp(this.thickness, 0.8, progress);
  }

  shouldBranch() {
    return (
      !this.isCurling &&
      this.age > 30 &&
      this.age < this.life - 30 &&
      random(1) < 0.03 &&
      this.depth < 3
    );
  }

  branch() {
    let branchAngle = this.angle + random([-1, 1]) * random(QUARTER_PI, HALF_PI);
    return new Vine(
      this.pos.x,
      this.pos.y,
      branchAngle,
      this.currentThickness * 0.75,
      this.depth + 1
    );
  }

  isDead() {
    return (
      this.age >= this.life ||
      this.pos.x < -20 ||
      this.pos.x > width + 20 ||
      this.pos.y < -20
    );
  }

  display() {
    push();
    stroke(this.currentColor);
    strokeWeight(this.currentThickness);
    strokeCap(ROUND);
    
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
    pop();
  }
}

//new vine
function mousePressed() {
  vines.push(new Vine(mouseX, mouseY, -HALF_PI, 4, 0));
}

function keyPressed() {
  background(0)
}