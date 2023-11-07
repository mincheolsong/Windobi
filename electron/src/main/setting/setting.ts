/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { ipcMain } from 'electron';
import { TWindows } from '../main';
import SettingDB from './settingDB';

type TSetting = 'character';

const settingDB = new SettingDB();
const SettingHandler = (windows: TWindows) => {
  const getHandler = {
    character: settingDB.character,
  };

  const setHandler = {
    character: (value: any) => {
      settingDB.character = value;
    },
  };

  ipcMain.handle('get-setting', async (event, key: TSetting) => {
    return getHandler[key];
  });

  ipcMain.on('set-setting', async (event, key: TSetting, value) => {
    const handler = setHandler[key];
    handler(value);
  });
};

export default SettingHandler;

export { settingDB };
