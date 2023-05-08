const backgroundColor = "black";
const lineColor= "white";

class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

function project(point) {
  const isoAngleX = Math.atan(Math.sin(Math.PI / 4));
  const isoAngleY = Math.atan(Math.sin(Math.PI));

  const rotatedX = rotateX(point, isoAngleX);
  const rotatedXY = rotateY(rotatedX, isoAngleY);

  const scale = 1;
  const x = rotatedXY.x * scale;
  const y = rotatedXY.y * scale;
  return new Point(x, y, point.z);
}

function rotateX(point, angle) {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const y = point.y * cos - point.z * sin;
  const z = point.z * cos + point.y * sin;
  return new Point(point.x, y, z);
}

function rotateY(point, angle) {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const x = point.x * cos - point.z * sin;
  const z = point.z * cos + point.x * sin;
  return new Point(x, point.y, z);
}

function drawFace(ctx, points, color) {
  const path = new Path2D();

  path.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);
  }
  path.closePath();
  ctx.fillStyle = backgroundColor;
  ctx.fill(path);
  ctx.strokeStyle = lineColor;
  ctx.stroke(path);
}

function drawCube(ctx, points, id) {
  const faces = [
    { vertices: [points[0], points[1], points[5], points[4]] }, // Front face
    // { vertices: [points[1], points[2], points[6], points[5]] }, // Right face (unseen)
    // { vertices: [points[2], points[3], points[7], points[6]] }, // Back face (unseen)
    { vertices: [points[3], points[0], points[4], points[7]] }, // Left face
    { vertices: [points[3], points[2], points[1], points[0]] }, // Top face
    { vertices: [points[4], points[5], points[6], points[7]] }, // Bottom face
  ];

  faces.forEach((face) => {
    face.averageZ =
      face.vertices.reduce((sum, vertex) => sum + vertex.z, 0) /
      face.vertices.length;
  });

  faces.sort((a, b) => b.averageZ - a.averageZ);

  faces.forEach((face) => {
    drawFace(ctx, face.vertices);
  });

  const drawId = false; // Draw cube ID
  if (drawId) {
    const avgX =
      points.reduce((sum, vertex) => sum + vertex.x, 0) / points.length;
    const avgY =
      points.reduce((sum, vertex) => sum + vertex.y, 0) / points.length;
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(id, avgX, avgY - 12);
  }
}

const canvas = document.getElementById("myCanvas");
canvas.width = 400;
canvas.height = 400;
canvas.style.backgroundColor = backgroundColor;
const ctx = canvas.getContext("2d");
const size = 30;
const center = { x: canvas.width / 2, y: canvas.height / 2 };

const cubeVertices = [
  new Point(-size / 2, -size / 2, -size / 2),
  new Point(size / 2, -size / 2, -size / 2),
  new Point(size / 2, size / 2, -size / 2),
  new Point(-size / 2, size / 2, -size / 2),
  new Point(-size / 2, -size / 2, size / 2),
  new Point(size / 2, -size / 2, size / 2),
  new Point(size / 2, size / 2, size / 2),
  new Point(-size / 2, size / 2, size / 2),
];

let angle = Math.PI / 4;
const targetAngle = angle + Math.PI / 2;
const interval = 5000;
let animationFrameId;
let lastFrameTime = 0;
const frameRate = 30; // limit FPS
const cubeSpacingX = size * Math.sqrt(2);
const triangleHeight = Math.sqrt(size * size - (size / 2) * (size / 2));
const cubeSpacingY = triangleHeight * 2 - 2;
const initialPositions = generateCubePositions(center, size, 7);

function generateCubePositions(center, size, depth) {
  const positions = [];
  let id = 0;

  const addCube = (x, y) => {
    positions.push({ id: id, x: center.x + x, y: center.y + y });
    id++;
  };

  const n = (2 * depth + 1) ** 2; // number of cubes to create
  const directions = ["ne", "se", "sw", "nw"];
  let currentDirIndex = 0;

  function turnRight() {
    currentDirIndex = (currentDirIndex + 1) % directions.length;
  }
  let cx = 0;
  let cy = 0;

  function generateTurnIndexes(i) {
    const arr = [];
    let value = 0;
    let increment = 1;
    while (value < n) {
      arr.push((value += increment));
      arr.push((value += increment++));
    }
    return arr;
  }
  let turnIndexes = generateTurnIndexes(n);

  for (let i = 0; i < n; i++) {
    addCube(cx, cy);

    if (turnIndexes.includes(i)) {
      turnRight();
    }
    switch (currentDirIndex) {
      case 0:
        cx += cubeSpacingX;
        cy += -cubeSpacingY / 2;
        break;
      case 1:
        cx += cubeSpacingX;
        cy += cubeSpacingY / 2;
        break;
      case 2:
        cx += -cubeSpacingX;
        cy += cubeSpacingY / 2;
        break;
      case 3:
        cx += -cubeSpacingX;
        cy += -cubeSpacingY / 2;
        break;
      default:
        console.log(`Invalid direction: ${currentIndex}`);
    }
  }
  positions.sort((a, b) => {
    const distanceA = Math.sqrt(
      Math.pow(a.x - center.x, 2) + Math.pow(a.y - center.y, 2)
    );
    const distanceB = Math.sqrt(
      Math.pow(b.x - center.x, 2) + Math.pow(b.y - center.y, 2)
    );

    return distanceA - distanceB;
  });

  return positions;
}

function drawInitialCubes() {
  initialPositions.forEach((position, index) => {
    const rotatedVertices = cubeVertices.map((vertex) => {
      let rotated = rotateX(vertex, 0);
      rotated = rotateY(rotated, angle);
      return rotated;
    });

    const projectedVertices = rotatedVertices.map((vertex) => {
      const projected = project(vertex);
      projected.x += position.x;
      projected.y += position.y;
      return projected;
    });

    drawCube(ctx, projectedVertices, index);
  });
}

function animateCube() {
  let startTime = performance.now();

  function drawFrame(timestamp) {
    const elapsedTime = timestamp - startTime;
    if (timestamp - lastFrameTime >= 1000 / frameRate) {
      const fullRotationTime = (interval * 1) / initialPositions.length;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      initialPositions.forEach((position, index) => {
        // if not offCanvas
        if (
          position.x - size < canvas.width &&
          position.x + size > 0 &&
          position.y < canvas.height + size*2 &&
          position.y > 0
        ) {
          const cubeElapsedTime = Math.max(
            0, elapsedTime - index * fullRotationTime
          );
          const cubeRotationProgress = Math.min(1, cubeElapsedTime / 1000);

          const cubeAngle = Math.PI / 4 + (Math.PI / 2) * cubeRotationProgress;

          const rotatedVertices = cubeVertices.map((vertex) => {
            let rotated = rotateX(vertex, 0);
            rotated = rotateY(rotated, cubeAngle);
            return rotated;
          });

          const projectedVertices = rotatedVertices.map((vertex) => {
            const projected = project(vertex);
            projected.x += position.x;
            projected.y += position.y;
            projected.y -= cubeSpacingY * cubeRotationProgress;

            return projected;
          });

          drawCube(ctx, projectedVertices, index);
        }
      });

      lastFrameTime = timestamp;
    }

    if (elapsedTime < interval) {
      animationFrameId = requestAnimationFrame(drawFrame);
    } else {
      startTime = performance.now();
      animationFrameId = requestAnimationFrame(drawFrame);
    }
  }

  function startAnimation() {
    drawInitialCubes();
    animationFrameId = requestAnimationFrame(drawFrame);
  }

  function stopAnimation() {
    cancelAnimationFrame(animationFrameId);
  }

  startAnimation();

  setInterval(() => {
    stopAnimation();
    startAnimation();
  }, interval);
}
animateCube();
