const W = 640;
const H = 480;
const SPACING = 24;
const SOUND_DISTANCE = 12; 

const colors = [
  [125, 169, 255],
  [255, 135, 198],
  [190, 236, 123]
];

const heights = [168, 246, 324];
const speeds = [2, 1.7, 1.5];
const notes = ["C5", "E5", "G5"];

const dots = [];

let video;
let handPose;
let hand = null;
let trackingStarted = false;
let trackingStatus = "Waiting for camera...";
let piano;

function preload() {
  handPose = ml5.handPose({ maxHands: 1 });
}

function setup() {
  createCanvas(W, H);

  
  for (let i = 0; i < 3; i++) {
    dots[i] = [];

    for (let x = 0; x < W; x += SPACING) {
      dots[i].push({
        x: x,
        y: heights[i],
        played: false,
        flash: 0
      });
    }
  }

  video = createCapture(VIDEO);
  video.size(W, H);
  video.hide();
}

function draw() {
  background(40);

  if (video.elt.readyState >= 2) {
    if (!trackingStarted) {
      trackingStarted = true;
      trackingStatus = "Waiting for hand tracking...";
      handPose.detectStart(video, gotHands);
    }


    push();
    translate(W, 0);
    scale(-1, 1);
    image(video, 0, 0, W, H);
    pop();
  }

  noStroke();

  for (let i = 0; i < 3; i++) {
    const baseY = heights[i];
    const color = colors[i];

    for (const dot of dots[i]) {
      dot.x += speeds[i];

      
      if (dot.x > W) {
        dot.x = 0;
        dot.y = baseY;
        dot.played = false;
        dot.flash = 0;
      }

      let targetY = baseY;

      
      if (hand) {
        for (const point of hand) {
          const handX = W - point.x;
          const handY = point.y;
          const distance = dist(dot.x, targetY, handX, handY);

          if (distance < 45) {
            if (targetY < handY) {
              targetY = handY - 45;
            } else {
              targetY = handY + 45;
            }
          }
        }
      }

      dot.y = lerp(dot.y, targetY, 0.15);

   
      const offset = abs(dot.y - baseY);

      if (offset < SOUND_DISTANCE) {
   
        dot.played = false;
      } else if (!dot.played) {
       
        dot.played = true;

        if (piano) {
         
          const velocity = constrain(offset / 45, 0.3, 1);
          piano.triggerAttackRelease(notes[i], 0.18, undefined, velocity);
          dot.flash = 1;
        }
      }

      fill(color[0], color[1], color[2], dot.flash * 160);
      circle(dot.x, dot.y, 16);

      fill(color[0], color[1], color[2]);
      circle(dot.x, dot.y, 7 + dot.flash * 4);

      dot.flash *= 0.82;
    }
  }

  fill(0, 180);
  rect(0, 0, W, 46);

  fill(255);
  textSize(13);
  text(trackingStatus, 12, 18);

  if (piano) {
    text("Sound on", 12, 36);
  } else {
    text("Click the canvas to enable sound", 12, 36);
  }
}

function gotHands(results) {
  if (results.length > 0) {
    hand = results[0].keypoints;
    trackingStatus = "Hand detected";
  } else {
    hand = null;
    trackingStatus = "Show an open hand";
  }
}

async function mousePressed() {
  if (piano) return;

  await Tone.start();

  piano = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.005,
      decay: 0.15,
      sustain: 0,
      release: 0.15
    }
  }).toDestination();

  piano.volume.value = -12;
}