let isFlushing = false;
let isBallDiameterRandom = false;
let displayInfos = true;
let displayWeight = false;
let clickOnce = false;

let FRAME_RATE = 60;
let SPEED_FLUSH = 3;
let Y_GROUND;
let lastFR;

let balls = [];

function setup() {
  var Canvas =   createCanvas(windowWidth, 600);
  Canvas.parent('sketch-holder');
  frameRate(FRAME_RATE);
  document.oncontextmenu = function () {
    return false;
  };

  Y_GROUND = height / 10 * 9;
  lastFR = FRAME_RATE;
}

function draw() {
  background(255,0);

  if (isFlushing) {
    for (let i = 0; i < SPEED_FLUSH; i++) {
      balls.pop();
    }

    if (balls.length === 0) {
      isFlushing = false;
    }
  }

  balls.forEach(ball => {
    ball.collide();
    ball.move();
    ball.display(displayWeight);
    ball.checkCollisions();
  });

  if (mouseIsPressed && balls.length < 8) {
    let ballDiameter;

    if (isBallDiameterRandom) {
    } else {
      ballDiameter = 60;
    }

    if (canAddBall(mouseX, mouseY, ballDiameter)) {
      isFlushing = false;

      let descriptions = [
        "difficulty concentrating",
        "sleeping too much",
        "low energy and feeling sluggish",
        "Feeling hopeless, worthless or guilty",
        "Feeling listless, sad or down most of the day, nearly every day",
        "Having thoughts of not wanting to live",
        "Experiencing carbohydrate cravings, overeating and weight gain",
        "Losing interest in activities you once enjoyed"
      ];

      let randomDescription = random(descriptions);
      let newBall = new Ball(mouseX, mouseY, ballDiameter, balls, randomDescription);

      if (mouseButton === LEFT && !clickOnce) {
        balls.push(newBall);
        clickOnce = true;
      }

      if (mouseButton === RIGHT) {
        balls.push(newBall);
      }
    }
  }

  drawGround();

  if (displayInfos) {
    displayShortcuts();
    displayFrameRate();
    displayBallCount();
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    clickOnce = false;
  }
}

function keyPressed() {
  if (keyCode === 32) { // SPACE
    displayInfos = !displayInfos;
  }
}

function canAddBall(x, y, d) {
  let isInScreen =
    y + d / 2 < Y_GROUND &&
    y - d / 2 > 0 &&
    x + d / 2 < width &&
    x - d / 2 > 0;

  let isInAnotherBall = false;

  for (let i = 0; i < balls.length; i++) {
    let d = dist(x, y, balls[i].position.x, balls[i].position.y);

    if (d < balls[i].w) {
      isInAnotherBall = true;
      break;
    }
  }

  return isInScreen && !isInAnotherBall;
}

function drawGround() {
  strokeWeight(0);
  fill(0, 0, 0, 0); // Set fill color to transparent
  rect(0, height / 0 * 0, width, height / 0);
}

function displayFrameRate() {
  if (frameCount % 30 === 0) {
    lastFR = round(frameRate());
  }

  let lastFRWidth = textWidth(lastFR);
  text(lastFR, width - lastFRWidth - 25, 50);
  textSize(10);
  text('fps', width - 20, 50);
}

function displayBallCount() {
  textSize(50);
  fill(255);
  let count = 8 - balls.length; // Calculate the count by subtracting the number of balls from 8
  let marginX = 230; // Define the left margin
  let marginY = 260; // Define the top margin

  // Add black background
  fill(0);
  rect(marginX, marginY, 80, 80);
  // Display the count
  fill(255);
  text(count, marginX + 40, marginY + 65);
  let twBalls = textWidth(count);
  text('', marginX + 45 + twBalls, marginY + 65);
}



function displayShortcuts() {
  let hStart = 80;
  let steps = 15;
  let maxTW = 0;
  let controlTexts = [
    '',
    '',
    '',
    '',
    
  ];

  textSize(28);
  fill(0);

  for (let i = 0; i < controlTexts.length; i++) {
    let currentTW = textWidth(controlTexts[i]);

    if (currentTW > maxTW) {
      maxTW = currentTW;
    }
  }

  for (let i = 0; i < controlTexts.length; i++) {
    text(controlTexts[i], width / 5 - maxTW / 5 + 5, hStart);
    hStart += steps;
  }

  fill(0, 0, 0, 0); // Set fill color to transparent
  rect(
    width / 5 - maxTW / 5,
    hStart - (controlTexts.length + 1) * steps,
    maxTW + steps,
    (controlTexts.length + 1) * steps - steps / 2
  );
}
















// // Splitting into span tags
// let splitTarget = document.querySelectorAll('.js-splitText'); // Get all target elements
// splitTarget.forEach((target) => {
//   // target = target element

//   if (!target.classList.contains('is-active')) {
//     // If the target doesn't have the class 'is-active'
//     newText = ''; // Variable to store the generated elements
//     spanText = target.innerHTML; // Get the content of the target
//     spanText.split('').forEach((char) => {
//       // char = character
//       newText += '<span>' + char + '</span>'; // Wrap each character with a span tag
//     });
//     newTextBefore = '<div class="before">' + newText + '</div>'; // Generate an element with the 'before' class
//     newTextAfter = '<div class="after">' + newText + '</div>'; // Generate an element with the 'after' class
//     newText = '<span class="text-wrap">' + newTextBefore + newTextAfter + '</span>'; // Generate an element wrapping both before and after elements
//     target.innerHTML = newText; // Insert the generated elements into the target
//   }
// })
// console.log('start');

// // Hover effect on the target
// splitTarget.forEach((target) => {
//   if (!target.classList.contains('is-active')) {
//     // If the target doesn't have the class 'is-active'
//     let beforeSpan = target.querySelector('.before').querySelectorAll('span');
//     // Get all span tags within the 'before' element
//     let afterSpan = target.querySelector('.after').querySelectorAll('span');
//     console.log('contin');
//     // Get all span tags within the 'after' element
//     target.addEventListener('mouseenter', () => {
//       // When hovered
//       gsap.to(beforeSpan, { y: '-100%', stagger: 0.03, ease: 'power2.out' });
//       // Move each span tag along the y-axis with a stagger of 0.03 seconds
//       gsap.to(afterSpan, { y: '0%', stagger: 0.03, ease: 'power2.out' });
//     });

//     target.addEventListener('mouseleave', () => {
//       // When the hover is removed
//       gsap.to(beforeSpan, { y: '0%', stagger: 0.03, ease: 'power2.out' });
//       // Move each span tag along the y-axis with a stagger of 0.03 seconds
//       gsap.to(afterSpan, { y: '100%', stagger: 0.03, ease: 'power2.out' });
//     });
//   }
// });






// const elts = {
//   text1: document.getElementById("text1"),
//   text2: document.getElementById("text2")
// };

// const texts = [
//   "click anywhere",
//   "to see symptoms",
// ];

// const morphTime = 1;
// const cooldownTime = 0.25;

// let textIndex = texts.length - 1;
// let time = new Date();
// let morph = 0;
// let cooldown = cooldownTime;

// elts.text1.textContent = texts[textIndex % texts.length];
// elts.text2.textContent = texts[(textIndex + 1) % texts.length];

// function doMorph() {
//   morph -= cooldown;
//   cooldown = 0;

//   let fraction = morph / morphTime;

//   if (fraction > 1) {
//       cooldown = cooldownTime;
//       fraction = 1;
//   }

//   setMorph(fraction);
// }

// function setMorph(fraction) {
//   elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
//   elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

//   fraction = 1 - fraction;
//   elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
//   elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

//   elts.text1.textContent = texts[textIndex % texts.length];
//   elts.text2.textContent = texts[(textIndex + 1) % texts.length];
// }

// function doCooldown() {
//   morph = 0;

//   elts.text2.style.filter = "";
//   elts.text2.style.opacity = "100%";

//   elts.text1.style.filter = "";
//   elts.text1.style.opacity = "0%";
// }

// function animate() {
//   requestAnimationFrame(animate);

//   let newTime = new Date();
//   let shouldIncrementIndex = cooldown > 0;
//   let dt = (newTime - time) / 1000;
//   time = newTime;

//   cooldown -= dt;

//   if (cooldown <= 0) {
//       if (shouldIncrementIndex) {
//           textIndex++;
//       }

//       doMorph();
//   } else {
//       doCooldown();
//   }
// }

// animate();


