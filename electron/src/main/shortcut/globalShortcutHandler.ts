/* eslint-disable no-use-before-define */
/* eslint-disable import/no-cycle */
import { globalShortcut } from 'electron';
import { TWindows } from '../main';

const globalShortcutHandler = (windows: TWindows) => {
  toggleAllDevToolsHandler(windows);
  toggleMainWindowDevToolsHandler(windows);
  toggleSubWindowDevToolsHandler(windows);
  toggleMenuWindowDevToolsHandler(windows);
};

// 모든 윈도우의 devTools를 켜고 끄기
const toggleAllDevToolsHandler = (windows: TWindows) => {
  const { main, sub, menu } = windows;
  globalShortcut.register('CommandOrControl+Alt+I', () => {
    main?.webContents.toggleDevTools();
    sub?.webContents.toggleDevTools();
    menu?.webContents.toggleDevTools();
  });
};

// 메인 윈도우의 devTools를 켜고 끄기
const toggleMainWindowDevToolsHandler = (windows: TWindows) => {
  globalShortcut.register('CommandOrControl+Alt+A', () => {
    windows.main?.webContents.toggleDevTools();
  });
};

// 서브 윈도우의 devTools를 켜고 끄기
const toggleSubWindowDevToolsHandler = (windows: TWindows) => {
  globalShortcut.register('CommandOrControl+Alt+S', () => {
    windows.sub?.webContents.toggleDevTools();
  });
};

// 메뉴 윈도우의 devTools를 켜고 끄기
const toggleMenuWindowDevToolsHandler = (windows: TWindows) => {
  globalShortcut.register('CommandOrControl+Alt+D', () => {
    windows.menu?.webContents.toggleDevTools();
  });
};

export default globalShortcutHandler;
