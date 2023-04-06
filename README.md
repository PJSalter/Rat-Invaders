# 🐀 Rat-Invaders 🐭

## 😸 Game controls:

- Use the `arrow keys` (`LEFT`, `RIGHT`) to move the 🐈 cat and dodge the cheese. 🧀
- (moving rigth to the far end of the board from the `left` and `right` side may cause the cat to get stuck) - Just to advise I still need to fix this bug.
- Use the `spacebar` to shoot balls of wool yarn 🧶 at the 🐀 rats before they hit you with cheese! 🧀

## About

##### The code defines constants and variables to store the state of the game, including the positions of the Cat and the Rats, whether the player is moving or shooting the cotton wall, and various cooldown times.

##### There are also functions to create and update the player's Cat, the Rats, and the Cotton wall that the player throws.

##### The player's Cat and the Rat's are represented by images. The player's Cat can be moved left or right using the arrow keys, and can shoot a cotton wall using the space key.

##### The Rat's move around randomly and shoot cheese at the player's Cat. The player's goal is to destroy all of the Rat's before they destroy the player's Cat.

##### The game has a collision detection system that checks if the player's Cotton Wall or the Rat's cheese has hit the player's Cat or one of the Rat's.

## Getting started:

- Install `node >= 16.20.0`
- Install `nvm` (https://github.com/nvm-sh/nvm#installing-and-updating) to easily switch between your node versions.
- Install `yarn` (https://classic.yarnpkg.com/en/docs/install) v1.22.19

## Development:

- Run `yarn` to install dependencies
- Run `yarn` start for webpack to compile successfully
- In the scr folder, locate the `index.html` file and open with live server to play the game in your browser
