/* eslint-disable prefer-const */
/* eslint-disable default-case */
import Character from './Character';

const max = 3;
// const behavior = ['left', 'right', 'stop', 'up', 'down']; // 현재 2까지 사용

function moveScheduling(character: Character) {
  let flag = true;
  while (flag) {
    const rand = Math.floor(Math.random() * max);
    switch (rand) {
      case 0:
        if (character.curX > 0) {
          // 왼쪽 벽을 안넘어간 경우
          flag = false;
          if (character.direction !== 'left') character.transition = true;
          character.direction = 'left';
          character.mainWindow.webContents.send('character-move', 'left');
          // console.log("send left")
        }
        break;
      case 1:
        if (character.curX < character.maxWidth - character.winWidth) {
          // 오른쪽 벽을 안넘긴 경우
          flag = false;
          if (character.direction !== 'right') character.transition = true;
          character.direction = 'right';
          character.mainWindow.webContents.send('character-move', 'right');
          // console.log("send right")
        }
        break;
      case 2:
        flag = false;
        if (character.direction !== 'stop') character.transition = true;
        character.direction = 'stop';
        character.mainWindow.webContents.send('character-move', 'stop');
        // console.log("send stop")
        break;
    }
  }
}

export default moveScheduling;
