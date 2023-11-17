import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'path';
import {
  mainWindow,
  mainVariables,
  subWindow,
  menuWindow,
  etcWindow,
} from '../windows';

import moving from '../character/moving';
import moveScheduling from '../character/moveScheduling';
import { resolveHtmlPath, sleep } from '../util';

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');

const windowsHandler = () => {
  readyToRenderHandler();
  subHandler();
  stopMovingHandler();
  restartMovingHandler();
  hideSubWindowHandler();
  hideMenuWindowHandler();
  windowOpenedHandler();
  windowClosedHandler();
  showYouTubeMusicWindow();
  showReportHandler();
};

/**
 *
 */
const readyToRenderHandler = () => {
  ipcMain.on('ready-to-render', () => {
    subWindow.webContents.send('sub', 'closed');
    menuWindow.webContents.send('sub', 'menu');
  });
};

/**
 * 'sub' : sub윈도우의 다른 창을 띄우기 위해 navigate가 필요할 때
 */
const subHandler = () => {
  ipcMain.on('sub', (_event, path: string) => {
    subWindow.webContents.send('sub', path);
    subWindow.show();
  });
};

/**
 * 'showYouTubeMusicWindow : 유튜브 뮤직윈도우 보이기
 */
const showYouTubeMusicWindow = () => {
  ipcMain.on('showYouTubeMusicWindow', (_event, playlistUrl) => {
    etcWindow.webContents.send('sub', 'youtubeMusic');
    etcWindow.webContents.send('url', playlistUrl);
    etcWindow.moveTop();
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

let reportWindow: BrowserWindow | null = null;

/**
 * 'show-report' : 레포트 보여주기
 */
const showReportHandler = () => {
  ipcMain.on('show-report', async () => {
    if (reportWindow !== null) {
      // 이미 켜져 있으면
      reportWindow.maximize();
      reportWindow.moveTop();
      reportWindow.focus();
      return;
    }
    reportWindow = new BrowserWindow({
      x: 0,
      y: 0,
      title: '리포트',
      width: mainVariables.primaryDisplay.bounds.width,
      height: mainVariables.primaryDisplay.bounds.height,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../../.erb/dll/preload.js'),
        nodeIntegration: true,
        sandbox: false,
      },
      icon: path.join(RESOURCES_PATH, 'icon.png'),
    });
    reportWindow.setMenu(null);

    await reportWindow?.loadURL(resolveHtmlPath('index.html'));
    reportWindow.webContents.closeDevTools();
    reportWindow?.webContents.send('sub', 'report');

    reportWindow.on('closed', () => {
      reportWindow = null;
    });
  });
};

export default windowsHandler;
