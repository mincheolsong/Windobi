/* eslint-disable no-restricted-syntax */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unsafe-finally */
/* eslint-disable import/no-cycle */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable promise/always-return */
/* eslint-disable global-require */
import { app, BrowserWindow, globalShortcut, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { Worker } from 'worker_threads';
import path from 'path';
import createMainWindow from './mainWindow';
import createSubWindow from './subWindow';
import createMenuWindow from './menuWindow';
import {
  interWindowCommunication,
  interMenuWindowCommunication,
} from './interWindow';
import SettingHandler, { settingDB } from './setting/setting';
import createTray from './tray/tray';
import characterHandler from './ipcMainHandler/characterHandler';
import windowsHandler from './ipcMainHandler/windowsHandler';
import globalShortcutHandler from './shortcut/globalShortcutHandler';
import jobTimeHandler from './ipcMainHandler/jobTimeHandler';

const { dbInstance } = require('./jobtime/jobTimeDB');
const { dbInstance: subDbInstance } = require('./jobtime/subJobTimeDB');

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export type TWindows = {
  main: BrowserWindow | null;
  sub: BrowserWindow | null;
  menu: BrowserWindow | null;
};

const windows: TWindows = {
  main: null,
  sub: null,
  menu: null,
};

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const received: [] = []; // 새로운 메일 수신 확인을 위해 임시로 저장하는 배열
const mails: [] = []; // 이제껏 수신한 메일들을 보관하는 배열

let mainWindow: BrowserWindow | null = null;
let subWindow: BrowserWindow | null = null;
let menuWindow: BrowserWindow | null = null;

dbInstance.init();
subDbInstance.init();

ipcMain.handle('env', async (event, key) => {
  return process.env[key];
});

ipcMain.on('application', (event, applicationPath) => {
  try {
    shell.openExternal(applicationPath);
  } finally {
    return;
  }
});

ipcMain.on('mailRequest', () => {
  console.log('mail Requesting!!!');
  subWindow?.webContents.send('mailRequest', mails);
});

ipcMain.on('deleteMail', (event, mail) => {
  // 메일 삭제하기 위해 듣는 리스너
  for (let i = 0; i < mails.length; ++i) {
    if (
      mails[i].seq === mail.seq &&
      mails[i].to === mail.to &&
      mails[i].host === mail.host
    ) {
      // 해당 메일 삭제
      mails.splice(i, 1);
    }
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = createMainWindow(app, windows);
  menuWindow = createMenuWindow(app, windows);
  subWindow = createSubWindow(app, windows);

  // 메일 계정 불러오기
  // let timerId = setInterval(getMails, 10000, mainWindow, subWindow, received, mails, "honeycomb201", "ssafyssafy123", "imap.daum.net");

  interWindowCommunication(mainWindow, subWindow);
  interMenuWindowCommunication(mainWindow, menuWindow);
  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow().then(() => {
      // 윈도우가 만들어지고난 후
      SettingHandler(windows);
      createTray(app, windows, settingDB);

      // ipc관련 핸들러들 등록
      characterHandler(windows);
      windowsHandler(windows);
      globalShortcutHandler(windows);
      jobTimeHandler(dbInstance, subDbInstance);
    });
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

const jobTimeThread = new Worker(path.join(__dirname, 'jobtime', 'jobTime.js'));
