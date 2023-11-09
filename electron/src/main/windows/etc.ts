import { BrowserWindow, app } from 'electron';
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
  width: 500,
  height: 700,
};
// #endregion

// #region 윈도우 설정 정의
const etcWindow = new BrowserWindow({
  width: variables.width,
  height: variables.height,
  icon: getAssetPath('icon.png'),
  webPreferences: {
    preload: app.isPackaged
      ? path.join(__dirname, '../preload.js')
      : path.join(__dirname, '../../../.erb/dll/preload.js'),
    nodeIntegration: true,
    webviewTag: true,
  },
  frame: false,
  movable: true,
  alwaysOnTop: false,
  transparent: true,
  skipTaskbar: true,
  show: false,
  resizable: true,
});
etcWindow.loadURL(resolveHtmlPath('index.html'));

// #endregion

// #region 이벤트 정의
etcWindow.on('ready-to-show', () => {
  etcWindow.webContents.send('sub', 'youtubeMusic');
  etcWindow.webContents.closeDevTools();
});
// #endregion

export default etcWindow;
export { variables };
