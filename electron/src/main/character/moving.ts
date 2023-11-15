import { mainVariables, mainWindow } from '../windows';

const { character } = mainVariables;

const DIFF = 2; // 움직이는 정도

function move() {
  const { x: curX, y: curY } = mainWindow.getBounds();
  let nextX: number = 0;
  let nextY: number = 0;
  const { maxHeight, winHeight } = character;

  const bottom = 120;
  // if (
  //   curY < maxHeight - winHeight &&
  //   curY > maxHeight - winHeight - 10 &&
  //   character.fallTrigger
  // ) {
  //   // character.direction = 'downsleep';
  // }

  if (
    character.direction !== 'downsleep' &&
    curY < character.maxHeight - character.winHeight &&
    !character.fallTrigger
  ) {
    character.fallTrigger = true;
    character.direction = 'down';
  }
  if (character.direction === 'left') {
    nextX = curX - DIFF;
    nextY = curY;

    character.position = { nextX, nextY };
    if (nextX < 0) {
      character.direction = 'stop';
      character.position = { nextX, nextY };
    }
  }

  if (character.direction === 'right') {
    nextX = curX + DIFF;
    nextY = curY;
    if (nextX > character.maxWidth - character.winWidth) {
      character.direction = 'stop';
      nextX = curX;
      nextY = curY;
    }
    character.position = { nextX, nextY };
  }

  if (character.direction === 'stop') {
    nextX = curX;
    nextY = curY;
  }

  if (character.direction === 'rest') {
    nextX = curX;
    nextY = curY - DIFF;
    if (nextY > 0) {
      character.direction = 'stop';
      nextX = curX;
      nextY = curY;
    }
  }
  if (character.direction === 'down') {
    if (curY > character.maxHeight - bottom) {
      character.fallTrigger = false;
      nextY = character.maxHeight - bottom;
      nextX = curX;
      character.direction = 'downsleep';
      character.position = { nextX, nextY };
    } else {
      nextY = curY + 5;
      nextX = curX;
      character.position = { nextX, nextY };
    }
  }
  if (character.direction === 'downsleep') {
    if (curY > character.maxHeight - bottom) {
      character.fallTrigger = false;
      nextY = character.maxHeight - bottom;
      nextX = curX;
      character.direction = 'stop';
      character.position = { nextX, nextY };
    } else {
      nextY = curY + 5;
      nextX = curX;
    }
    character.position = { nextX, nextY };
  }

  character.transition = false;
}

function moving() {
  // 좌우 이동
  if (character.transition === true) {
    setTimeout(() => {
      move();
    }, 200);
  } else {
    move();
  }
}
export default moving;
