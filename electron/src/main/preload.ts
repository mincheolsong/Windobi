import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { TCharacterChannel } from './preload/Character';
import { JobTimeChannel } from './preload/JobTime';
import { WindowsChannel } from './preload/Windows';

export type Channels =
  | 'application'
  | 'mailReceiving'
  | 'mailRequest'
  | 'set-setting'
  | 'get-setting'
  | 'env'
  | 'deleteMail'
  | TCharacterChannel
  | JobTimeChannel
  | WindowsChannel;

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
