import { app, globalShortcut, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { Worker } from 'worker_threads';
import path from 'path';

const { dbInstance } = require('./jobtime/jobTimeDB');
const { dbInstance: subDbInstance } = require('./jobtime/subJobTimeDB');

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const received: [] = []; // 새로운 메일 수신 확인을 위해 임시로 저장하는 배열
const mails: [] = []; // 이제껏 수신한 메일들을 보관하는 배열
dbInstance.init();
subDbInstance.init();

ipcMain.handle('env', async (event, key) => {
  return process.env[key];
});

ipcMain.on('application', (event, applicationPath) => {
  try {
    shell.openExternal(applicationPath);
  } catch (e) {
    console.log(e);
  }
});

// ipcMain.on('mailRequest', () => {
//   console.log('mail Requesting!!!');
//   subWindow?.webContents.send('mailRequest', mails);
// });

// ipcMain.on('deleteMail', (event, mail) => {
//   // 메일 삭제하기 위해 듣는 리스너
//   for (let i = 0; i < mails.length; ++i) {
//     if (
//       mails[i].seq === mail.seq &&
//       mails[i].to === mail.to &&
//       mails[i].host === mail.host
//     ) {
//       // 해당 메일 삭제
//       mails.splice(i, 1);
//     }
//   }
// });

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

  await import('./windows');

  // 메일 계정 불러오기
  // let timerId = setInterval(getMails, 10000, mainWindow, subWindow, received, mails, "honeycomb201", "ssafyssafy123", "imap.daum.net");

  // Remove this if your app does not use auto updates

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
    createWindow().then(async () => {
      // 윈도우가 만들어지고난 후
      const communication = await import('./windows/communication');
      communication.default();

      const SettingHandler = await import('./setting/setting');
      SettingHandler.default();

      const createTray = await import('./tray/tray');
      createTray.default();

      const { characterHandler, jobTimeHandler, windowsHandler } = await import(
        './ipcMainHandler'
      );
      const globalShortcutHandler = await import(
        './shortcut/globalShortcutHandler'
      );

      // ipc관련 핸들러들 등록
      characterHandler();
      windowsHandler();
      jobTimeHandler(dbInstance, subDbInstance);
      globalShortcutHandler.default();
    });
    app.on('activate', async () => {
      const { mainWindow } = await import('./windows');
      if (mainWindow === null) createWindow();
    });
    return null;
  })
  .catch(console.log);

const jobTimeThread = new Worker(path.join(__dirname, 'jobtime', 'jobTime.js'));
