/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { ipcMain } from 'electron';
import { TWindows } from '../main';
import SettingDB from './settingDB';

type TKyes = 'character';

const SettingHandler = (windows: TWindows) => {
  const settingDB = new SettingDB();
  const getHandler = {
    character: settingDB.character,
  };

  const setHandler = {
    character: (value: any) => {
      settingDB.character = value;
    },
  };

  ipcMain.handle('get-setting', async (event, key: TKyes) => {
    return getHandler[key];
  });

  ipcMain.on('set-setting', async (event, key: TKyes, value) => {
    const handler = setHandler[key];
    handler(value);
  });
};

export default SettingHandler;
