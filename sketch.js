let t = 0;
let fourier = [];
let X = [];
let path = [];
let scale = 0;
let avgx = 0;
let avgy = 0;
let coordx = [];
let coordy = [];
let grey = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  drawing.reverse();
  for (let i = 0; i < drawing.length; i += 8) {
    let x = drawing[floor(i)][0];
    let y = drawing[floor(i)][1];
    coordx.push(x);
    coordy.push(y);
    X.push(createVector(x, y));
  }
  coordx.sort((a, b) => a - b);
  coordy.sort((a, b) => a - b);
  const scaley = (windowHeight * 0.5) / (coordy[coordy.length - 1] - coordy[0]);
  const scalex = (windowWidth * 0.5) / (coordx[coordx.length - 1] - coordx[0]);
  scale = scalex > scaley ? scaley : scalex;

  X.forEach((vector) => {
    vector.x -= (coordx[coordx.length - 1] + coordx[0]) / 2;
    vector.y -= (coordy[coordy.length - 1] + coordy[0]) / 2;
    vector.x *= scale;
    vector.y *= scale;
  });

  fourier = dft(X);
  fourier.sort((a, b) => b.amp - a.amp);
}

function draw() {
  frameRate(144);
  background(0);
  epicycles(fourier, t, path);
  t += 1 / fourier.length;
  if (t >= 1) {
    t = 0;
  }
  drawpath(t);
}

function epicycles(fourier, t, path) {
  let x = width / 2;
  let y = height / 2;
  fourier.forEach((cycle) => {
    const omega = TWO_PI * cycle.freq;
    let xold = x;
    let yold = y;
    x += cycle.amp * cos(omega * t + cycle.phase);
    y += cycle.amp * sin(omega * t + cycle.phase);
    drawcircles(xold, yold, cycle.amp);
    drawArrow(xold, yold, x, y, cycle.amp);
  });
  path.push(createVector(x, y));
  if (path.length >= X.length - 100) {
    path.shift();
  }
}

function drawpath(t) {
  noFill();
  stroke(220, 210, 0);
  strokeWeight(2);
  // let f = 1 - t;
  // for (let i = 1; i < path.length; i++) {
  //   stroke((221 * i * 2) / path.length, (209 * i * 2) / path.length, 0);
  //   line(path[i].x, path[i].y, path[i - 1].x, path[i - 1].y);
  // }
  beginShape();
  for (let i = 0; i < path.length; i++) {
    curveVertex(path[i].x, path[i].y);
  }
  endShape();
}

function drawArrow(xold, yold, x, y, scal) {
  scal *= 0.5;
  scal = constrain(scal, 0, 30);
  v = createVector(x - xold, y - yold);
  v.mult(0.99);
  push();
  colorMode(HSB);
  fill(200, 0.8);
  translate(x, y);
  rotate(v.heading());
  strokeWeight(0);
  triangle(-0.6 * scal, -0.3 * scal, 0, 0, -0.6 * scal, 0.3 * scal);
  pop();

  push();
  colorMode(HSB);
  strokeCap(ROUND);
  stroke(200, 0.7);
  strokeWeight(2.5);
  translate(xold, yold);
  line(0, 0, v.x, v.y);
  pop();
}

function drawcircles(x, y, l) {
  push();
  colorMode(HSB);
  if (grey) {
    stroke(0, 0, 33, 0.8);
  } else {
    stroke(196, 68, 33, 0.8);
  }
  noFill();
  strokeWeight(2);
  circle(x, y, 2 * l);
  grey = !grey
  pop();
}
