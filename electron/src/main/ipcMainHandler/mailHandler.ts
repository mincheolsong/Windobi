import { BrowserWindow, app, dialog, ipcMain } from 'electron';
import path from 'path';
import { mainWindow, subWindow } from '../windows';
import createReport from '../mail/createReport';
import { getMails, checkMail } from '../mail/mail';
import { resolveHtmlPath } from '../util';
import { dbInstance } from '../mail/emailDB';


const cron = require('node-cron');
const nodemailer = require('nodemailer');
const fs = require('fs');

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

// DB 실행
dbInstance.init();
dbInstance.createTable();

const mailHandler = () => {
  mailRequestHandler();
  deleteMailHandler();
  mailSendHandler();
  mailReceiveHandler();
  // mailTestHandler();
  chartReceivingHadler();
  accountSaveHandler();
  accountRequestHandler();
  accountDeleteHandler();
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
      if (
        mails[i].seq === mail.seq &&
        mails[i].to === mail.to &&
        mails[i].host === mail.host
      ) {
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
  // timerId 관리하기

  timerId = setInterval(
    getMails,
    60000,
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
          ? path.join(__dirname, '../preload.js')
          : path.join(__dirname, '../../../.erb/dll/preload.js'),
      },
    });
    await chartWindow.loadURL(resolveHtmlPath('index.html'));
    chartWindow.webContents.send('sub', 'createchart');
  }, 5000);
};


/**
 * 'chartReceivingHadler : 차트 이미지 수신
 */
const chartReceivingHadler = () => {
  ipcMain.on('chartChannel', (_event, chart) => {
    // 차트 이미지 수신
    // 이미지 저장하기
    let dataUrl = chart.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer = Buffer.from(dataUrl[2], 'base64');
    fs.writeFile('barChart.png', buffer, (e: any) => {
      if (!e) {
        console.log("file is created")
      }
    });

  });
};


/**
 * 'accountSaveHandler : 이메일 계정 저장 핸들러
 */
const accountSaveHandler = () => {
  ipcMain.on('accountSave', async (_event, email) => {
    // 이메일 계정 Sqlite3에서 불러오기
    // 중복체크
    let res = await dbInstance.getAccountByIdAndHost(email.id, email.host);
    if (res.length > 0) {
      _event.sender.send("accountSave", { code: "400", content: "duplicateError" });
      return;
    }

    ipcMain.on("connectSuccess", ()=>{
      // 연결이 성공한 경우
      _event.sender.send("accountSave", { code: "200", content: "success" });
      ipcMain.removeAllListeners("connectSuccess");
      dbInstance.insert(email);
      return;
    });
    ipcMain.on("connectFail", ()=>{
      // 연결이 실패한 경우 인증오류!
      _event.sender.send("accountSave", { code: "401", content: "authentication error" });
      ipcMain.removeAllListeners("connectFail");
      return;
    })
    // imap을 통해 접속확인
    checkMail(email.id, email.password, email.host);
    // console.log(check);


  });
};

/**
 * 'accountRequestHandler : 이메일 계정 정보 요청 핸들러
 */

const accountRequestHandler = () => {
  ipcMain.handle('accountRequest', async () => {
    // 이메일 계정 Sqlite3에서 불러오기
    // 이메일만 보내주기
    const result = await dbInstance.getAll();
    // console.log("Select query executed : ", result);
    return result;
  });
};

/**
 * 'accountDeleteHandler : 이메일 계정 삭제 요청 핸들러
 */

const accountDeleteHandler = () => {
  ipcMain.on('accountDelete', (_event, email) => {
    // 기존에 실행중이던 이메일 리스너 끄기

    // 이메일 계정 삭제
    dbInstance.deleteByIdAndHost(email.id, email.host);

  });

};

export default mailHandler;
