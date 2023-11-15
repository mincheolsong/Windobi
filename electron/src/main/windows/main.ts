/* eslint-disable import/no-cycle */
import { BrowserWindow, Display, app, screen, shell, ipcMain } from 'electron';
import path from 'path';
import { resolveHtmlPath } from '../util';
import Character from '../character/Character';

const primaryDisplay = screen.getPrimaryDisplay();
const height = 130;
const width = 130;

// #region 유틸리티 정의
const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};
// #endregion

// #region 윈도우 설정 정의

const mainWindow = new BrowserWindow({
  width,
  height,
  icon: getAssetPath('naver.png'),
  webPreferences: {
    preload: app.isPackaged
      ? path.join(__dirname, 'preload.js')
      : path.join(__dirname, '../../../.erb/dll/preload.js'),
    nodeIntegration: true,
    sandbox: false,
  },
  resizable: false,
  show: true,
  frame: false,
  transparent: true,
  alwaysOnTop: true,
  skipTaskbar: true,
  acceptFirstMouse: true,
  x: 0,
  y: 0,
});

// 렌더링 할 페이지 정의
mainWindow.loadURL(resolveHtmlPath('index.html'));

// #endregion

// #region 추가적인 값 정의
type Cursor = {
  x: number;
  y: number;
};

type TVariables = {
  character: Character;
  scheduleId: IntervalId;
  characterMoveId: IntervalId;
  mailListners: Array<IntervalId>;
  primaryDisplay: Display;
  width: number;
  height: number;
  cursor: Cursor;
  active: boolean; // true일 경우 현재 사용자가 사용하고 있는상태, false일 경우 사용자의 움직임이 없는 상태
};
const variables: TVariables = {
  character: new Character(
    primaryDisplay.workAreaSize.width,
    primaryDisplay.workAreaSize.height,
    width,
    height,
  ),
  scheduleId: null,
  characterMoveId: null,
  mailListners: [],
  primaryDisplay: screen.getPrimaryDisplay(),
  width,
  height,
  cursor: {
    x: 0,
    y: 0,
  },
  active: true,
};
// #endregion

// #region 이벤트 정의
mainWindow.once('ready-to-show', () => {
  if (!mainWindow) throw new Error('Main Window is not defined');

  if (process.env.START_MINIMIZED) mainWindow.minimize();
  else mainWindow.show();
  mainWindow.webContents.closeDevTools();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
});

// 마우스가 움직일 때 활동중이라고 하자
const NOT_ACTIVE_THRESHOLD = 10;
let notActiveCount = 0;
let detectActiveId: IntervalId = null;

// 마우스가 이전과 비교해서 움직였는지 안움직였는지 체크
const detectDisactive = () => {
  detectActiveId = setInterval(() => {
    const { x, y } = screen.getCursorScreenPoint();
    const { x: prevX, y: prevY } = variables.cursor;

    if (prevX === x && prevY === y) {
      // 만약 이전으로부터 변화가 없으면
      notActiveCount++;
      if (notActiveCount === NOT_ACTIVE_THRESHOLD) {
        clearInterval(detectActiveId!);
        detectActive(); // 움직이는 상태로 바뀌는지 체크하자
        ipcMain.emit('stopMoving');
        setTimeout(() => {
          variables.active = false;
          variables.character.direction = 'rest';
        }, 1000);
      }
    } else {
      notActiveCount = 0;
    }
    variables.cursor.x = x;
    variables.cursor.y = y;
  }, 1000);
};

// 현재 disactive상태인데 움직였는지 체크하자
const detectActive = () => {
  detectActiveId = setInterval(() => {
    const { x, y } = screen.getCursorScreenPoint();
    const { x: prevX, y: prevY } = variables.cursor;

    if (prevX !== x && prevY !== y) {
      // 변화가 생겼으면
      notActiveCount = 0;
      clearInterval(detectActiveId!);
      detectDisactive();
      ipcMain.emit('restartMoving');
      setTimeout(() => {
        variables.active = true;
        variables.character.direction = 'stop';
      }, 1000);
    }
  }, 2000);
};

detectDisactive();

mainWindow.on('closed', () => {
  if (detectActiveId !== null) clearInterval(detectActiveId);
  app.quit();
});

// #endregion

export default mainWindow;

export { variables };
