let y

function setup() {
    createCanvas(400, 400);
    y=0  //start  
    x=random(0, width)
    diameter1=random(6, 9.99)
    diameter2=random(10, 20)
}

let yspeed=0
let gravity=0.3

function draw() {
    background('#F5DDCD');
    fill('#97D6F3');
    ellipse(x, y, diameter1, diameter2);
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
  }
}
    