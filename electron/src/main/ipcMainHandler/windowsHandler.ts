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
import { sleep } from '../util';

const windowsHandler = () => {
  subHandler();
  stopMovingHandler();
  restartMovingHandler();
  hideSubWindowHandler();
  hideMenuWindowHandler();
  windowOpenedHandler();
  windowClosedHandler();
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

    if (character.isMove === false) return;

    if (characterMoveId !== null) clearInterval(characterMoveId);
    if (scheduleId !== null) clearInterval(scheduleId);
    mainVariables.characterMoveId = setInterval(moving, 30, character);
    mainVariables.scheduleId = setInterval(moveScheduling, 2000);
    mainWindow.webContents.send('character-move', character.direction);
    mainWindow.focus();
    character.fallTrigger = false;
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

/**
 * 'windowOpened' : 윈도우 열려 있을 경우
 */
const windowOpenedHandler = () => {
  ipcMain.on('windowOpened', () => {
    mainVariables.character.isMove = false;
  });
};

/**
 * 'windowClosed' : 윈도우 열려 있을 경우
 */
const windowClosedHandler = () => {
  ipcMain.on('windowClosed', () => {
    mainVariables.character.isMove = true;
  });
};

export default windowsHandler;
