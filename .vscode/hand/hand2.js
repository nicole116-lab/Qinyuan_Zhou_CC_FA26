let camera;
let clip;
let handPose;
let hands = [];
let trackingStarted = false;
let videoLayer;

function preload() {
  handPose = ml5.handPose({ maxHands: 2 });
}

function setup() {
  createCanvas(640, 480);

  camera = createCapture(VIDEO);
  camera.size(width, height);
  camera.hide();

  clip = createVideo("portrait.mp4");
  clip.volume(0);
  clip.hide();


  videoLayer = createGraphics(width, height);
  videoLayer.pixelDensity(1);
}

function draw() {
  background(30);

  if (camera.elt.readyState >= 2) {
    if (!trackingStarted) {
      trackingStarted = true;
      handPose.detectStart(camera, gotHands);
    }

    push();
    translate(width, 0);
    scale(-1, 1);
    image(camera, 0, 0, width, height);
    pop();
  }

  if (hands.length < 2) {
    noStroke();
    fill(255);
    text("Show both hands. Click to play the video.", 15, 25);
    return;
  }


  let indexA = mirrorPoint(hands[0].keypoints[8]);
  let thumbA = mirrorPoint(hands[0].keypoints[4]);
  let indexB = mirrorPoint(hands[1].keypoints[8]);
  let thumbB = mirrorPoint(hands[1].keypoints[4]);

  if (clip.elt.readyState >= 2) {
    colorVideo();

  
    let ctx = drawingContext;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(indexA.x, indexA.y);
    ctx.lineTo(indexB.x, indexB.y);
    ctx.lineTo(thumbB.x, thumbB.y);
    ctx.lineTo(thumbA.x, thumbA.y);
    ctx.closePath();
    ctx.clip();

    image(videoLayer, 0, 0);

    ctx.restore();
  }

  stroke(255);
  strokeWeight(2);
  line(indexA.x, indexA.y, indexB.x, indexB.y);
  line(thumbA.x, thumbA.y, thumbB.x, thumbB.y);
  line(indexA.x, indexA.y, thumbA.x, thumbA.y);
  line(indexB.x, indexB.y, thumbB.x, thumbB.y);
}

function colorVideo() {
 
  videoLayer.image(clip, 0, 0, width, height);
  videoLayer.loadPixels();

  
  for (let i = 0; i < videoLayer.pixels.length; i += 4) {
    videoLayer.pixels[i] = videoLayer.pixels[i] * 1.2;         // 红加一点
    videoLayer.pixels[i + 1] = videoLayer.pixels[i + 1] * 0.5; // 绿减半
    videoLayer.pixels[i + 2] = videoLayer.pixels[i + 2] * 1.3; // 蓝加一点
  }

  videoLayer.updatePixels();
}

function gotHands(results) {
  hands = results;
}

function mirrorPoint(point) {
  return { x: width - point.x, y: point.y };
}

function mousePressed() {
  clip.loop();
}