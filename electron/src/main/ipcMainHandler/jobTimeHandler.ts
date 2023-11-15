import { ipcMain } from 'electron';
import * as JobTimeDB from '../jobtime/jobTimeDB';
import * as SubJobTimeDB from '../jobtime/subJobTimeDB';

const jobTimeHandler = () => {
  registJobTimeHandler();
  subJobTimeHandler();
};

/**
 * 'job-time' : 작업시간 불러오기 이벤트
 */
const registJobTimeHandler = () => {
  ipcMain.on('job-time', async (event, type: 'day' | 'week', target: Date) => {
    if (type === 'day') {
      const result = await JobTimeDB.getByDay(target);
      event.reply('job-time', { type, result });
    } else if (type === 'week') {
      const result = await JobTimeDB.getRecentWeek();
      event.reply('job-time', { type, result });
    }
  });

  ipcMain.handle(
    'job-time',
    async (
      _event,
      type: 'day' | 'week' | 'dayOfWeek' | 'weekPerApplication' | 'lastWeekSum',
      target: Date,
    ) => {
      if (type === 'day') {
        const result = await JobTimeDB.getByDay(target);
        return result;
      }
      if (type === 'week') {
        const result = await JobTimeDB.getRecentWeek();
        return result;
      }
      if (type === 'weekPerApplication') {
        const result = await JobTimeDB.getRecentWeekPerApplication();
        return result;
      }
      if (type === 'dayOfWeek') {
        const result = await JobTimeDB.getRecentDayOfWeek();
        return result;
      }
      if (type === 'lastWeekSum') {
        const result = await JobTimeDB.getSumTimeofLastWeek();
        return result;
      }
      return [];
    },
  );
};

/**
 * 'sub-job-time' : 세부 작업시간 불러오기 이벤트
 */
const subJobTimeHandler = () => {
  ipcMain.handle(
    'sub-job-time',
    async (_event, { application, type, date }) => {
      if (type === 'daily') {
        const result = await SubJobTimeDB.getByDay(application, date);
        return result;
      }
      if (type === 'weekly') {
        const result = await SubJobTimeDB.getRecentWeek(application);
        return result;
      }
      if (type === 'entire') {
        const result = await SubJobTimeDB.getDevelopAmount();
        return result;
      }
      return [];
    },
  );
};

export default jobTimeHandler;
