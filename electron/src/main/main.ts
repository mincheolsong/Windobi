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

dbInstance.init();
subDbInstance.init();

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

      await import('./tray/tray');

      const { default: moveHandler } = await import('./chracter/moveHandler');

      const {
        characterHandler,
        jobTimeHandler,
        mailHandler,
        processHandler,
        weatherHandler,
        windowsHandler,
        oauthHandelr,
      } = await import('./ipcMainHandler');
      const { default: globalShortcutHandler } = await import(
        './shortcut/globalShortcutHandler'
      );

      // ipc관련 핸들러들 등록
      characterHandler();
      jobTimeHandler(dbInstance, subDbInstance);
      oauthHandelr();
      mailHandler();
      processHandler();
      weatherHandler();
      windowsHandler();
      moveHandler();

      globalShortcutHandler();
    });

    app.on('activate', async () => {
      const { mainWindow } = await import('./windows');
      if (mainWindow === null) createWindow();
    });

    return null;
  })
  .catch(console.log);

const jobTimeThread = new Worker(path.join(__dirname, 'jobtime', 'jobTime.js'));
