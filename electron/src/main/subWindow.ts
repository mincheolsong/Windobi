import { App, BrowserWindow } from 'electron';
import path from 'path';
import { resolveHtmlPath } from './util';
import { TWindows } from './main';

let windows: TWindows | null;

const createSubWindow = (app: App, wins: TWindows): BrowserWindow => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const subWindow = new BrowserWindow({
    width: 0,
    height: 0,
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
    resizable: false,
  });

  wins.sub = subWindow;
  windows = wins;

  subWindow.loadURL(resolveHtmlPath('index.html'));
  subWindow.on('ready-to-show', () => {
    subWindow.webContents.send('sub', 'closed');
    subWindow.webContents.closeDevTools();
  });

  return subWindow;
};

export default createSubWindow;
