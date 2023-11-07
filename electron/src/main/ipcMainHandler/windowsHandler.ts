/* eslint-disable no-use-before-define */
import { ipcMain } from 'electron';
import { TWindows } from '../main';

const windowsHandler = (windows: TWindows) => {
  subHandler(windows);
  windowMovingHandler(windows);
};

// sub윈도우의 다른 창을 띄우기 위해 navigate가 필요할 때
const subHandler = (windows: TWindows) => {
  ipcMain.on('sub', (event, path) => {
    windows.sub?.webContents.send('sub', path);
    windows.sub?.show();
  });
};

// 윈도우 move 이벤트 일때
const windowMovingHandler = (windows: TWindows) => {
  ipcMain.on('windowMoving', (event, arg) => {
    windows.main?.setBounds({
      width: 100,
      height: 100,
      x: arg.mouseX - 50, // always changes in runtime
      y: arg.mouseY - 50,
    });
  });
};

export default windowsHandler;
