// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'sub'
  | 'job-time'
  | 'size'
  | 'windowMoving'
  | 'toggleMenuOn'
  | 'toggleMenuClose'
  | 'closeMenuWindow'
  | 'sizeUpMenuWindow'
  | 'application'
  | 'character-move'
  | 'stopMoving'
  | 'restartMoving'
  | 'sub-job-time'
  | 'mailReceiving'
  | 'mailRequest'
  | 'character-list'
  | 'character-images'
  | 'change-character'
  | 'start-move'
  | 'stop-move'
  | 'set-setting'
  | 'get-setting'
  | 'env'
  | 'hideMenuWindow'
  | 'hideSubWindow'
  | 'deleteMail';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, ...args: any[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
    removeListener(channel: Channels, func: (...args: any[]) => any) {
      ipcRenderer.removeListener(channel, func);
    },
    removeAllListener(channel: Channels) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
