class Ball {
  constructor(x, y, w, e, text) {
    this.id = e.length;
    this.w = w * 3;
    this.e = e;

    this.progressiveWidth = 0;
    this.rgb = [
      floor(random(0, 256)),
      floor(random(0, 256)),
      floor(random(0, 256))
    ];
    this.mass = w;
    this.position = createVector(x + random(-1, 1), y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);

    this.gravity = 0.2;
    this.friction = 0.2;
    this.text = text;
  }

  collide() {
    for (let i = this.id + 1; i < this.e.length; i++) {
      let dx = this.e[i].position.x - this.position.x;
      let dy = this.e[i].position.y - this.position.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.e[i].w / 2 + this.w / 2;

      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let targetX = this.position.x + cos(angle) * minDist;
        let targetY = this.position.y + sin(angle) * minDist;

        this.acceleration.set(
          targetX - this.e[i].position.x,
          targetY - this.e[i].position.y
        );
        this.velocity.sub(this.acceleration);
        this.e[i].velocity.add(this.acceleration);

        // TODO : Effets bizarre quand on empile les boules (chevauchement)

        this.velocity.mult(this.friction);
      }
    }
  }

  move() {
    this.velocity.add(createVector(0, this.gravity));
    this.position.add(this.velocity);
  }

display(displayMass) {
  if (this.progressiveWidth < this.w) {
    this.progressiveWidth += this.w / 10;
  }

  stroke(1);
  strokeWeight(2);
  fill(0, 0, 0, 255);
  ellipse(this.position.x, this.position.y, this.progressiveWidth);

  if (displayMass) {
    strokeWeight(1);
    let tempTW = textWidth(int(this.w));
    text(int(this.w), this.position.x - tempTW / 2, this.position.y + 4);
  }

  let maxTextWidth = this.progressiveWidth - 10;
  let maxTextHeight = this.progressiveWidth - 10;
  let lines = this.getWrappedLines(maxTextWidth, maxTextHeight);

  textSize(12);
  textAlign(CENTER, CENTER);
  fill(255);
  noStroke();

  let lineHeight = 15;
  let y = this.position.y - (lines.length * lineHeight) / 2;

  for (let i = 0; i < lines.length; i++) {
    text(lines[i], this.position.x, y);
    y += lineHeight;
  }
}

getWrappedLines(maxWidth, maxHeight) {
  let words = this.text.split(' ');
  let wrappedLines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    let testLine = currentLine + words[i] + ' ';
    let testWidth = textWidth(testLine);

    if (testWidth > maxWidth) {
      wrappedLines.push(currentLine.trim());
      currentLine = words[i] + ' ';
    } else {
      currentLine = testLine;
    }

    if (wrappedLines.length * 15 > maxHeight) {
      break;
    }
  }

  wrappedLines.push(currentLine.trim());
  return wrappedLines;
}


  checkCollisions() {
    if (this.position.x > width - this.w / 2) {
      this.velocity.x *= -this.friction;
      this.position.x = width - this.w / 2;
    } else if (this.position.x < this.w / 2) {
      this.velocity.x *= -this.friction;
      this.position.x = this.w / 2;
    }

    if (this.position.y > Y_GROUND - this.w / 2) {
      this.velocity.x -= this.velocity.x / 100;
      this.velocity.y *= -this.friction;
      this.position.y = Y_GROUND - this.w / 2;
    } else if (this.position.y < this.w / 2) {
      this.velocity.y *= -this.friction;
      this.position.y = this.w / 2;
    }
  }
}



