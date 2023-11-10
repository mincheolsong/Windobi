import { globalShortcut } from 'electron';
import { mainWindow, menuWindow, subWindow, etcWindow } from '../windows';

const globalShortcutHandler = () => {
  toggleAllDevToolsHandler();
  toggleMainWindowDevToolsHandler();
  toggleSubWindowDevToolsHandler();
  toggleMenuWindowDevToolsHandler();
};

// 모든 윈도우의 devTools를 켜고 끄기
const toggleAllDevToolsHandler = () => {
  globalShortcut.register('CommandOrControl+Alt+I', () => {
    mainWindow.webContents.toggleDevTools();
    subWindow.webContents.toggleDevTools();
    menuWindow.webContents.toggleDevTools();
    etcWindow.webContents.toggleDevTools();
  });
};

// 메인 윈도우의 devTools를 켜고 끄기
const toggleMainWindowDevToolsHandler = () => {
  globalShortcut.register('CommandOrControl+Alt+A', () => {
    mainWindow.webContents.toggleDevTools();
  });
};

// 서브 윈도우의 devTools를 켜고 끄기
const toggleSubWindowDevToolsHandler = () => {
  globalShortcut.register('CommandOrControl+Alt+S', () => {
    subWindow.webContents.toggleDevTools();
  });
};

// 메뉴 윈도우의 devTools를 켜고 끄기
const toggleMenuWindowDevToolsHandler = () => {
  globalShortcut.register('CommandOrControl+Alt+D', () => {
    menuWindow.webContents.toggleDevTools();
  });
};

export default globalShortcutHandler;
