import { ipcMain } from 'electron';
import { JobTimeDB } from '../jobtime/jobTimeDB';
import { SubJobTimeDB } from '../jobtime/subJobTimeDB';

const jobTimeHandler = (dbInstance: JobTimeDB, subDbInstance: SubJobTimeDB) => {
  registJobTimeHandler(dbInstance);
  subJobTimeHandler(subDbInstance);
};

/**
 * 'job-time' : 작업시간 불러오기 이벤트
 */
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

  ipcMain.handle(
    'job-time',
    async (_event, type: 'day' | 'week', target: Date) => {
      if (type === 'day') {
        const result = await dbInstance.getByDay(target);
        return result;
      }
      if (type === 'week') {
        const result = await dbInstance.getRecentWeek();
        return result;
      }
      return [];
    },
  );
};

/**
 * 'sub-job-time' : 세부 작업시간 불러오기 이벤트
 */
const subJobTimeHandler = (subDbInstance: SubJobTimeDB) => {
  ipcMain.handle(
    'sub-job-time',
    async (_event, { application, type, date }) => {
      if (type === 'daily') {
        const result = await subDbInstance.getByDay(application, date);
        return result;
      }
      if (type === 'weekly') {
        const result = await subDbInstance.getRecentWeek(application);
        return result;
      }
      return [];
    },
  );
};

export default jobTimeHandler;
