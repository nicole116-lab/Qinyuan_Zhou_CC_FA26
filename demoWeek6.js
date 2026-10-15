let frames = []

async function setup(){
  createCanvas(windowWidth, windowHeight);
  frameRate(11);
  rectMode(CENTER)
  imageMode(CENTER)

  for (let i = 1; i <= 4; i++) {
    frames.push(await loadImage('pic/' + i + '.png'));
  }
}

let counter = 0
let xLoc = 0
let xV =20
let dir = 1

function draw() {
  background(200);

  counter++;
  xLoc += xV;
  dir = 1;

 
  if (xLoc > width + 80) {
    xLoc = -80;
  }

  let currentFrame = frames[counter % frames.length];

  push();
  translate(xLoc, 0);
  scale(dir, 1);
  image(currentFrame, 0, height / 2);
  pop();
}