import { Rectangle } from 'electron';
import Character from './Character';

let prevDirection = '';

function move(character: Character) {
  const diff = 2; // 움직이는 정도
  const bound: Rectangle = character.mainWindow.getBounds();
  const curX: number = bound.x;
  const curY: number = bound.y;
  let nextX: number = 0;
  let nextY: number = 0;

  // 좌우 이동

  if (
    curY < character.maxHeight - character.winHeight &&
    curY > character.maxHeight - character.winHeight - 20 &&
    character.fallTrigger
  ) {
    character.direction = 'downsleep';
  }

  if (
    character.direction !== 'downsleep' &&
    curY < character.maxHeight - character.winHeight &&
    !character.fallTrigger
  ) {
    character.fallTrigger = true;
    character.direction = 'down';
    // character.mainWindow.webContents.send('character-move', 'down');
  }
  if (character.direction === 'left') {
    nextX = curX - diff;
    nextY = curY;
    if (nextX < 0) {
      character.direction = 'stop';
      nextX = curX;
      nextY = curY;
    }
  }

  if (character.direction === 'right') {
    nextX = curX + diff;
    nextY = curY;
    if (nextX > character.maxWidth - character.winWidth) {
      character.direction = 'stop';
      nextX = curX;
      nextY = curY;
    }
  }

  if (character.direction === 'stop') {
    nextX = curX;
    nextY = curY;
  }

  if (character.direction === 'up') {
    nextX = curX;
    nextY = curY - diff;
    if (nextY > 0) {
      character.direction = 'stop';
      nextX = curX;
      nextY = curY;
    }
  }
  if (character.direction === 'down') {
    if (curY > character.maxHeight - 105) {
      character.fallTrigger = false;
      nextY = character.maxHeight - 105;
      nextX = curX;
      character.direction = 'downsleep';
      // character.mainWindow.webContents.send('character-move', 'downsleep');
    } else {
      nextY = curY + 5;
      nextX = curX;
    }
    character.curX = nextX;
    character.curY = nextY;
  }
  if (character.direction === 'downsleep') {
    if (curY > character.maxHeight - 105) {
      character.fallTrigger = false;
      nextY = character.maxHeight - 105;
      nextX = curX;
      // character.mainWindow.webContents.send('character-move', 'stop');
      character.direction = 'stop';
    } else {
      nextY = curY + 5;
      nextX = curX;
    }
    character.curX = nextX;
    character.curY = nextY;
  }
  character.mainWindow.setBounds({
    x: nextX,
    y: nextY,
    width: character.winWidth,
    height: character.winHeight,
  });

  character.curX = nextX;
  character.curY = nextY;
  character.transition = false;

  if (prevDirection !== character.direction) {
    character.mainWindow.webContents.send(
      'character-move',
      character.direction,
    );
    prevDirection = character.direction;
  }
}

function moving(character: Character) {
  // 좌우 이동

  if (character.transition === true) {
    setTimeout(() => {
      move(character);
    }, 200);
  } else {
    move(character);
  }
}
export default moving;
