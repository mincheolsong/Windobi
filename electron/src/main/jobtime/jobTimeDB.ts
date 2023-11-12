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

const TABLE_NAME = 'job_time';
const dateToNumber = (date: Date) => {
  const numberDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
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

const combine = (jobs: Array<TJobTime>) => {
  const combined = new Map();
  jobs.forEach((job) => {
    if (combined.has(job.application)) {
      const saved = combined.get(job.application);
      saved.active_time += job.active_time;
    } else {
      combined.set(job.application, job);
    }
  });

  const result: Array<Omit<TJobTime, 'day'>> = [];
  combined.forEach((value) => {
    const { application, active_time, icon, path: vPath } = value;
    result.push({ application, active_time, icon, path: vPath });
  });

  return result;
};

const getAll = (): Promise<Array<Omit<TJobTime, 'day'>>> => {
  return new Promise((resolve, reject) => {
    return instance.all(
      `SELECT application, active_time, icon, path, day FROM ${TABLE_NAME}`,
      (err, rows) => {
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
const getByDay = (day: Date): Promise<Array<Omit<TJobTime, 'day'>>> => {
  const target = dateToNumber(day);

  return new Promise((resolve, reject) => {
    return instance.all(
      `SELECT application, active_time, icon, path, day FROM ${TABLE_NAME} WHERE day = ${target}`,
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        return resolve(combine(rows));
      },
    );
  });
};

//   /**
//    * 최근 7일간의 활동 정보
//    * @returns { Array<Job> }
//    */
const getRecentWeek = (): Promise<Array<Omit<TJobTime, 'day'>>> => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);

  const target = dateToNumber(weekAgo);

  return new Promise((resolve, reject) => {
    return instance.all(
      `SELECT application, active_time, icon, path, day FROM ${TABLE_NAME} where day >= ${target}`,
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        return resolve(combine(rows));
      },
    );
  });
};

export { insertAll, getAll, getByDay, getRecentWeek };
