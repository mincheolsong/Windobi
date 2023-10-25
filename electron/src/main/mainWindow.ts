/* eslint-disable no-param-reassign */

import { App, BrowserWindow, shell } from 'electron';
import path from 'path';
import { resolveHtmlPath } from './util';
import Character from './chracter/Character';
import moveScheduling from './chracter/moveScheduling';
import moving from './chracter/moving';

const width = 200;
const height = 200;

const createMainWindow = (app: App): BrowserWindow => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const mainWindow = new BrowserWindow({
    show: false,
    width,
    height,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
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

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }

    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    // 스크린의 크기를 받아오기

    const character: Character = new Character(
      mainWindow,
      height,
      width,
      100,
      110,
    );
    let characterMoving = setInterval(moving, 30, character);
    let scheduling = setInterval(moveScheduling, 2000, character);

    mainWindow.webContents.closeDevTools();
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  return mainWindow;
};

export default createMainWindow;
