let r=0

let w;
let numRects=20

function setup(){

    createCanvas(windowWidth,windowHeight)

    w=width/numRects

    rectMode(CENTER)
    angleMode(DEGREES)

      
}

function draw(){
    background(0)

    //translate(20,20)

      for(let x=0; x<numRects; x++){

        for(let y=0; y<numRects;y++){
           push()
           translate(w*x,h*y)
           rotate(r*y)
           rect(0,0,w/2,h/2);
           pop()

        }

      }
      r++
}
    

