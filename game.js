//these are const variable names of the numbers that are associated to the keys on the key board
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_RIGHT = 39;
const KEY_LEFT = 37;
const KEY_SPACE = 32;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const gameState = {
  x_pos: 0,
  y_pos: 0,
  move_right: false,
  move_left: false,
  shoot: false,
  lasers: [],
  cheeseLasersZap: [],
  enemies: [],
  spaceship_width: 50,
  enemy_width: 50,
  cooldown: 0,
  number_of_ratPackEnemies: 16,
  enemy_cooldown: 0,
  gameOver: false,
};

// General purpose functions
function setPosition(el, x, y) {
  el.style.transform = `translate(${x}px, ${y}px)`;
}

function setSize(el, width) {
  el.style.width = `${width}px`;
  el.style.height = "auto";
}

function bound(x) {
  if (x >= GAME_WIDTH - gameState.spaceship_width) {
    gameState.x_pos = GAME_WIDTH - gameState.spaceship_width;
    return GAME_WIDTH - gameState.spaceship_width;
  }
  if (x <= 0) {
    gameState.x_pos = 0;
    return 0;
  } else {
    return x;
  }
}

function collideRect(rect1, rect2) {
  return !(
    rect2.left > rect1.right ||
    rect2.right < rect1.left ||
    rect2.top > rect1.bottom ||
    rect2.bottom < rect1.top
  );
}

//  Rat Enemy
function createEnemy(ratAttackBoardContainer, x, y) {
  const nemesisRat = document.createElement("img");
  nemesisRat.src = "rat.png";
  nemesisRat.className = "enemy";
  ratAttackBoardContainer.appendChild(nemesisRat);
  const enemy_cooldown = Math.floor(Math.random() * 100);
  const enemy = { x, y, nemesisRat, enemy_cooldown };
  gameState.enemies.push(enemy);
  setSize(nemesisRat, gameState.enemy_width);
  setPosition(nemesisRat, x, y);
}

function updateRatEnemies(ratAttackBoardContainer) {
  const dx = Math.sin(Date.now() / 1000) * 40;
  const dy = Math.cos(Date.now() / 1000) * 30;
  const enemies = gameState.enemies;
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    let a = enemy.x + dx;
    let b = enemy.y + dy;
    setPosition(enemy.nemesisRat, a, b);
    enemy.cooldown = Math.random(0, 100);
    if (enemy.enemy_cooldown == 0) {
      createCheeseWeapon(ratAttackBoardContainer, a, b);
      enemy.enemy_cooldown = Math.floor(Math.random() * 50) + 100;
    }
    enemy.enemy_cooldown -= 0.5;
  }
}

// Kitty Cat Player
function createKittyCatPlayer(ratAttackBoardContainer) {
  gameState.x_pos = GAME_WIDTH / 2;
  gameState.y_pos = GAME_HEIGHT - 50;
  const kittyCatPlayer = document.createElement("img");
  kittyCatPlayer.src = "cat.png";
  kittyCatPlayer.className = "player";
  ratAttackBoardContainer.appendChild(kittyCatPlayer);
  setPosition(kittyCatPlayer, gameState.x_pos, gameState.y_pos);
  setSize(kittyCatPlayer, gameState.spaceship_width);
}

function updateKittyCat() {
  if (gameState.move_left) {
    gameState.x_pos -= 3;
  }
  if (gameState.move_right) {
    gameState.x_pos += 3;
  }
  if (gameState.shoot && gameState.cooldown == 0) {
    createBallOfYarn(
      ratAttackBoardContainer,
      gameState.x_pos - gameState.spaceship_width / 2,
      gameState.y_pos
    );
    gameState.cooldown = 30;
  }
  const kittyCatPlayer = document.querySelector(".player");
  setPosition(kittyCatPlayer, bound(gameState.x_pos), gameState.y_pos - 10);
  if (gameState.cooldown > 0) {
    gameState.cooldown -= 0.5;
  }
}

// cat ball of yarn throw
function createBallOfYarn(ratAttackBoardContainer, x, y) {
  const ballOfYarn = document.createElement("img");
  ballOfYarn.src = "ball.png";
  ballOfYarn.className = "ballOfYarn";
  ratAttackBoardContainer.appendChild(ballOfYarn);
  const laser = { x, y, ballOfYarn };
  gameState.lasers.push(laser);
  setPosition(ballOfYarn, x, y);
}

function updateLaser(ratAttackBoardContainer) {
  const lasers = gameState.lasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.y -= 2;
    if (laser.y < 0) {
      deleteLaser(lasers, laser, laser.ballOfYarn);
    }
    setPosition(laser.ballOfYarn, laser.x, laser.y);
    const laser_rectangle = laser.ballOfYarn.getBoundingClientRect();
    const enemies = gameState.enemies;
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
      const enemy_rectangle = enemy.nemesisRat.getBoundingClientRect();
      if (collideRect(enemy_rectangle, laser_rectangle)) {
        deleteLaser(lasers, laser, laser.ballOfYarn);
        const index = enemies.indexOf(enemy);
        enemies.splice(index, 1);
        ratAttackBoardContainer.removeChild(enemy.nemesisRat);
      }
    }
  }
}

// rat cheese slice throw
function createCheeseWeapon(ratAttackBoardContainer, x, y) {
  const ratCheeseThrow = document.createElement("img");
  ratCheeseThrow.src = "cheese.png";
  ratCheeseThrow.className = "cheeseShot";
  ratAttackBoardContainer.appendChild(ratCheeseThrow);
  const cheeseShot = { x, y, ratCheeseThrow };
  gameState.cheeseLasersZap.push(cheeseShot);
  setPosition(ratCheeseThrow, x, y);
}

function updateEnemyCheeseZap(ratAttackBoardContainer) {
  const cheeseLasersZap = gameState.cheeseLasersZap;
  for (let i = 0; i < cheeseLasersZap.length; i++) {
    const cheeseShot = cheeseLasersZap[i];
    cheeseShot.y += 2;
    if (cheeseShot.y > GAME_HEIGHT - 30) {
      deleteLaser(cheeseLasersZap, cheeseShot, cheeseShot.ratCheeseThrow);
    }
    const cheeseShot_rectangle =
      cheeseShot.ratCheeseThrow.getBoundingClientRect();
    const spaceship_rectangle = document
      .querySelector(".player")
      .getBoundingClientRect();
    if (collideRect(spaceship_rectangle, cheeseShot_rectangle)) {
      gameState.gameOver = true;
    }
    setPosition(
      cheeseShot.ratCheeseThrow,
      cheeseShot.x + gameState.enemy_width / 2,
      cheeseShot.y + 15
    );
  }
}

// Delete Laser
function deleteLaser(lasers, laser, ballOfYarn) {
  const index = lasers.indexOf(laser);
  lasers.splice(index, 1);
  ratAttackBoardContainer.removeChild(ballOfYarn);
}

// Key Presses
function KeyPress(event) {
  if (event.keyCode === KEY_RIGHT) {
    gameState.move_right = true;
  } else if (event.keyCode === KEY_LEFT) {
    gameState.move_left = true;
  } else if (event.keyCode === KEY_SPACE) {
    gameState.shoot = true;
  }
}

function KeyRelease(event) {
  if (event.keyCode === KEY_RIGHT) {
    gameState.move_right = false;
  } else if (event.keyCode === KEY_LEFT) {
    gameState.move_left = false;
  } else if (event.keyCode === KEY_SPACE) {
    gameState.shoot = false;
  }
}

// Main Update Function
function update() {
  updateKittyCat();
  updateRatEnemies(ratAttackBoardContainer);
  updateLaser(ratAttackBoardContainer);
  updateEnemyCheeseZap(ratAttackBoardContainer);

  window.requestAnimationFrame(update);

  if (gameState.gameOver) {
    document.querySelector(".lose").style.display = "block";
  }
  if (gameState.enemies.length == 0) {
    document.querySelector(".win").style.display = "block";
  }
}

function createRatPackEnemies(ratAttackBoardContainer) {
  for (var i = 0; i <= gameState.number_of_ratPackEnemies / 2; i++) {
    createEnemy(ratAttackBoardContainer, i * 80, 100);
  }
  for (var i = 0; i <= gameState.number_of_ratPackEnemies / 2; i++) {
    createEnemy(ratAttackBoardContainer, i * 80, 180);
  }
}

// Initialize the Game
const ratAttackBoardContainer = document.querySelector(".main");
createKittyCatPlayer(ratAttackBoardContainer);
createRatPackEnemies(ratAttackBoardContainer);

// Key Press Event Listener
window.addEventListener("keydown", KeyPress);
window.addEventListener("keyup", KeyRelease);
update();
