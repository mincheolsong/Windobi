/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-promise-executor-return */
const sqlite3 = require('sqlite3').verbose();
const path = require('node:path');
const fs = require('fs');
const { app } = require('electron');

/**
 * @typedef {{
 *  application : string,
 *  active_time : number,
 *  icon : string,
 *  path : string,
 *  day : number
 * }} Job
 *
 */

const RESOURCES_PATH =
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../../assets')
    : path.join(__dirname, '../../../assets');

const DB_FILE = path.join(RESOURCES_PATH, 'database.db');

const TABLE_NAME = 'job_time';

class JobTimeDB {
  init() {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, '');
    }
    this.db = new sqlite3.Database(DB_FILE);
  }

  createTable() {
    this.db.run(
      `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application TEXT,
        active_time INTEGER,
        icon TEXT,
        path TEXT,
        day INTEGER
      )`,
    );
  }

  dateToNumber(day) {
    const numberDate =
      day.getFullYear() * 10000 + (day.getMonth() + 1) * 100 + day.getDate();
    return numberDate;
  }

  /**
   *
   * @param {Map<string, {tick: number, icon: string, path: string}>} activeMap
   * @param {number} tickTime
   */
  insertAll(activeMap, tickTime) {
    const now = this.dateToNumber(new Date());
    const activeArray = [];
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
    this.db.run(sql, (err) => {
      activeMap.clear();
    });
  }

  combine(jobs) {
    const combined = new Map();
    jobs.forEach((job) => {
      if (combined.has(job.application)) {
        const saved = combined.get(job.application);
        saved.active_time += job.active_time;
      } else {
        combined.set(job.application, job);
      }
    });

    const result = [];
    combined.forEach((value) => {
      const { application, active_time, icon, path: vPath } = value;
      result.push({ application, active_time, icon, path: vPath });
    });

    return result;
  }

  /**
   * 모든 정보 받아오기
   * @returns { Array<Job> }
   */
  getAll() {
    return new Promise((resolve, reject) => {
      return this.db.all(
        `SELECT application, active_time, icon, path, day FROM ${TABLE_NAME}`,
        (err, rows) => {
          if (err) {
            return reject(err);
          }
          return resolve(this.combine(rows));
        },
      );
    });
  }

  /**
   * 해당 날짜의 활동 정보
   * @param { Date } day 원하는 날짜
   * @returns { Array<Job> }
   */
  getByDay(day) {
    const target = this.dateToNumber(day);

    return new Promise((resolve, reject) => {
      return this.db.all(
        `SELECT application, active_time, icon, path, day FROM ${TABLE_NAME} WHERE day = ${target}`,
        (err, rows) => {
          if (err) {
            return reject(err);
          }
          return resolve(this.combine(rows));
        },
      );
    });
  }

  /**
   * 최근 7일간의 활동 정보
   * @returns { Array<Job> }
   */
  getRecentWeek() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);

    const target = this.dateToNumber(weekAgo);

    return new Promise((resolve, reject) => {
      return this.db.all(
        `SELECT application, active_time, icon, path, day FROM ${TABLE_NAME} where day >= ${target}`,
        (err, rows) => {
          if (err) {
            return reject(err);
          }
          return resolve(this.combine(rows));
        },
      );
    });
  }
}

const dbInstance = new JobTimeDB();

module.exports = {
  dbInstance,
};
