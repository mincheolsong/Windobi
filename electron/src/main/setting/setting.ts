import { ipcMain } from 'electron';
import settingDB from './settingDB';

type TSetting = 'character';

const SettingHandler = () => {
  const getHandler = {
    character: settingDB.character,
  };

  const setHandler = {
    character: (value: any) => {
      settingDB.character = value;
    },
  };

  ipcMain.handle('get-setting', async (_event, key: TSetting) => {
    return getHandler[key];
  });

  ipcMain.on('set-setting', async (_event, key: TSetting, value) => {
    const handler = setHandler[key];
    handler(value);
  });
};

export default SettingHandler;

export { settingDB };
