import Electron, { Menu, Tray, app, globalShortcut } from 'electron';
import path from 'path';
import settingDB from '../setting/settingDB';
import { mainWindow, menuWindow, subWindow } from '../windows';

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const createTray = () => {
  const iconPath = path.join('assets', 'icons', 'hanbyul.png');
  const tray = new Tray(iconPath);

  // 툴팁 설정
  tray.setToolTip('windobi');

  // 메뉴 만들기
  createMenu(tray);
};

function createMenu(tray: Tray) {
  const initTemplate: Array<Electron.MenuItemConstructorOptions> = [
    {
      label: '종료',
      type: 'normal',
      click: exit,
    },
  ];

  async function hide() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '보이기',
        type: 'normal',
        click: show,
        accelerator: settingDB.hideOrShow,
      },
      ...initTemplate,
    ]);
    tray.setContextMenu(contextMenu);
    menuWindow.webContents.send('setActiveFalse');
    await sleep(500);
    menuWindow.hide();
    mainWindow.hide();
    subWindow.hide();
  }

  function show() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '숨기기',
        type: 'normal',
        click: hide,
        accelerator: settingDB.hideOrShow,
      },
      ...initTemplate,
    ]);
    tray.setContextMenu(contextMenu);
    mainWindow.show();
    subWindow.show();
  }

  function exit() {
    if (process.platform !== 'darwin') {
      globalShortcut.unregisterAll();
      app.quit();
    }
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '숨기기',
      type: 'normal',
      click: hide,
      accelerator: settingDB.hideOrShow,
    },
    ...initTemplate,
  ]);
  tray.setContextMenu(contextMenu);
}

export default createTray;
