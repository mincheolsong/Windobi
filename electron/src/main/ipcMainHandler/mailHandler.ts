import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'path';
import { mainWindow, subWindow } from '../windows';
import createReport from '../mail/createReport';
import getMails from '../mail/mail';
import { resolveHtmlPath } from '../util';

const cron = require('node-cron');
const nodemailer = require('nodemailer');

const received: [] = []; // 새로운 메일 수신 확인을 위해 임시로 저장하는 배열
const mailAddress = 'honeycomb201';
const mailPassword = 'ssafyssafy123';

type TMail = {
  seq: number;
  from: string;
  to: string;
  subject: string;
  host: string;
  content: string;
};

const mails: Array<TMail> = []; // 이제껏 수신한 메일들을 보관하는 배열

let timerId: IntervalId = null;

const mailHandler = () => {
  mailRequestHandler();
  deleteMailHandler();
  mailSendHandler();
  mailReceiveHandler();
  // mailTestHandler();
};

/**
 * 'mailRequest' : 메일 리퀘스트
 */
const mailRequestHandler = () => {
  ipcMain.on('mailRequest', () => {
    subWindow.webContents.send('mailRequest', mails);
  });
};

/**
 * 'deleteMail : 메일 삭제
 */
const deleteMailHandler = () => {
  ipcMain.on('deleteMail', (_event, mail) => {
    for (let i = 0; i < mails.length; ++i) {
      if (mails[i].seq === mail.seq && mails[i].to === mail.to && mails[i].host === mail.host) {
        // 해당 메일 삭제
        mails.splice(i, 1);
        return;
      }
    }
  });
};

/**
 * 일정시간마다 메일 보내기
 */
const mailSendHandler = () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.daum.net',
    secure: true, // 다른 포트를 사용해야 되면 false값을 주어야 합니다.
    // port: 587,   //다른 포트를 사용시 여기에 해당 값을 주어야 합니다.
    auth: {
      user: mailAddress,
      pass: mailPassword,
    },
  });

  const sendTime = 9;
  cron.schedule(`39 ${sendTime} * * * `, () => {
    const cur = new Date();
    createReport(cur)
      .then((res) => {
        // let receiver = 'hyerdd@naver.com';
        // let info = transporter.sendMail({
        //   from: `"${mailAddress}@daum.net"`,
        //   to: `hyerdd@naver.com`,
        //   subject: `${cur.toLocaleString()} 보고서 입니다.`,
        //   html: res,
        //   attachments: []
        // });
      })
      .catch((e) => {
        console.log(e);
      });
    // 5시마다 보고서 보내기
  });
};

/**
 * 일정시간마다 메일 받아오기
 */
const mailReceiveHandler = () => {
  timerId = setInterval(
    getMails,
    10000,
    mainWindow,
    subWindow,
    received,
    mails,
    'honeycomb201',
    'ssafyssafy123',
    'imap.daum.net',
  );
};

/**
 * 'test' : 메일 테스트
 */
const mailTestHandler = () => {
  setTimeout(async () => {
    const chartWindow = new BrowserWindow({
      width: 300,
      height: 300,
      show: false,
      transparent: true,
      focusable: false,
      frame: false,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../../.erb/dll/preload.js'),
      },
    });
    await chartWindow.loadURL(resolveHtmlPath('index.html'));
    chartWindow.webContents.openDevTools();
    chartWindow.webContents.send('sub', 'createchart');
  }, 5000);
};

export default mailHandler;
