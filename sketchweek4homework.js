let petals = 12;     
let layers = 4;       
let petalLen = 150;   
let petalWid = 35;    
let jitter = 2;  

let bDoExportSvg = false;
p5.disableFriendlyErrors = true;

function setup() {
  createCanvas(400, 400);
  noFill();
  stroke(0);
  strokeWeight(1);
  frameRate(10);          
}

function draw() {
  if (bDoExportSvg) {
    beginRecordSvg("petals.svg");
  }

  background(255);
  translate(width / 2, height / 2);
  rotate(frameCount * 0.01);

  for (let l = 0; l < layers; l++) {
    
    let len = map(l, 0, layers - 1, petalLen, petalLen * 0.35);
    let wid = map(l, 0, layers - 1, petalWid, petalWid * 0.35);
    
    let offset = (l % 2) * (TWO_PI / petals / 2);

    let speed = (1%2==0?1:-1)*(0.005+1*0.004);
    push();
    rotate(frameCount*speed)
    
    for (let k = 0; k < petals; k++) {
      push();
      rotate((TWO_PI / petals) * k + offset);
      drawPetal(len, wid);
      pop();
    }
  }

  if (bDoExportSvg) {
    endRecordSvg();
    bDoExportSvg = false;
  }
}

function drawPetal(len, wid) {
  let steps = 40;

  for (let side = -1; side <= 1; side += 2) {  
    beginShape();
    for (let i = 0; i <= steps; i++) {
      let u = i / steps;
      let x = u * len;
      let y = side * sin(u * PI) * wid;

      if (i != 0 && i != steps) {
        y += random(-jitter, jitter);
      }
      splineVertex(x, y);
    }
    endShape();
  }
}

function keyPressed() {
  if (key == 's') {
    bDoExportSvg = true;
  }
}