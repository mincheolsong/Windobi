import Electron, { Menu, Tray, app, globalShortcut } from 'electron';
import path from 'path';
import settingDB from '../setting/settingDB';
import { mainWindow, subWindow } from '../windows';

const iconPath = path.join('assets', 'icons', 'hanbyul.png');
const tray = new Tray(iconPath);

type TVariables = {
  menu: Electron.Menu;
};

const variables: TVariables = {
  menu: Menu.buildFromTemplate([]),
};

// 툴팁 설정
tray.setToolTip('windobi');

// 트레이를 더블클릭하면 다시 보여주자
tray.on('double-click', show);

const initTemplate: Array<Electron.MenuItemConstructorOptions> = [
  {
    label: '종료',
    type: 'normal',
    click: exit,
  },
];

/**
 * 윈도우들 숨기기
 */
function hide() {
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
  variables.menu = contextMenu;

  mainWindow.hide();
  subWindow.hide();
}

/**
 * 숨겼던 윈도우들 보이게 하기
 */
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
  variables.menu = contextMenu;

  mainWindow.show();
  subWindow.show();
}

/**
 * 프로그램 종료
 */
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
variables.menu = contextMenu;

export default tray;
export { variables };
