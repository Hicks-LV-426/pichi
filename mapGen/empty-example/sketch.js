let sx = 635;
let sy = 325;
let res = 4;
let shapeColors = new Map();

let pichiMap;
let finder;

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
  createCanvas(sx * res, sy * res);
  this.pichiMap = new PichiMap(sx, sy);
  this.pichiMap.Initialize();
  this.finder = new ShapeFinder(this.pichiMap);
  this.shapeColors = new Map();
}

function draw() {
  background(77);
  noStroke();

  drawMap();
  let shapes = this.finder.FindShape();
  this.drawShape(shapes);
  //drawLines();
  noLoop();
}

function drawMap()
{
  this.pichiMap.Points.forEach(p => 
    {
      this.drawPoint(p)
    });
  //for(let x = 0; x < cols; x++)
  //{
  //  for(let y = 0; y < rows; y++)
  //  {
  //    var p = columns[x][y];
  //    drawPoint(p);
  //  }
  //}
}

function drawShape(shapes)
{
  stroke(64);
  strokeWeight(0.5);
  for (const [key, pixel] of shapes)
  {
    const color = this.getShapeColor(pixel.ShapeId);
    const r = map(pixel.Value, 0, 1, 0, color.r);
    const g = map(pixel.Value, 0, 1, 0, color.g);
    const b = map(pixel.Value, 0, 1, 0, color.b);
    fill(r, g, b);
    square(pixel.X * res, pixel.Y * res, res);
  }
}


function getShapeColor(shapeId)
{
  if(!this.shapeColors.has(shapeId))
  {
    this.shapeColors.set(shapeId, {r: random(96,255), g: random(96,255), b: random(96,255)});
  }

  return this.shapeColors.get(shapeId);
}


function drawPoint(drawPoint) {
  if(!drawPoint) return;

  let colorStrength = map(drawPoint.Value, 0, 1, 0, 255);
  let r = map(colorStrength, 0, 255, 0, 25);
  let g = map(colorStrength, 0, 255, 0, 102)
  let landRed = map(colorStrength, 0, 255, 0, 43);
  stroke(64);
  strokeWeight(0.5);

  if (drawPoint.IsLand == 0) 
  {
    fill(r, g, colorStrength);
    //fill(0, 0, colorStrength);
  }
  else 
  {
    fill(landRed, colorStrength, 0);
    //fill(0, colorStrength, 0);
  }
  
  square(drawPoint.X * res, drawPoint.Y * res, res);
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