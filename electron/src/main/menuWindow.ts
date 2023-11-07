import { App, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { BrowserView } from 'electron/main';
import { delay } from 'lodash';
import { TWindows } from './main';
import { resolveHtmlPath } from './util';

const width = 300;
const height = 300;

let windows: TWindows | null;

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const createMenuWindow = (app: App, wins: TWindows): BrowserWindow => {
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

  wins.menu = menuWindow;
  windows = wins;

  menuWindow.loadURL(resolveHtmlPath('index.html'));
  menuWindow.on('ready-to-show', () => {
    menuWindow.webContents.send('sub', 'menu');
    menuWindow.webContents.closeDevTools();
  });

  ipcMain.on('hideMenuWindow', async () => {
    await sleep(500);
    menuWindow?.hide();
  });

  return menuWindow;
};

export default createMenuWindow;
