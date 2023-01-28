let t = 0;
let fourier = [];
let X = [];
let path = [];
let scale = 0;
let avgx = 0;
let avgy = 0;
let coordx = [];
let coordy = [];

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
    drawcircles(x, y, cycle.amp, cycle.freq);
    let xold = x;
    let yold = y;
    x += cycle.amp * cos(omega * t + cycle.phase);
    y += cycle.amp * sin(omega * t + cycle.phase);
    drawArrow(xold, yold, x, y, cycle.amp);
  });
  path.push(createVector(x, y));
  if (path.length >= X.length - 100) {
    path.shift();
  }
}

function drawpath(t) {
  stroke(221, 209, 0);
  strokeWeight(2);
  // fill(221, 209, 0);
  let f = 1 - t;
  // for (let i = 1; i < path.length; i++) {
  //   stroke((221 * i * 2) / path.length, (209 * i * 2) / path.length, 0);
  //   line(path[i].x, path[i].y, path[i - 1].x, path[i - 1].y);
  // }
  beginShape();
  for (let i = 0; i < path.length; i++) {
    curveVertex(path[i].x, path[i].y);
  }
  vertex(0,0)
  endShape();
}

function drawArrow(xold, yold, x, y, scal) {
  scal *= 0.5;
  scal = constrain(scal, 0, 30);
  v = createVector(x - xold, y - yold);
  v.mult(0.99);
  push();
  fill(200);
  translate(x, y);
  rotate(v.heading());
  strokeWeight(0);
  triangle(-0.6 * scal, -0.3 * scal, 0, 0, -0.6 * scal, 0.3 * scal);
  pop();

  push();
  stroke(200);
  strokeWeight(2);
  translate(xold, yold);
  line(0, 0, v.x, v.y);
  pop();
}

function drawcircles(x, y, l, freq) {
  if (freq % 2 == 1 && l != 0) {
    stroke(27, 69, 84);
  } else {
    stroke(84);
  }
  noFill();
  strokeWeight(2);
  circle(x, y, 2 * l);
}
