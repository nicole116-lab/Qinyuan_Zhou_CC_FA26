let petals = 12;
let layers = 4;
let petalLen = 150;
let petalWid = 35;
let jitter = 2;
let colors = ["#e63946", "#f4a261", "#2a9d8f", "#264653"];

let bDoExportSvg = false;
// p5.disableFriendlyErrors = true;

function setup() {
  createCanvas(400, 400);
  noFill();
  strokeWeight(1);
  frameRate(10);
}

function draw() {
  background(255);
  translate(width / 2, height / 2);

  // all layers
  for (let l = 0; l < layers; l++) {
    drawLayer(l);
  }

  // export every layer seperately
  // if (bDoExportSvg) {
  //   for (let l = 0; l < layers; l++) {
  //     beginRecordSvg("layer" + (l + 1) + ".svg");
  //     drawLayer(l);
  //     endRecordSvg();
  //   }
  //   bDoExportSvg = false;
  // }

  if(bDoExportSvg) {
    beginRecordSvg('output.svg');
  }

  for (let l = 0; l < layers; l++) {
      drawLayer(l);
    }

  if(bDoExportSvg) {
    endRecordSvg();
    bDoExportSvg = false;
  }
}

function drawLayer(l) {
  randomSeed(frameCount * 10 + l);   

  let len = map(l, 0, layers - 1, petalLen, petalLen * 0.35);
  let wid = map(l, 0, layers - 1, petalWid, petalWid * 0.35);
  let offset = (l % 2) * (TWO_PI / petals / 2);
  let speed = (l % 2 == 0 ? 1 : -1) * (0.005 + l * 0.004);

  push();
  stroke(colors[l]);
  rotate(frameCount * speed);

  for (let k = 0; k < petals; k++) {
    push();
    rotate((TWO_PI / petals) * k + offset);
    drawPetal(len, wid);
    pop();
  }
  pop();
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

      if (i == 0 || i == steps) {
        curveVertex(x, y);  
      }
      curveVertex(x, y);
    }
    endShape();
  }
}

function keyPressed() {
  if (key == 's') {
    bDoExportSvg = true;
  }
}