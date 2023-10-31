/* eslint-disable no-param-reassign */

import { App, BrowserWindow, shell, ipcMain } from 'electron';
import path from 'path';
import { resolveHtmlPath } from './util';
import Character from './chracter/Character';
import moveScheduling from './chracter/moveScheduling';
import moving from './chracter/moving';
import { TWindows } from './main';

const width = 200;
const height = 200;

let windows: TWindows | null;
let characterMoving: NodeJS.Timer | null;
let scheduling: NodeJS.Timer | null;

const createMainWindow = (app: App, wins: TWindows): BrowserWindow => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const mainWindow = new BrowserWindow({
    resizable: false,
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

  wins.main = mainWindow;
  windows = wins;

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

    characterMoving = setInterval(moving, 30, character);
    scheduling = setInterval(moveScheduling, 2000, character);

    // 캐릭터를 드래그 하고 있는 경우에는 걸어다니는 동작을 일시 정지함

    ipcMain.on('stopMoving', () => {
      clearInterval(characterMoving);
      clearInterval(scheduling);
      characterMoving = null;
      scheduling = null;
    });
    ipcMain.on('restartMoving', () => {
      if (characterMoving == null && scheduling == null) {
        scheduling = setInterval(moveScheduling, 2000, character);
        characterMoving = setInterval(moving, 30, character);
      }
    });

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
