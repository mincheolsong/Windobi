import { App, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { BrowserView } from 'electron/main';
import { delay } from 'lodash';
import { resolveHtmlPath } from './util';

const width = 400;
const height = 400;
const createMenuWindow = (app: App): BrowserWindow => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const menuWindow = new BrowserWindow({
    width,
    height,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    frame: false,
    movable: false,
    alwaysOnTop: false,
    transparent: true,
    skipTaskbar: true,
    show: false,
    resizable: false,
  });

  menuWindow.loadURL(resolveHtmlPath('index.html'));
  menuWindow.on('ready-to-show', () => {
    menuWindow.webContents.send('sub', 'menu');
    menuWindow.webContents.closeDevTools();
  });

  // 밖에 클릭하면 메뉴 닫기
  menuWindow.addListener('blur', () => {
    menuWindow?.webContents.send('toggleMenuClose');
    menuWindow?.webContents.send('windowMoveDone');
  });

  return menuWindow;
};

export default createMenuWindow;
