/* eslint-disable no-use-before-define */
import { ipcMain } from 'electron';
import {
  mainWindow,
  mainVariables,
  subWindow,
  menuWindow,
  menuVariables,
} from '../windows';

import moving from '../chracter/moving';
import moveScheduling from '../chracter/moveScheduling';

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const windowsHandler = () => {
  subHandler();
  windowMovingHandler();
  stopMovingHandler();
  restartMovingHandler();
  hideSubWindowHandler();
  hideMenuWindowHandler();
  // sizeUpMenuWindowHandler();
};

/**
 * 'sub' : sub윈도우의 다른 창을 띄우기 위해 navigate가 필요할 때
 */
const subHandler = () => {
  ipcMain.on('sub', (_event, path) => {
    subWindow.webContents.send('sub', path);
    subWindow.show();
  });
};

/**
 * 'windowMoving' : 윈도우 move 이벤트 일때
 */
const windowMovingHandler = () => {
  ipcMain.on('windowMoving', (_event, arg) => {
    mainWindow.setBounds({
      width: mainVariables.width,
      height: mainVariables.height,
      x: arg.mouseX - 50, // always changes in runtime
      y: arg.mouseY - 50,
    });
  });
};

/**
 * 'stopMoving' : 캐릭터를 드래고 하고 있는 동안 걸어다니는 동작 일시 정지
 */
const stopMovingHandler = () => {
  ipcMain.on('stopMoving', () => {
    const { characterMoveId, scheduleId } = mainVariables;
    if (characterMoveId !== null) clearInterval(characterMoveId);
    if (scheduleId !== null) clearInterval(scheduleId);
    mainVariables.characterMoveId = null;
    mainVariables.scheduleId = null;
  });
};

/**
 * 'restartMoving' : 캐릭터 재이동
 */
const restartMovingHandler = () => {
  ipcMain.on('restartMoving', () => {
    const { characterMoveId, scheduleId, character } = mainVariables;
    if (characterMoveId === null && scheduleId === null) {
      mainWindow.focus();
      character.fallTrigger = false;
      mainVariables.characterMoveId = setInterval(moving, 30, character);
      mainVariables.scheduleId = setInterval(moveScheduling, 2000);

      mainWindow.webContents.send('character-move', character.direction);
    }
  });
};

/**
 * 'hideSubWindow : 서브윈도우 숨기기
 */
const hideSubWindowHandler = () => {
  ipcMain.on('hideSubWindow', () => {
    subWindow.hide();
  });
};

/**
 * 'hideMenuWindow' : 메뉴윈도우 숨기기
 */
const hideMenuWindowHandler = () => {
  ipcMain.on('hideMenuWindow', async () => {
    await sleep(500);
    menuWindow.hide();
  });
};

export default windowsHandler;
