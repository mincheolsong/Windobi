const { parentPort } = require('worker_threads');
const { ActiveWindow } = require('@paymoapp/active-window');
const sqlite3 = require('sqlite3').verbose();
const path = require('node:path');

const TABLE_NAME = 'job_time';
const TICK_TIME = 1; // TIME_TICK당 한번씩 사용중인 프로그램을 수집

const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  db.run(
    `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application TEXT,
      active_time INTEGER,
      icon TEXT,
      day INTEGER
    )`,
  );
});

const activeMap = new Map();

setInterval(() => {
  const activeWindow = ActiveWindow.getActiveWindow();

  const { application, icon } = activeWindow;
  if (activeMap.has(application)) {
    const { tick: savedTick, savedIcon } = activeMap.get(application);
    activeMap.set(application, { tick: savedTick + 1, icon: savedIcon });
  } else {
    activeMap.set(application, { tick: 1, icon });
  }
}, TICK_TIME * 1000);

setInterval(
  () => {
    const now = new Date();
    const curr =
      now.getFullYear() * 10000 + now.getMonth() * 100 + now.getDate();
    const activeArray = [];
    activeMap.forEach((value, key) => {
      activeArray.push({
        application: key,
        // icon: value.icon,
        active_time: value.tick * TICK_TIME,
        icon: 'base64 image',
        day: curr,
      });
    });

    const sql = `INSERT INTO ${TABLE_NAME} (application, active_time, icon, day) VALUES ${activeArray
      .map(
        (active) =>
          `('${active.application}', ${active.active_time}, '${active.icon}', ${active.day})`,
      )
      .join(',')}`;
    db.run(sql);
  },
  TICK_TIME * 1000 * 5,
); // 30TICK에 한번 DB에 저장을 수행

db.run(`select * from ${TABLE_NAME}`, (result) => {
  console.log(`Result : ${result}`);
});
