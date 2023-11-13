import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'path';
import { mainWindow, subWindow, mainVariables } from '../windows';
import createReport from '../mail/createReport';
import { getMails, checkMail } from '../mail/mail';
import { resolveHtmlPath } from '../util';
import { dbInstance } from '../mail/emailDB';

const cron = require('node-cron');
const nodemailer = require('nodemailer');
const fs = require('fs');

const receivedList: Array<Map<string, Array<any>>> = [];
// const received: [] = []; // 새로운 메일 수신 확인을 위해 임시로 저장하는 배열
const mails: Array<TMail> = []; // 이제껏 수신한 메일들을 보관하는 배열
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

// DB 실행
dbInstance.init();
dbInstance.createTable();

const mailHandler = () => {
  mailRequestHandler();
  deleteMailHandler();
  mailSendHandler();
  mailReceiveHandler();
  chartReceivingHadler();
  accountSaveHandler();
  accountRequestHandler();
  accountDeleteHandler();
  reportTestHandler();
};

/**
 * 'mailRequest' : 메일 리퀘스트
 */
const mailRequestHandler = () => {
  ipcMain.on('mailRequest', () => {
    // console.log('mails', mails);
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
  cron.schedule(`0 ${sendTime} * * * `, () => {
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
const mailReceiveHandler = async () => {
  const accounts = await dbInstance.getAll();
  console.log('accounts', accounts);
  for (let i = 0; i < accounts.length; ++i) {
    let name =
      accounts[i].id +
      (accounts[i].host === 'imap.naver.com' ? 'naver.com' : 'daum.net');
    const received = {};
    received['name'] = name;
    received['array'] = [];
    console.log(received);
    receivedList.push(received);
    const timerId: IntervalId = setInterval(
      getMails,
      10000,
      mainWindow,
      subWindow,
      receivedList,
      mails,
      accounts[i].id,
      accounts[i].password,
      accounts[i].host,
    );
    const timer = {};
    timer['key'] = name;
    timer['timerId'] = timerId;
    mainVariables.mailListners.push(timer);
    console.log(mainVariables.mailListners);
    await setTimeout(() => {}, 1000);
  }
};

const addMailListener = (id: string, password: string, host: string) => {
  const received: Array<any> = [];
  receivedList.push(received);
  const timerId: IntervalId = setInterval(
    getMails,
    10000,
    mainWindow,
    subWindow,
    received,
    mails,
    id,
    password,
    host,
  );
  const timer = {};
  let name = id + (host === 'imap.naver.com' ? 'naver.com' : 'daum.net');
  timer['key'] = name;
  timer['timerId'] = timerId;
  mainVariables.mailListners.push(timer);
};

/**
 * 'test' : 보고서 테스트
 */
const reportTestHandler = () => {
  setTimeout(async () => {
    const chartWindow = new BrowserWindow({
      width: 1400,
      height: 800,
      show: true,
      transparent: false,
      focusable: true,
      frame: false,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../../.erb/dll/preload.js'),
      },
    });
    await chartWindow.loadURL(resolveHtmlPath('index.html'));
    chartWindow.webContents.send('sub', 'createchart');
    chartWindow.webContents.toggleDevTools();
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
        console.log('file is created');
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
      _event.sender.send('accountSave', {
        code: '400',
        content: 'duplicateError',
      });
      return;
    }

    ipcMain.on('connectSuccess', () => {
      // 연결이 성공한 경우
      _event.sender.send('accountSave', { code: '200', content: 'success' });
      ipcMain.removeAllListeners('connectSuccess');
      dbInstance.insert(email);
      addMailListener(email.id, email.password, email.host);
      return;
    });
    ipcMain.on('connectFail', () => {
      // 연결이 실패한 경우 인증오류!
      _event.sender.send('accountSave', {
        code: '401',
        content: 'authentication error',
      });
      ipcMain.removeAllListeners('connectFail');
      return;
    });
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
    let name =
      email.id + (email.host === 'imap.naver.com' ? 'naver.com' : 'daum.net');
    const timer = mainVariables.mailListners.filter((m) => m.key === name);
    clearInterval(timer[0].timerId);
    console.log(timer[0].timerId, 'clear');
    // 정리 완료!
  });
};

export default mailHandler;
