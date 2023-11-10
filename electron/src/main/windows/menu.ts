import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'path';
import { resolveHtmlPath } from '../util';

// #region 유틸리티 정의
const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};
// #endregion

// #region 추가적인 값 정의
const variables = {
  width: 300,
  height: 300,
};
// #endregion

// #region 윈도우 설정 정의
const menuWindow = new BrowserWindow({
  width: variables.width,
  height: variables.height,
  icon: getAssetPath('icon.png'),
  webPreferences: {
    preload: app.isPackaged
      ? path.join(__dirname, '../preload.js')
      : path.join(__dirname, '../../../.erb/dll/preload.js'),
    nodeIntegration: true,
  },
  frame: false,
  movable: false,
  alwaysOnTop: true,
  transparent: true,
  skipTaskbar: true,
  show: false,
  resizable: false,
});
menuWindow.loadURL(resolveHtmlPath('index.html'));

// #endregion

// #region 이벤트 정의
menuWindow.on('ready-to-show', () => {
  menuWindow.webContents.send('sub', 'menu');
  menuWindow.webContents.closeDevTools();
});

menuWindow.on('blur', () => {
  ipcMain.emit('hide-menu');
  ipcMain.emit('restartMoving');
});

// #endregion

export default menuWindow;
export { variables };
