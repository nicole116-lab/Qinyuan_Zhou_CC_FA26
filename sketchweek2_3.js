let y
let r,g,b
let yspeed=0.2
let gravity=0.15
let drops=[]
let numdrops=100

function setup() {
    createCanvas(400, 400);
    for (let i=0; i<numdrops; i++){
        drops.push(makedrops())
    }
}

function makedrops(){
    let colortype = floor(random(0, 3))
    let r,g,b
    //purple
    if (colortype==0){
        r=random(140, 190)
        g=random(80, 130)
        b=random(200, 255)
        //blue
    } else if (colortype==1){
        r=random(50, 100)
        g=random(150, 200)
        b=random(220, 255)
        //white
    } else {
        r=random(220, 255)
        g=random(220, 255)
        b=random(230, 255)
        alpha=random(0.5, 0.7)
    }

    return{
      x:random(0, width),
      y:random(-400, 0),
      diameter:random(10, 10),
      yspeed:random(4, 8),
      r:r,
      g:g,
      b:b,
      alpha:alpha
    }
  }

function draw() {
    background('#1174EC');

    for(let i=0; i<drops.length; i++){

    fill(drops[i].r,drops[i].g,drops[i].b);
    ellipse(drops[i].x, drops[i].y, drops[i].diameter*0.3, drops[i].diameter);
    noStroke()
    //stroke('#68bfe8');
    //strokeWeight(1);

    drops[i].y= drops[i].y + drops[i].yspeed
    drops[i].yspeed= drops[i].yspeed + gravity

    if (drops[i].y>height) {
    drops[i]=makedrops()
  }
}
}
    