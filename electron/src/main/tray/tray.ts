/* eslint-disable no-use-before-define */
/* eslint-disable import/no-cycle */
import Electron, { App, Menu, Tray, globalShortcut } from 'electron';
import path from 'path';
import { TWindows } from '../main';

const createTray = (app: App, windows: TWindows) => {
  const iconPath = path.join('assets', 'icons', 'hanbyul.png');
  const tray = new Tray(iconPath);

  // 툴팁 설정
  tray.setToolTip('윈도비');

  // 메뉴 만들기
  createMenu(tray, app, windows);
};

function createMenu(tray: Tray, app: App, windows: TWindows) {
  const initTemplate: Array<
    Electron.MenuItemConstructorOptions | Electron.MenuItem
  > = [{ label: '종료', type: 'normal', click: exit }];

  function hide() {
    const contextMenu = Menu.buildFromTemplate([
      { label: '보이기', type: 'normal', click: show },
      ...initTemplate,
    ]);
    tray.setContextMenu(contextMenu);
    windows.main?.hide();
    windows.sub?.hide();
    windows.menu?.hide();
  }

  function show() {
    const contextMenu = Menu.buildFromTemplate([
      { label: '숨기기', type: 'normal', click: hide },
      ...initTemplate,
    ]);
    tray.setContextMenu(contextMenu);
    windows.main?.show();
    windows.sub?.show();
    windows.menu?.show();
  }

  function exit() {
    if (process.platform !== 'darwin') {
      globalShortcut.unregisterAll();
      app.quit();
    }
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: '숨기기', type: 'normal', click: hide },
    ...initTemplate,
  ]);
  tray.setContextMenu(contextMenu);
}

export default createTray;
