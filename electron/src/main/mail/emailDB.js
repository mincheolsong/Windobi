/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-promise-executor-return */
const sqlite3 = require('sqlite3').verbose();
const path = require('node:path');
const fs = require('fs');
const { app } = require('electron');

const RESOURCES_PATH =
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../../assets')
    : path.join(process.resourcesPath, 'assets');

const DB_FILE = path.join(RESOURCES_PATH, 'database.db');

const TABLE_NAME = 'email';

class EmailDB {
  init() {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, '');
    }
    this.db = new sqlite3.Database(DB_FILE);
  }

  createTable() {
    this.db.run(
      `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        id TEXT,
        host TEXT,
        password TEXT,
        main_email BOOLEAN,
        PRIMARY KEY (id, host)
      )`,
    );
  }

  /**
   *
   * @param {{id: string, password: string, main_email: boolean}} emailMap
   */
  insert(emailMap) {
    const sql = `INSERT INTO ${TABLE_NAME} (id, password, main_email, host) VALUES ('${emailMap.id}', '${emailMap.password}', '${emailMap.main_email}', "${emailMap.host}")`;
    this.db.run(sql, (err) => {
      console.log(err);
    });

  }


  deleteByIdAndHost(emailId, host) {
    const sql = `DELETE FROM ${TABLE_NAME} WHERE id = '${emailId}' and host = '${host}'`;
    this.db.run(sql, (err) => {
      console.log(err);
    });
  }


  /**
   * 모든 정보 받아오기
   * @returns { Array<> }
   */
  getAll() {
    return new Promise((resolve, reject) => {
      return this.db.all(
        `SELECT id, password, main_email, host FROM ${TABLE_NAME}`,
        (err, rows) => {
          if (err) {
            console.log("err:", err);
            return reject(err);
          }
          return resolve(rows);
        },
      );
    });
  }

    /**
   * 중복 확인
   * @returns { Array<> }
   */
    getAccountByIdAndHost(emailId, host) {
      return new Promise((resolve, reject) => {
        return this.db.all(
          `SELECT id FROM ${TABLE_NAME} WHERE id = '${emailId}' And host = '${host}'`,
          (err, rows) => {
            if (err) {
              console.log("err:", err);
              return reject(err);
            }
            return resolve(rows);
          },
        );
      });
    }

}
const dbInstance = new EmailDB();

module.exports = {
  dbInstance,
  EmailDB,
};
