let wavesPerCanvas=8
let amplitude=50
let offset=0
let yLoc

function setup(){
    createCanvas(windowWidth,windowHeight)
    yLoc = height/2
    noFill()
}

function draw(){
    background(230)
    nShape(mouseX,mouseY,8,50)

    
        push()
    translate(0,yLoc)

    beginShape()
    for(let i=0; i<width; i++){

      let mappedI = map(i,0,width,0,wavesPerCanvas*TWO_PI)
      let y = sin(mappedI)*amplitude
      let x=i
      vertex(x,y)

    }
    endShape()
    pop()

    offset = frameCount*0.01
}

function nShape(yLoc,xLoc,numVertices,radius){

    push()
    translate(xLoc,yLoc)
    for(let i=0;i<numVertices;i++){
        let mappedI=map(i,0,numVertices,0,TWO_PI)
        
        let x=sin(mappedI)*radius
        let y=cos(mappedI)
    }

}

function noiseWave(){

}

function mousePressed(){

    let v =floor(random(3,20))
    nShape(mouseX,mouseY,v,v*4)
}

noiseWave(100,150,height/2,0.05)