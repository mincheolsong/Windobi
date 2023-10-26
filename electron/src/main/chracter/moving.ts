import { Rectangle } from 'electron';
import Character from './Character';

function move(character: Character) {
  const diff = 2; // 움직이는 정도
  const bound: Rectangle = character.mainWindow.getBounds();
  const curX: number = bound.x;
  const curY: number = bound.y;
  let nextX: number = 0;
  let nextY: number = 0;

  if (character.direction === 'left') {
    // console.log("before:: curX: ", curX, " curY: ", curY, "diff: ", diff);
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
    if (nextY > 0){
      character.direction = 'stop';
      nextX = curX;
      nextY = curY;
    }
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
