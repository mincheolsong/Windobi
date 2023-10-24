/* eslint-disable camelcase */
/* eslint-disable no-promise-executor-return */
const sqlite3 = require('sqlite3');
const path = require('node:path');

const TABLE_NAME = 'job_time';
let db = new (sqlite3.verbose().Database)(path.join(__dirname, 'database.db'));
const init = () => {
  db = new (sqlite3.verbose().Database)(
    path.join(__dirname, 'database.db'),
    (err) => {
      db.run(
        `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application TEXT,
        active_time INTEGER,
        icon TEXT,
        day INTEGER
      )`,
        (err) => {
          if (err) {
            console.log('Error');
          } else {
            console.log('DB Initialize Success');
          }
        },
      );
    },
  );
};

const dateToNumber = (day) => {
  const numberDate =
    day.getFullYear() * 10000 + day.getMonth() * 100 + day.getDate();
  return numberDate;
};

const insertAll = (activeMap, tickTime) => {
  const now = dateToNumber(new Date());
  const activeArray = [];
  activeMap.forEach((value, key) => {
    activeArray.push({
      application: key,
      active_time: value.tick * tickTime,
      icon: value.icon,
      day: now,
    });
  });

  const sql = `INSERT INTO ${TABLE_NAME} (application, active_time, icon, day) VALUES ${activeArray
    .map(
      (active) =>
        `('${active.application}', ${active.active_time}, '${active.icon}', ${active.day})`,
    )
    .join(',')}`;
  db.run(sql, (err) => {
    activeMap.clear();
  });
};

const combine = (jobs) => {
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
    const { application, active_time, icon } = value;
    result.push({ application, active_time, icon });
  });

  return result;
};

const getAll = () => {
  return new Promise((resolve, reject) => {
    return db.all(
      `SELECT 
    application, active_time, icon, day FROM ${TABLE_NAME}`,
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        return resolve(combine(rows));
      },
    );
  });
};

const getByDay = (day) => {
  const target = dateToNumber(day);

  return new Promise((resolve, reject) => {
    return db.all(
      `SELECT application, active_time, icon, day FROM ${TABLE_NAME} WHERE day = ${target}`,
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        return resolve(combine(rows));
      },
    );
  });
};

module.exports = {
  init,
  insertAll,
  getAll,
  getByDay,
};
