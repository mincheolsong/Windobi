/* eslint-disable class-methods-use-this */
/* eslint-disable no-promise-executor-return */
/* eslint-disable camelcase */
const sqlite3 = require('sqlite3').verbose();
const path = require('node:path');
const fs = require('fs');

/**
 * @typedef { {
 *  sub_application: string,
 *  active_time: string,
 *  day: number
 * } } SubJob
 */

const RESOURCES_PATH =
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../../assets')
    : path.join(__dirname, '../../../assets');

const DB_FILE = path.join(RESOURCES_PATH, 'sub_job_time.db');

const TABLE_NAME = 'sub_job_time';

class SubJobTimeDB {
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
        sub_application TEXT,
        active_time INTEGER,
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
   * @param {Map<string, Map<string, number>>} activeMap
   * @param {number} tickTime
   */
  insertAll(activeMap, tickTime) {
    const now = this.dateToNumber(new Date());
    const activeArray = [];
    activeMap.forEach((subMap, application) => {
      subMap.forEach((tick, sub_application) => {
        activeArray.push({
          application,
          sub_application,
          active_time: tick * tickTime,
          day: now,
        });
      });
    });

    const sql = `INSERT INTO ${TABLE_NAME} (application, sub_application, active_time, day) VALUES ${activeArray
      .map(
        (active) =>
          `('${active.application}', '${active.sub_application}', ${active.active_time}, ${active.day})`,
      )
      .join(',')}`;
    this.db.run(sql, () => {
      activeMap.clear();
    });
  }

  combine(jobs) {
    const combined = new Map();
    jobs.forEach((job) => {
      if (combined.has(job.sub_application)) {
        const saved = combined.get(job.sub_application);
        saved.active_time += job.active_time;
      } else {
        combined.set(job.sub_application, job);
      }
    });

    const result = [];
    combined.forEach((value) => {
      const { sub_application, active_time } = value;
      result.push({ sub_application, active_time });
    });

    return result;
  }

  /**
   *
   * @param { string } application application이름
   * @param { Date } day 해당 날짜
   * @returns { Array<SubJob> }
   */
  getByDay(application, day) {
    const target = this.dateToNumber(day);

    return new Promise((resolve, reject) => {
      return this.db.all(
        `SELECT sub_application, active_time, day FROM ${TABLE_NAME} WHERE day = ${target} AND application = '${application}'`,
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
   * 오늘을 기준으로 최근 7일간의 활동 정보
   * @param { string } application application 이름
   * @returns { Array<SubJob> }
   */
  getRecentWeek(application) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);

    const target = this.dateToNumber(weekAgo);

    return new Promise((resolve, reject) => {
      return this.db.all(
        `SELECT sub_application, active_time, day FROM ${TABLE_NAME} where day >= ${target} AND application = '${application}'`,
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

const dbInstance = new SubJobTimeDB();

module.exports = {
  dbInstance,
};
