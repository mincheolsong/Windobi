/* eslint-disable no-promise-executor-return */
import path from 'node:path';
import fs from 'fs';
import * as sqlite from 'sqlite3';
import { app } from 'electron';
import { TJobTime, TActiveMap } from './jobTime.d';

const sqlite3 = sqlite.verbose();

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');

const DB_FILE = path.join(RESOURCES_PATH, 'database.db');
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '');
}

type TJob = Omit<TJobTime, 'day'>;

const TABLE_NAME = 'job_time';
const dateToNumber = (date: Date) => {
  const numberDate =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  return numberDate;
};

const instance = new sqlite3.Database(DB_FILE, () => {
  createTable();
});

const createTable = () => {
  instance.run(
    `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application TEXT,
      active_time INTEGER,
      icon TEXT,
      path TEXT,
      day INTEGER
    )`,
  );
};

const insertAll = (activeMap: TActiveMap, tickTime: number) => {
  const now = dateToNumber(new Date());
  const activeArray: Array<TJobTime> = [];
  activeMap.forEach((value, key) => {
    activeArray.push({
      application: key,
      active_time: value.tick * tickTime,
      icon: value.icon,
      path: value.path,
      day: now,
    });
  });
  const sql = `INSERT INTO ${TABLE_NAME} (application, active_time, icon, path, day) VALUES ${activeArray
    .map(
      (active) =>
        `('${active.application}', ${active.active_time}, '${active.icon}', '${active.path}', ${active.day})`,
    )
    .join(',')}`;
  instance.run(sql, () => {
    activeMap.clear();
  });
};

const combine = (jobs: Array<TJobTime>): Array<TJob> => {
  const combined = new Map();
  jobs.forEach((job) => {
    if (combined.has(job.application)) {
      const saved = combined.get(job.application);
      saved.active_time += job.active_time;
    } else {
      combined.set(job.application, job);
    }
  });

  const result: Array<TJob> = [];
  combined.forEach((value) => {
    const { application, active_time, icon, path: vPath } = value;
    result.push({ application, active_time, icon, path: vPath });
  });

  return result;
};

const getAll = (): Promise<Array<TJob>> => {
  return new Promise((resolve, reject) => {
    return instance.all(
      `SELECT application, active_time, icon, path, day FROM ${TABLE_NAME}`,
      (err, rows: Array<TJobTime>) => {
        if (err) {
          return reject(err);
        }
        return resolve(combine(rows));
      },
    );
  });
};

/**
 * 해당 날짜의 활동 정보
 * @param { Date } day 원하는 날짜
 * @returns { Array<Job> }
 */

const getByDay = (day: Date): Promise<Array<TJob>> => {
  const target = dateToNumber(day);

  return new Promise((resolve, reject) => {
    return instance.all(
      `SELECT application, active_time, icon, path, day FROM ${TABLE_NAME} WHERE day = ${target}`,
      (err, rows: Array<TJobTime>) => {
        if (err) {
          return reject(err);
        }
        return resolve(combine(rows));
      },
    );
  });
};

/**
 * 최근 7일간의 활동 정보
 * @returns { Array<Job> }
 */
const getRecentWeek = (): Promise<Array<TJob>> => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);

  const target = dateToNumber(weekAgo);

  return new Promise((resolve, reject) => {
    return instance.all(
      `SELECT application, active_time, icon, path, day FROM ${TABLE_NAME} where day >= ${target}`,
      (err, rows: Array<TJobTime>) => {
        if (err) {
          return reject(err);
        }
        return resolve(combine(rows));
      },
    );
  });
};

/**
 * 최근 7일간의 활동 정보 (요일별)
 * @returns { Array<Job> }
 */
const getRecentDayOfWeek = (): Promise<Array<TJob>> => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);

  const target = dateToNumber(weekAgo);

  return new Promise((resolve, reject) => {
    return instance.all(
      // substr('20231103', 5, 2) || '월' || substr('20231103', 7, 2) || '일'
      `SELECT substr(day,5,2) || '월' || substr(day,7,2) || '일' as day, round(sum(active_time) / 3600.0 ,1) as time FROM ${TABLE_NAME} where day >= ${target} group by day`,
      (err, rows: Array<TJobTime>) => {
        if (err) {
          return reject(err);
        }
        return resolve(rows);
      },
    );
  });
};

/**
 * 지난주 사용시간 합
 * @returns { Array<Job> }
 */
const getSumTimeofLastWeek = (): Promise<Array<TJob>> => {
  const weekAgo = new Date();
  const start = new Date();
  const end = new Date();
  start.setDate(weekAgo.getDate() - 13);
  end.setDate(weekAgo.getDate() - 6);
  const targetStart = dateToNumber(start);
  const targetEnd = dateToNumber(end);
  return new Promise((resolve, reject) => {
    return instance.all(
      // substr('20231103', 5, 2) || '월' || substr('20231103', 7, 2) || '일'
      // `SELECT round(avg(active_time) / 3600.0 ,1) as time FROM ${TABLE_NAME} where day >= ${start} and day < ${end}`
      `SELECT round(sum(active_time) / 3600.0 ,1) as time FROM ${TABLE_NAME} where day >= ${targetStart} and day < ${targetEnd}`,
      (err, rows: Array<TJobTime>) => {
        if (err) {
          return reject(err);
        }
        return resolve(rows);
      },
    );
  });
};

/**
 * 최근 7일간의 활동 정보를 application별로 반환
 */
type TJobTimePerApplication = {
  application: string;
  active_time: number;
  icon: string;
};
const getRecentWeekPerApplication = (): Promise<
  Array<TJobTimePerApplication>
> => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);

  const target = dateToNumber(weekAgo);

  return new Promise((resolve, reject) => {
    return instance.all(
      `SELECT application, sum(active_time) as sum_of_active_time, icon FROM ${TABLE_NAME} where day >= ${target} group by application order by sum_of_active_time desc`,
      (err, rows: Array<TJobTimePerApplication>) => {
        if (err) {
          return reject(err);
        }
        return resolve(rows);
      },
    );
  });
};

export {
  insertAll,
  getAll,
  getByDay,
  getRecentWeek,
  getRecentDayOfWeek,
  getRecentWeekPerApplication,
  getSumTimeofLastWeek,
};
