import { ipcMain, shell } from 'electron';

const processHandler = () => {
  applicationHandler();
};

/**
 * 'env' : env 정보를 key를 이용해 받아오기
 */
// const envHandler = () => {
//   ipcMain.handle('env', async (_event, key) => {
//     return process.env[key];
//   });
// };

/**
 * 'application' : 실행파일 path를 이용하여 application을 실행
 */
const applicationHandler = () => {
  ipcMain.on('application', (event, applicationPath) => {
    try {
      shell.openExternal(applicationPath);
    } catch (e) {
      console.log(e);
    }
  });
};

export default processHandler;
