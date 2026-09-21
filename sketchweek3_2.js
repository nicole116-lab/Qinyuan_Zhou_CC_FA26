let x=0
let lerpedMouseX=0
let lerpedmouseY=0

function setup(){

    createCanvas(windowWidth,windowHeight)
    rectMode(CENTER)
    angleMode(DEGREES)
}

function draw(){

    background(0)

    stroke(255)
    strokeWeight(2)
    noFill()

    //simple demo of what lerp is
    // push()
    // translate(0,height/2)
    // rect(0,0,50)
    // pop()

    // push()
    // translate(width,height/2)
    // rect(0,0,50)
    // pop()

    // x=lerp(0,width,0.25)

      lerpedMouseX=lerp(lerpedMouseX,mouseX,0.05)
    // lerpedMouseX=lerp(lerpedMouseY,mouseY,0.05)

    push()
    translate(lerpedMouseX,height/2)
    rect(0,0,50)
    pop()

     rect(100,80,50)

    // lerpedMouseX=lerp(lerpedMouseX,mouseX,0.05)
    // lerpedMouseX=lerp(lerpedMouseY,mouseY,0.05)

    // push()
    // translate(lerpedMouseX,height/2)
    // rect(0,0,50)
    // pop()

}