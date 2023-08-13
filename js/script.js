// canvas width and size
const canvasWidth = 600;
const canvasHeight = 700;

// Car variables
let carWidth = 50;
let carHeight = 100;
let carX = canvasWidth / 4.2;
let carY = canvasHeight - carHeight - 10;
let carImg;
let time = 0;

// game over
let gameOver = false;
let gameWon = false;
let gameOverImg;

// finish line
let finishLine = false;
let finishLineImg;
// Keeping count of number of bg img that has been pass
let bgImageCount = 0;

finishLineImg = new Image();
finishLineImg.src = "assets/finishLine.png";

gameOverImg = new Image();
gameOverImg.src = "assets/gameover.png";

// Opposite car x position
let oppositeCarX = [
  canvasWidth / 1.45,
  canvasWidth / 1.9,
  canvasWidth / 2.58,
  canvasWidth / 4.2,
];
let oppositeCarY = [0, canvasHeight / 4.2];

let car = {
  x: carX,
  y: carY,
  width: carWidth,
  height: carHeight,
};

// Opposite car variables
let oppositeCars = [];

let numOppositeCars = 3;
let oppositeCarWidth = carWidth;
let oppositeCarHeight = carHeight;

// Speed variables
let oppositeCarSpeed = 5;
let oppositeCarImg;

// Background variables
let backgroundImg1 = new Image();
backgroundImg1.src = "assets/bg.jpg";

let backgroundImg2 = new Image();
backgroundImg2.src = "assets/bg.jpg";

let backgroundPositionY1 = 0;
let backgroundPositionY2 = -canvasHeight;

let backgroundSpeed = 6;

let finishLineObj = {
  x: -130,
  y: -canvasHeight,
  width: 600,
  height: 600,
};

class OppositeCar {
  constructor() {
    // choose 1 randomly from oppositeCarX
    this.x = oppositeCarX[Math.floor(Math.random() * oppositeCarX.length)];
    // this.y = -oppositeCarHeight; // Starting above the canvas
    this.y =
      -oppositeCarHeight -
      oppositeCarY[Math.floor(Math.random() * oppositeCarY.length)];
  }
}

const start = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  //   drawing car

  carImg = new Image();
  carImg.src = "assets/red.png";
  carImg.onload = () => {
    ctx.drawImage(carImg, car.x, car.y, car.width, car.height);
  };

  oppositeCarImg = new Image();
  oppositeCarImg.src = "assets/yellow.png";

  // Create opposite cars
  setInterval(() => {
    for (let i = 0; i < numOppositeCars; i++) {
      oppositeCars.push(new OppositeCar());
    }
  }, 2000);

  // Add the event listener here, outside of the update function
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        if (car.x > 150) {
          car.x -= 90;
        }
        break;
      case "ArrowRight":
        if (car.x < canvasWidth - car.width - 150) {
          car.x += 90;
        }
        break;
      case "ArrowUp":
        backgroundSpeed = 12;
        oppositeCarSpeed = 11;
        break;
    }
  });
  document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowUp") {
      backgroundSpeed = 5;
      oppositeCarSpeed = 6;
    }
  });

  setInterval(() => {
    time++;
  }, 1000);

  requestAnimationFrame(update);
};

const update = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Update background positions based on car speed
  backgroundPositionY1 += backgroundSpeed;
  backgroundPositionY2 += backgroundSpeed;

  // Display finish line after 10 background images
  if (!finishLine && bgImageCount >= 20) {
    finishLine = true;
  }

  // Reset background positions when they go beyond canvas height
  if (!finishLine) {
    if (backgroundPositionY1 >= canvasHeight) {
      backgroundPositionY1 = backgroundPositionY2 - canvasHeight;
      bgImageCount++;
    }
    if (backgroundPositionY2 >= canvasHeight) {
      backgroundPositionY2 = backgroundPositionY1 - canvasHeight;
    }
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background images with updated positions
  ctx.drawImage(
    backgroundImg1,
    0,
    backgroundPositionY1,
    canvasWidth,
    canvasHeight
  );
  ctx.drawImage(
    backgroundImg2,
    0,
    backgroundPositionY2,
    canvasWidth,
    canvasHeight
  );

  // Move and draw opposite cars
  for (let i = 0; i < oppositeCars.length; i++) {
    oppositeCars[i].y += oppositeCarSpeed;
    ctx.drawImage(
      oppositeCarImg,
      oppositeCars[i].x,
      oppositeCars[i].y,
      oppositeCarWidth,
      oppositeCarHeight
    );
  }

  // Move and draw the finish line image towards the main car
  if (finishLine) {
    finishLineObj.y += oppositeCarSpeed + backgroundSpeed; // Update the finish line position

    // Draw the finish line image
    ctx.drawImage(finishLineImg, finishLineObj.x, finishLineObj.y);

    // Detect collision with finish line
    if (
      car.x < finishLineObj.x + finishLineObj.width &&
      car.x + carWidth > finishLineObj.x &&
      car.y < finishLineObj.y + finishLineObj.height &&
      car.y + carHeight > finishLineObj.y
    ) {
      gameWon = true;
    }
  }

  // Draw the main car
  ctx.drawImage(carImg, car.x, car.y, car.width, car.height);

  // Call collision detection function
  collisionDetection();

  ctx.fillStyle = "white";
  ctx.font = "24px Verdana";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";

  ctx.fillText(`Time: ${time}`, canvasWidth - 250, canvasHeight - 650);

  ctx.fillStyle = "green";
  ctx.fillText(
    `Arrow up to active booster`,
    canvasWidth - 150,
    canvasHeight - 600
  );

  // If game over or game won, stop the update loop
  if (gameOver || gameWon) {
    ctx.drawImage(gameOverImg, 150, canvasHeight / 2.5, 330, 70);
    ctx.fillStyle = "red";
    ctx.fillText(
      gameWon
        ? `You have won race in ${time} seconds`
        : `You have driven for ${time} seconds`,
      canvasWidth - 110,
      canvasHeight / 1.8
    );
    ctx.fillStyle = "green";
    ctx.fillText(
      "Enter to Restart the game",
      canvasWidth - 140,
      canvasHeight / 1.65
    );

    return;
  }

  // Continue the update loop
  requestAnimationFrame(update);
};

// collision detection function
const collisionDetection = () => {
  for (let i = 0; i < oppositeCars.length; i++) {
    if (
      car.x < oppositeCars[i].x + oppositeCarWidth &&
      car.x + carWidth > oppositeCars[i].x &&
      car.y < oppositeCars[i].y + oppositeCarHeight &&
      car.y + carHeight > oppositeCars[i].y
    ) {
      gameOver = true;
    }
  }
};

//Restart the game
document.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    location.reload();
  }
});

// calling start when the window load up
window.onload = start;
