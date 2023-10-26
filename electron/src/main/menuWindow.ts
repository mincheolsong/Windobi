import { App, BrowserWindow } from 'electron';
import path from 'path';
import { resolveHtmlPath } from './util';

const width = 100;
const height = 100;
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
    alwaysOnTop: true,
    transparent: true,
    skipTaskbar: true,
    show: false,
    resizable: true,
  });

  menuWindow.loadURL(resolveHtmlPath('index.html'));
  menuWindow.on('ready-to-show', () => {
    menuWindow.webContents.send('sub', 'menu');
    menuWindow.webContents.closeDevTools();
  });

  return menuWindow;
};

export default createMenuWindow;
