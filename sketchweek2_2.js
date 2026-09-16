let y
let r,g,b
let yspeed=0
let gravity=0.3

function setup() {
    createCanvas(400, 400);
    y=0  //start  
    x=random(0, width)
    diameter=random(10, 20)
    r=random(50, 120)
    g=random(120, 200)
    b=random(220, 255)
}

function draw() {
    background('#1174EC');
    fill(r,g,b);
    ellipse(x, y, diameter*0.3, diameter);
    noStroke()
    //stroke('#68bfe8');
    //strokeWeight(1);

    y= y + yspeed
    yspeed= yspeed + gravity

    if (y>height) {
    y=0
    yspeed=random(0, 5)
    x=random(0, width)
    diameter1=random(6, 9.99)
    diameter2=random(10, 20)
    r=random(50, 120)
    g=random(120, 200)
    b=random(220, 255)
  }
}
    