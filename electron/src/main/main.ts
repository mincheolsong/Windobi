/* eslint-disable no-restricted-syntax */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unsafe-finally */
/* eslint-disable import/no-cycle */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable promise/always-return */
/* eslint-disable global-require */
import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  shell,
  screen,
  Tray,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'node:fs';
import createMainWindow from './mainWindow';
import createSubWindow from './subWindow';
import createMenuWindow from './menuWindow';
import {
  interWindowCommunication,
  interMenuWindowCommunication,
} from './interWindow';
import SettingHandler from './setting/setting';
import createTray from './tray/tray';

const { dbInstance } = require('./jobtime/jobTimeDB');
const { dbInstance: subDbInstance } = require('./jobtime/subJobTimeDB');

const sleep = (ms) => {
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

let mainWindow: BrowserWindow | null = null;
let subWindow: BrowserWindow | null = null;
let menuWindow: BrowserWindow | null = null;

dbInstance.init();
subDbInstance.init();

ipcMain.on('job-time', async (event, type, target) => {
  if (type === 'day') {
    const result = await dbInstance.getByDay(target);
    event.reply('job-time', { type, result });
  } else if (type === 'week') {
    const result = await dbInstance.getRecentWeek();
    event.reply('job-time', { type, result });
  }
});

ipcMain.handle('sub-job-time', async (event, { application, type, date }) => {
  if (type === 'daily') {
    return subDbInstance.getByDay(application, date);
  }
  if (type === 'weekly') {
    return subDbInstance.getRecentWeek(application);
  }
});

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

ipcMain.on('sub', (event, path) => {
  subWindow?.webContents.send('sub', path);
  subWindow?.show();
});

ipcMain.on('windowMoving', (event, arg) => {
  mainWindow?.setBounds({
    width: 100,
    height: 100,
    x: arg.mouseX - 50, // always changes in runtime
    y: arg.mouseY - 50,
  });
});

// 캐릭터 오른쪽 클릭 시 toggleMenuOn을 send함 (위치 : Character.tsx)
ipcMain.on('toggleMenuOn', () => {
  mainWindow?.show();
  menuWindow?.show();
  menuWindow?.webContents.send('toggleMenuOn'); // MenuModal.tsx에 메뉴 on/off 애니메이션 효과를 위해서 send
});

ipcMain.handle('character-list', async () => {
  const RESOURCE_PATH = 'assets/character';
  const characterList = fs.readdirSync(RESOURCE_PATH);
  const result = characterList.map((character) => {
    const image = fs.readFileSync(
      path.join(RESOURCE_PATH, character, 'stop', '1.png'),
      { encoding: 'base64' },
    );

    return { name: character, image };
  });
  return result;
});

type TMotion = 'click' | 'down' | 'move' | 'stop' | 'up';
type TMotionImage = {
  click: Array<string>;
  down: Array<string>;
  move: Array<string>;
  stop: Array<string>;
  up: Array<string>;
};
ipcMain.handle('character-images', async (event, character: string) => {
  const RESOURCE_PATH = 'assets/character';
  const TARGET_DIRECTORY = path.join(RESOURCE_PATH, character);
  const motions: Array<TMotion> = ['click', 'down', 'move', 'stop', 'up'];
  const motionImages: TMotionImage = {
    click: [],
    down: [],
    move: [],
    stop: [],
    up: [],
  };
  motions.forEach((motion) => {
    try {
      const imageList = fs.readdirSync(path.join(TARGET_DIRECTORY, motion));
      for (const image of imageList) {
        const base64Image = fs.readFileSync(
          path.join(TARGET_DIRECTORY, motion, image),
          { encoding: 'base64' },
        );
        motionImages[motion].push(base64Image);
      }
    } catch (e) {
      console.log(e);
    }
  });

  return motionImages;
});

ipcMain.on('change-character', (event, character) => {
  mainWindow?.webContents.send('change-character', character);
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

  interWindowCommunication(mainWindow, subWindow);
  interMenuWindowCommunication(mainWindow, menuWindow);
  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

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
      createTray(app, windows);
    });
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });

    globalShortcut.register('CommandOrControl+Alt+I', () => {
      mainWindow?.webContents.toggleDevTools();
      subWindow?.webContents.toggleDevTools();
      menuWindow?.webContents.toggleDevTools();
    });
    globalShortcut.register('CommandOrControl+Alt+M', () => {
      mainWindow?.webContents.toggleDevTools();
    });
    globalShortcut.register('CommandOrControl+Alt+S', () => {
      subWindow?.webContents.toggleDevTools();
    });
    globalShortcut.register('CommandOrControl+Alt+O', () => {
      subWindow?.webContents.send('sub', 'jobtime');
    });
    globalShortcut.register('CommandOrControl+Alt+P', () => {
      subWindow?.webContents.send('sub', 'notification');
    });
  })
  .catch(console.log);

let moveTimer: ReturnType<typeof setInterval> | null = null;
ipcMain.on('start-move', () => {
  mainWindow?.webContents.send('character-move', 'click');
  moveTimer = setInterval(() => {
    const { x, y } = screen.getCursorScreenPoint();
    mainWindow?.setBounds({
      width: 100,
      height: 100,
      x: x - 50,
      y: y - 50,
    });
  }, 10);
});
ipcMain.on('stop-move', () => {
  if (moveTimer) {
    clearInterval(moveTimer);
  }
});

ipcMain.handle('get-image', (event, filePath: string) => {
  return fs.readFileSync(filePath, { encoding: 'base64' });
});

type TAddCharacter = {
  name: string;
  stop: Array<string>;
  move: Array<string>;
  click: Array<string>;
  down: Array<string>;
  up: Array<string>;
};
ipcMain.handle(
  'add-character',
  (event, { name, stop, move, click, down, up }: TAddCharacter) => {
    const result = {
      success: false,
      message: '',
    };

    if (name.length === 0 || stop.length > 10) {
      result.success = false;
      result.message = '캐릭터 이름은 1~9글자여야합니다';
      return result;
    }

    if (
      stop.length === 0 ||
      move.length === 0 ||
      click.length === 0 ||
      down.length === 0 ||
      up.length === 0
    ) {
      result.success = false;
      result.message = '각 모션마다 최소 1장의 이미지가 필요합니다';
      return result;
    }

    const RESOURCE_PATH = 'assets/character';

    if (fs.existsSync(path.join(RESOURCE_PATH, name))) {
      result.success = false;
      result.message = '이미 존재하는 캐릭터 이름입니다';
      return result;
    }

    fs.mkdirSync(path.join(RESOURCE_PATH, name));

    const images = [
      { motion: 'stop', images: stop },
      { motion: 'move', images: move },
      { motion: 'click', images: click },
      { motion: 'down', images: down },
      { motion: 'up', images: up },
    ];

    images.forEach(({ motion, images }) => {
      fs.mkdirSync(path.join(RESOURCE_PATH, name, motion));
      images.forEach((image, index) => {
        fs.writeFileSync(
          path.join(RESOURCE_PATH, name, motion, `${index + 1}.png`),
          image,
          'base64',
        );
      });
    });

    result.success = true;

    return result;
  },
);

const jobTimeThread = new Worker(path.join(__dirname, 'jobtime', 'jobTime.js'));
