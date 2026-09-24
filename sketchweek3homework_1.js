let stems = [];
const COLS = 18; 
const ROWS = 11; 
const SCALE_FACTOR = 0.5; 

const bluePalette = [
  { c: [226, 65, 58], w: 13 }, 
  { c: [223, 53, 68], w: 10 }, 
  { c: [208, 45, 84], w: 9  }, 
  { c: [214, 50, 77], w: 8  }, 
  { c: [218, 51, 72], w: 8  }, 
  { c: [227, 57, 63], w: 7  }, 
  { c: [226, 62, 61], w: 7  }, 
  { c: [233, 24, 69], w: 6  }, 
  { c: [197, 36, 93], w: 6  }, 
  { c: [214, 26, 82], w: 5  }, 
  { c: [193, 15, 96], w: 3  }, 
];
// darker
const darkPalette = [
  [225, 87, 28], 
  [225, 79, 49], 
];
//orange&purple
const accentPeach  = [10, 42, 86];   
const accentPurple = [[298, 19, 73], [303, 18, 77]]; 

function setup() {
  createCanvas(800, 950);
  strokeCap(ROUND);
  colorMode(HSB, 360, 100, 100);
  generateStems();
}

function draw() {
  background(0, 0, 100);

  push();
  translate(width / 2, height / 2);
  scale(SCALE_FACTOR);
  translate(-width / 2, -height / 2);

  for (let s of stems) s.display();

  pop();
}

function pickWeighted(list) {
  let totalW = list.reduce((sum, p) => sum + p.w, 0);
  let r = random(totalW);
  for (let p of list) {
    if (r < p.w) return p.c;
    r -= p.w;
  }
  return list[0].c;
}

function pickColorForPosition(u, v) {
  let accentN = noise(u * 3.5 + 100, v * 3.5 + 100);

  if (u > 0.22 && u < 0.78 && v > 0.08 && v < 0.55) {
    if (accentN > 0.62 && accentN < 0.70) return accentPeach;
    if (accentN > 0.72 && accentN < 0.78) return random(accentPurple);
  }

  let blobN = noise(u * 1.3 + 300, v * 1.3 + 300);
  let centerFade = 1 - constrain(abs(u - 0.5) * 1.6, 0, 1);
  let vFade = constrain(map(v, 0.45, 1.0, 0, 1), 0, 1);
  let darkScore = blobN * 0.6 + vFade * 0.25 + centerFade * 0.15;
  if (darkScore > 0.72) return random(darkPalette);

  return pickWeighted(bluePalette);
}

function generateStems() {
  stems = [];
  let marginX = width * 0.14;
  let marginY = height * 0.14;
  let drawW = width - marginX * 2;
  let drawH = height - marginY * 2;

  let cellW = drawW / (COLS - 1);
  let cellH = drawH / (ROWS - 1);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let xBase = marginX + c * cellW + random(-cellW * 0.3, cellW * 0.3);
      let yBase = marginY + r * cellH;

      let maxLength = map(r, 0, ROWS - 1, drawH * 0.32, drawH * 0.1);
      let len = random(maxLength * 0.8, maxLength);

      let weight = map(r, 0, ROWS - 1, 48, 36);

      let u = c / (COLS - 1);
      let v = r / (ROWS - 1);
      let baseColor = pickColorForPosition(u, v);

      stems.push(createStem(xBase, yBase, len, weight, baseColor));
    }
  }
}

function createStem(x, y, len, weight, baseColor) {
  let numSegments = 16;
  let wavePhase = random(0, TWO_PI);
  let waveSpeed = random(0.015, 0.03);
  let waveFrequency = random(0.06, 0.1);

  return {
    x: x,
    y: y,
    len: len,
    numSegments: numSegments,
    weight: weight,
    h: baseColor[0],
    s: baseColor[1],
    b: baseColor[2],
    wavePhase: wavePhase,
    waveSpeed: waveSpeed,
    waveFrequency: waveFrequency,
    display: function () {
      let points = [];
      for (let i = 0; i <= this.numSegments; i++) {
        let t = i / this.numSegments;
        let currentY = this.y - t * this.len;
        let mainWave = sin(frameCount * this.waveSpeed + t * 4 * this.waveFrequency + this.wavePhase);
        let detailWave = cos(frameCount * this.waveSpeed * 1.8 + t * 8 * this.waveFrequency);
        let combinedWave = mainWave + detailWave * 0.25;
        let flexAmount = map(this.len, 40, 250, 6, 22);
        let currentX = this.x + combinedWave * flexAmount * pow(t, 1.2);
        points.push({ x: currentX, y: currentY, t: t });
      }

      strokeWeight(this.weight);
      noFill();

      for (let i = 0; i < points.length - 1; i++) {
        let pt1 = points[i];
        let pt2 = points[i + 1];
        let midT = (pt1.t + pt2.t) / 2;
        let targetBrightness = this.b * 0.65; 
        let currentBrightness = map(midT, 0, 1, this.b, targetBrightness);
        stroke(this.h, this.s, currentBrightness);
        line(pt1.x, pt1.y, pt2.x, pt2.y);
      }
    }
  };
}

function mousePressed() {
  generateStems();
}