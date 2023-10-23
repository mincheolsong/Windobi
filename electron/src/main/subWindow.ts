import { App, BrowserWindow } from 'electron';
import path from 'path';
import { resolveHtmlPath } from './util';

const createSubWindow = (app: App): BrowserWindow => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const subWindow = new BrowserWindow({
    width: 500,
    height: 500,
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
  });

  subWindow.loadURL(resolveHtmlPath('index.html'));
  subWindow.on('ready-to-show', () => {
    subWindow.webContents.send('sub', 'closed');
  });

  return subWindow;
};

export default createSubWindow;
