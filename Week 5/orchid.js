let drawingLayers = [];
let flowerAreas = [];

let waterBlue;
let waterAqua;
let flowerLayer;

const rippleCount = 4;

function setup() {
  createCanvas(444, 630);
  background(255);
  noFill();

  scale(3);
  strokeWeight(0.32);

  waterBlue = makeColorLayer(
    "water-blue",
    "01 Blue Ripples",
    "#365c9c"
  );

  waterAqua = makeColorLayer(
    "water-aqua",
    "02 Aqua Ripples",
    "#77b6ba"
  );

  flowerLayer = makeColorLayer(
    "flower",
    "03 Flower",
    "#ae3c57"
  );

  makeArtwork();

  createButton("Download SVG").mousePressed(exportArtwork);
  noLoop();
}

function makeColorLayer(id, label, colorValue) {
  const group = {
    id: id,
    label: label,
    colorValue: colorValue,
    items: []
  };

  drawingLayers.push(group);
  return group;
}

// Draw a path and record the same path for SVG export.
function plotPath(points, group) {
  if (points.length < 3) return;

  stroke(group.colorValue);
  beginShape();

  let pathData = "";

  for (let i = 0; i < points.length; i++) {
    const x = points[i][0];
    const y = points[i][1];

    vertex(x, y);

    pathData +=
      (i === 0 ? "M " : " L ") +
      x.toFixed(3) + " " +
      y.toFixed(3);
  }

  endShape();
  group.items.push(`<path d="${pathData}"/>`);
}

function plotDot(x, y, group) {
  stroke(group.colorValue);
  ellipse(x, y, 0.8, 1.3);

  group.items.push(
    `<ellipse cx="${x}" cy="${y}" rx="0.4" ry="0.65"/>`
  );
}

// Generate both sides of a petal.
function makePetalPoints(cx, cy, angle, length, widthValue, variation) {
  const points = [];
  const rotation = angle * Math.PI / 180;

  for (const side of [-1, 1]) {
    for (let i = 0; i <= 100; i++) {
      let t = i / 100;

      if (side === 1) {
        t = 1 - t;
      }

      const x = length * t;

      const petalWidth =
        widthValue *
        Math.pow(
          Math.max(0, Math.sin(Math.PI * t)),
          0.65
        );

      const edge =
        1 +
        0.095 * Math.sin(t * Math.PI * 13 + variation) +
        0.045 * Math.sin(t * Math.PI * 27 + variation);

      const bend =
        1.7 *
        Math.sin(Math.PI * t) *
        Math.sin(t * 5 + variation);

      const y = side * petalWidth * edge + bend;

      points.push([
        cx + x * Math.cos(rotation) - y * Math.sin(rotation),
        cy + x * Math.sin(rotation) + y * Math.cos(rotation)
      ]);
    }
  }

  return points;
}

// Check whether a point is inside a flower shape.
function pointInFlowerShape(x, y, points) {
  let result = false;

  for (
    let i = 0, j = points.length - 1;
    i < points.length;
    j = i++
  ) {
    const ax = points[i][0];
    const ay = points[i][1];
    const bx = points[j][0];
    const by = points[j][1];

    if ((ay > y) !== (by > y)) {
      const crossing =
        (bx - ax) * (y - ay) / (by - ay) + ax;

      if (x < crossing) {
        result = !result;
      }
    }
  }

  return result;
}

// Leave a small opening around the center.
function plotPetal(points, opening = 0) {
  const closedPoints = [...points, points[0]];
  let section = [];

  for (const [x, y] of closedPoints) {
    const distance = Math.hypot(x - 74, y - 100);

    if (distance < opening) {
      plotPath(section, flowerLayer);
      section = [];
    } else {
      section.push([x, y]);
    }
  }

  plotPath(section, flowerLayer);
}

// Sample a cubic curve into points.
function sampleCurve(start, control1, control2, end) {
  const points = [];

  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const u = 1 - t;

    const x =
      u * u * u * start[0] +
      3 * u * u * t * control1[0] +
      3 * u * t * t * control2[0] +
      t * t * t * end[0];

    const y =
      u * u * u * start[1] +
      3 * u * u * t * control1[1] +
      3 * u * t * t * control2[1] +
      t * t * t * end[1];

    points.push([x, y]);
  }

  return points;
}

function plotFlowerCenter() {
  const curves = [
    [
      [68, 101], [65, 105], [67, 110], [72, 109],
      [76, 108], [76, 104], [80, 104],
      [84, 106], [80, 113], [76, 111]
    ],
    [
      [70, 99], [67, 93], [75, 91], [78, 98],
      [79, 102], [75, 104], [72, 101],
      [70, 99], [73, 97], [75, 99]
    ]
  ];

  for (const curve of curves) {
    let points = [];
    let start = curve[0];

    for (let i = 1; i < curve.length; i += 3) {
      const segment = sampleCurve(
        start,
        curve[i],
        curve[i + 1],
        curve[i + 2]
      );

      points = points.concat(
        points.length === 0 ? segment : segment.slice(1)
      );

      start = curve[i + 2];
    }

    plotPath(points, flowerLayer);
  }
}

function waterTouchesFlower(x, y) {
  const offsets = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];

  for (const area of flowerAreas) {
    for (const [dx, dy] of offsets) {
      if (pointInFlowerShape(x + dx, y + dy, area)) {
        return true;
      }
    }
  }

  return false;
}

function makeArtwork() {
  // Angle, length, width, edge variation.
  const petalSettings = [
    [-98, 57, 15, 1],
    [-166, 52, 23, 2],
    [-12, 54, 24, 3],
    [57, 39, 13, 5],
    [133, 37, 14, 6]
  ];

  const petals = [];

  for (const settings of petalSettings) {
    petals.push(makePetalPoints(74, 100, ...settings));
  }

  const lip = makePetalPoints(74, 101, 89, 23, 11, 8);
  flowerAreas = [...petals, lip];

  for (let i = 0; i < petalSettings.length; i++) {
    const [angle, length, widthValue, variation] =
      petalSettings[i];

    const rotation = angle * Math.PI / 180;

    plotPetal(petals[i], 6);

    const patches = [
      [0.31, 0.49, 0.20, -0.45, 3],
      [0.45, 0.31, 0.17, 0.45, 7]
    ];

    for (const [start, size, patchWidth, offset, change] of patches) {
      const x =
        74 +
        length * start * Math.cos(rotation) -
        widthValue * offset * Math.sin(rotation);

      const y =
        100 +
        length * start * Math.sin(rotation) +
        widthValue * offset * Math.cos(rotation);

      const patch = makePetalPoints(
        x,
        y,
        angle,
        length * size,
        widthValue * patchWidth,
        variation + change
      );

      plotPetal(patch);
    }

    for (let dot = 0; dot < 9; dot++) {
      const n = i * 9 + dot;

      const distance =
        7 + 11 * (0.5 + 0.5 * Math.sin(n * 7.13));

      const offset = 5 * Math.sin(n * 4.51);

      const x =
        74 +
        distance * Math.cos(rotation) -
        offset * Math.sin(rotation);

      const y =
        100 +
        distance * Math.sin(rotation) +
        offset * Math.cos(rotation);

      plotDot(x, y, flowerLayer);
    }
  }

  plotPetal(lip, 4);
  plotFlowerCenter();

  // Center x, center y, horizontal radius, vertical radius, phase.
  const rippleSettings = [
    [36, 35, 24, 12, 0.3],
    [111, 53, 24, 13, 1.7],
    [38, 157, 28, 16, 2.5],
    [109, 171, 24, 15, 0.8],
    [26, 111, 22, 13, 1.2],
    [123, 117, 21, 12, 2]
  ];

  for (const [cx, cy, rx, ry, phase] of rippleSettings) {
    for (let ring = 0; ring < rippleCount; ring++) {
      const ringScale = 0.36 + ring * 0.31;

      for (let arc = 0; arc < 3; arc++) {
        const start = phase + arc * 2.094 + ring * 0.15;
        const end = start + 1.72;

        const group =
          (ring + arc) % 2 === 0 ? waterBlue : waterAqua;

        let points = [];

        for (let i = 0; i <= 120; i++) {
          const angle = start + (end - start) * i / 120;

          const wobble =
            1 +
            0.018 * Math.sin(5 * angle + phase) +
            0.012 * Math.cos(9 * angle + ring);

          const x =
            cx + rx * ringScale * Math.cos(angle) * wobble;

          const y =
            cy + ry * ringScale * Math.sin(angle) * wobble;

          const onPage =
            x > 10 && x < 138 && y > 10 && y < 200;

          if (onPage && !waterTouchesFlower(x, y)) {
            points.push([x, y]);
          } else {
            plotPath(points, group);
            points = [];
          }
        }

        plotPath(points, group);
      }
    }
  }
}

function exportArtwork() {
  let text =
    '<svg xmlns="http://www.w3.org/2000/svg" ' +
    'xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" ' +
    'width="148mm" height="210mm" viewBox="0 0 148 210">';

  for (const group of drawingLayers) {
    text +=
      `<g id="${group.id}" ` +
      'inkscape:groupmode="layer" ' +
      `inkscape:label="${group.label}" ` +
      'fill="none" ' +
      `stroke="${group.colorValue}" ` +
      'stroke-width="0.32" ' +
      'stroke-linecap="round" stroke-linejoin="round">';

    text += group.items.join("");
    text += "</g>";
  }

  text += "</svg>";
  saveStrings([text], "flower-and-ripples", "svg");
}