let sx = 1800;
let sy = 1100;
let res = 4;
let rows = 10;
let cols = 10;
let columns = new Array();
let shapes = [];
let inc = 0.04;
let shapeR = 255;
let shapeG = 255;
let shapeB = 255;


class m_point {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    if (color > 0.55) {
      this.bit = 1;
    }
    else {
      this.bit = 0;
    }
    this.colorStrength = color;
  }
}

function setup() {
  createCanvas(sx, sy);
  rows = floor(sy / res);
  cols = floor(sx / res);
  noiseDetail(8);
}

function draw() {
  background(77);
  noStroke();
  let choices = [1, 0];

  let xoff = 0.01;

  // generate points
  for (let x = 1; x < cols; x++) {

    let row = [];
    let yoff = 0.01;

    for (let y = 1; y < rows; y++) {

      //let p = new m_point(x*res, y*res, random());
      let p = new m_point(x * res, y * res, noise(xoff, yoff));
      //noiseSeed+= 0.01;

      drawPoint(p);
      row.push(p);
      yoff += inc;
    }
    columns.push(row);
    xoff += inc;
  }

  drawLines();
  findShapes();


  noLoop();
}

function findShapes() {

  shapeStarted = false;
  let maxY = columns[0].length;

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < columns.length; x++) {
      if (columns[x][y].bit == 1 && !shapeStarted) {
        if (!pointWalked(x, y)) {
          shapeStarted = true;
          traceShape(x, y);
        }
      }
      else if (columns[x][y].bit == 0 && shapeStarted) {
        shapeStarted = false;
      }
    }
  }
}

function traceShape(x, y) {

  shapeR = map(random(), 0, 1, 64, 255);
  shapeG = map(random(), 0, 1, 64, 255);
  shapeB = map(random(), 0, 1, 64, 255);

  let shapePoints = new Array();
  let point = getPointAt(x, y);
  addPoint(point, x, y, shapePoints);
  walkNeighbours(x, y, shapePoints);

  shapes.push(shapePoints);
}

function pointWalked(x, y) {

  shapes.forEach(shape => {
    if (shape.find(p => p.x == x && p.y == y)) {
      return true;
    }
  });

  return false;
}

function walkNeighbours(x, y, shapePoints) {
  
  // find all neighbours to the left
  let currentX = x-1;
  let leftPoint = getPointAt(currentX, y);
  while(leftPoint) {
    addPoint(leftPoint, currentX, y, shapePoints);
    currentX -= 1;
    leftPoint = getPointAt(currentX, y);
  }
  
  // find all neighbours to the right
  currentX = x+1;
  let rightPoint = getPointAt(currentX, y);
  while(rightPoint) {
    addPoint(rightPoint, currentX, y, shapePoints);
    currentX += 1;
    rightPoint = getPointAt(currentX, y);
  }
}

function getPointAt(x, y) {
  if (x < 0 || y < 0 || x >= columns.length || y >= columns[0].length) {
    return null;
  }

  let point = columns[x][y];
  
  if (point.bit == 1) {
    return point;
  }
  else {
    return null;
  }
}

function addPoint(point, x, y, shapePoints) {
  if (!point) {
    return;
  }

  if (shapePoints.find(p => p.x == x && p.y == y)) {
    return;
  }

  shapePoints.push(new m_point(x, y, point.colorStrength));
  drawShapePoint(point.x, point.y);
  //findNeighbours(x, y, shapePoints);
}

function getCoordinates(direction, x, y) {
  switch (direction) {
    case "up":
      return [x, y - 1];
    case "left":
      return [x - 1, y];
    case "right":
      return [x + 1, y];
    case "down":
      return [x, y + 1];
  }
}

function drawShapePoint(x, y) {
  fill(shapeR, shapeG, shapeB);
  noStroke();
  square(x - 2, y - 2, res / 2);
}

function getPoint(x, y) {
  let next = columns[x][y];
  if (next.bit == 1) {
    return next;
  }
  else {
    return null;
  }
}

function drawLines() {
  for (let i = 0; i < columns.length - 1; i++) {
    var column = columns[i];

    for (let j = 0; j < column.length - 1; j++) {

      a = column[j];
      b = columns[i + 1][j];
      c = columns[i + 1][j + 1];
      d = column[j + 1];

      configuration = getConfiguration(a.bit, b.bit, c.bit, d.bit);
      drawLine(configuration, a, b, c, d);
    }
  }
}

function drawPoint(point) {
  if (point.bit == 0) {
    fill(0, 0, point.colorStrength * 255);
  }
  else {
    fill(0, point.colorStrength * 255, 0);
  }

  square(point.x - 2, point.y - 2, res / 2);

}

function getConfiguration(a, b, c, d) {
  return a * 8 + b * 4 + c * 2 + d * 1;
}

function drawLine(configuration, a, b, c, d) {
  noFill();
  stroke(160);
  strokeWeight(1);

  switch (configuration) {
    case 1:
      line(a.x, a.y + res * 0.5, d.x + res * 0.5, d.y);
      break;
    case 2:
      line(d.x + res * 0.5, d.y, c.x, b.y + res * 0.5);
      break;
    case 3:
      line(a.x, a.y + res * 0.5, b.x, b.y + res * 0.5);
      break;
    case 4:
      line(a.x + res * 0.5, a.y, b.x, b.y + res * 0.5);
      break;
    case 5:
      line(a.x, a.y + res * 0.5, d.x + res * 0.5, d.y);
      line(a.x + res * 0.5, a.y, b.x, b.y + res * 0.5);
      break;
    case 6:
      line(a.x + res * 0.5, a.y, d.x + res * 0.5, d.y);
      break;
    case 7:
      line(a.x, a.y + res * 0.5, a.x + res * 0.5, a.y);
      break;
    case 8:
      line(a.x, a.y + res * 0.5, a.x + res * 0.5, a.y);
      break;
    case 9:
      line(a.x + res * 0.5, a.y, d.x + res * 0.5, d.y);
      break;
    case 10:
      line(a.x, a.y + res * 0.5, a.x + res * 0.5, a.y);
      line(d.x + res * 0.5, d.y, b.x, b.y + res * 0.5);
      break;
    case 11:
      line(a.x + res * 0.5, a.y, b.x, b.y + res * 0.5);
      break;
    case 12:
      line(a.x, a.y + res * 0.5, b.x, b.y + res * 0.5);
      break;
    case 13:
      line(d.x + res * 0.5, d.y, b.x, b.y + res * 0.5);
      break;
    case 14:
      line(a.x, a.y + res * 0.5, d.x + res * 0.5, d.y);
      break;
  }
}