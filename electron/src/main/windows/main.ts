/* eslint-disable import/no-cycle */
import { BrowserWindow, Display, app, screen, shell } from 'electron';
import path from 'path';
import { resolveHtmlPath } from '../util';
import Character from '../chracter/Character';

const primaryDisplay = screen.getPrimaryDisplay();
const height = 110;
const width = 100;

// #region 유틸리티 정의
const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};
// #endregion

// #region 윈도우 설정 정의
const mainWindow = new BrowserWindow({
  resizable: false,
  show: false,
  width,
  height,
  icon: getAssetPath('icon.png'),
  webPreferences: {
    preload: app.isPackaged
      ? path.join(__dirname, '../preload.js')
      : path.join(__dirname, '../../../.erb/dll/preload.js'),
    nodeIntegration: true,
    sandbox: false,
  },
  transparent: true,
  frame: false,
  alwaysOnTop: true,
  skipTaskbar: true,
  x: 0,
  y: 0,
});

// 렌더링 할 페이지 정의
mainWindow.loadURL(resolveHtmlPath('index.html'));

// #endregion

// #region 추가적인 값 정의
type TVariables = {
  character: Character;
  scheduleId: IntervalId;
  characterMoveId: IntervalId;
  primaryDisplay: Display;
  width: number;
  height: number;
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
  primaryDisplay: screen.getPrimaryDisplay(),
  width,
  height,
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
// #endregion

export default mainWindow;

export { variables };
