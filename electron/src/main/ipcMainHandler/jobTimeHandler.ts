/* eslint-disable no-use-before-define */
import { ipcMain } from 'electron';
import { JobTimeDB } from '../jobtime/jobTimeDB';
import { SubJobTimeDB } from '../jobtime/subJobTimeDB';

const jobTimeHandler = (dbInstance: JobTimeDB, subDbInstance: SubJobTimeDB) => {
  registJobTimeHandler(dbInstance);
  subJobTimeHandler(subDbInstance);
};

// jobTime을 불러오기 위해
const registJobTimeHandler = (dbInstance: JobTimeDB) => {
  ipcMain.on('job-time', async (event, type: 'day' | 'week', target: Date) => {
    if (type === 'day') {
      const result = await dbInstance.getByDay(target);
      event.reply('job-time', { type, result });
    } else if (type === 'week') {
      const result = await dbInstance.getRecentWeek();
      event.reply('job-time', { type, result });
    }
  });
};

// subJobTime을 불러오기 위해
const subJobTimeHandler = (subDbInstance: SubJobTimeDB) => {
  ipcMain.handle('sub-job-time', async (event, { application, type, date }) => {
    if (type === 'daily') {
      return subDbInstance.getByDay(application, date);
    }
    if (type === 'weekly') {
      return subDbInstance.getRecentWeek(application);
    }
  });
};

export default jobTimeHandler;
