function setup() {
    createCanvas(400, 1000);
    draw();
  }
  
  function createPetal(length, width) {
    return [
        createVector(0, 0, 0),
        createVector(length * 0.3, -width),
        createVector(length * 0.8, -width),
        createVector(length, 0),
        createVector(length * 0.8, width),
        createVector(length * 0.3, width),
    ];
}

  function drawPetals(x, y, count, startAt, petal) {
    
    const step = TWO_PI / count;
    push();
    translate(x, y);
    rotate(startAt);
    noStroke();

    for (let i = 0; i < count; i += 1) {
      beginShape();

      var h = map(hour(), 0, 24, 0, 24);
        
        if (i < h) { 
            fill(255,214,0) 
        }

        else { 
            fill(255,231,106) 
        }

      vertex(0, 0);
      beginContour();

      for (let j = 1; j < petal.length; j++) {
        vertex(petal[j].x, petal[j].y);
      }

      endContour();
      endShape();
      rotate(step);
    }

    pop();

  }
  
  function draw() {

    background(255);

    // stem

    fill(0,100,0);
    noStroke();
    rect(width/2-10,height/3+175,20,350);  

    var s = map(second(), 0, 60, 0, 350);
    fill(0, 50, 0);
    noStroke();
    rect(width/2-10,(height/3)+525,20,-s);
    
    const petal = createPetal(200, 20);

    // petals
    drawPetals(width / 2, height / 3, 24, 0, petal);
    
    // center

    const sectorAngle = TWO_PI / 60;
    const sizeCenter = min(width, height) * 0.2 * 2;

    for (let i = 0; i < 60; i++) {
        const startAngle = i * sectorAngle;
        const endAngle = (i + 1) * sectorAngle;


        var m = map(minute(), 0, 60, 0, 60);

        if (i < m) { fill(90,50,0) }
        else { fill(150,95,20) }

        beginShape();
        vertex(width / 2, height / 3);
        arc(width / 2, height / 3, sizeCenter, sizeCenter, startAngle, endAngle, PIE);
        endShape(CLOSE);
    }
  }
