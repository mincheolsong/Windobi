import { BrowserWindow } from 'electron';
import Imap from 'imap'
// const Imap = require('imap');
const MailParser = require("mailparser").MailParser;

// 메일 하나를 담당하는 클래스
class Mail {
  seq: number;
  from: string;
  date: Date;
  subject: string;
  content: string;

  constructor(seq: number, from: string, date: Date, subject: string, content: string) {
    this.seq = seq;
    this.from = from;
    this.date = date;
    this.subject = subject;
    this.content = content;
  }
}

// 아이디와 패스워드를 어떻게 암호화할것인가?
// crypto module!!
let mails: [] = [];
let received: [] | null = null;
function getMails(mainWindow: BrowserWindow, subWindow: BrowserWindow, r: [], allMails: [], user: string, password: string, host: string) {
  received = r;
  // console.log("dd");

  var imap = new Imap({
    user,
    password,
    host,
    port: 993,
    tls: true
  }); // imap 설정

  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  imap.on('ready', function () { // 준비된 경우
    openInbox(function (err, box) {
      if (err) throw err;

      var f = imap.seq.fetch(box.messages.total - 2 + ':' + box.messages.total, { bodies: [''] }); // 메일을 총 3개 받아오기
      f.on('message', processMessage, mails); // 메시지 처리 부분

      f.on('error', function (err) {
        console.log('Fetch error: ' + err);
      });

      f.on('end', function () {
        // console.log('Done fetching all messages!');
        imap.end(); // 연결 종료 호출
      });
    });
  });

  imap.on('error', function (err) {
    console.log(err);
  });

  imap.on('end', function () { //연결이 종료 되는 부분
    for (let i = 0; i < mails.length; ++i) {
      let match = received.filter((m) => m.seq === mails[i].seq) // 방금 받은 메일과 원래 있는 메일 겹침 여부 확인

      if (match.length === 0) {
        // 메일 받은 경우 !! 이벤트 발생
        mainWindow.webContents.send('mailReceiving', mails[i]); // 알림을 위해서
        subWindow.webContents.send('mailReceiving', mails[i]); // 갱신을 위해서
        allMails.push(mails[i]);
        // console.log("sending:", mails[i]);
      }
    }

    for (let i = 0; i < mails.length; ++i) {
      received[i] = mails[i];
    }
    mails = [];
    // console.log('Connection ended');
  });


  console.log("connect");
  imap.connect();
}

function processMessage(msg, seqno) {
  // console.log("seqno", seqno);
  let mail = new Mail(seqno); // 저장할 메일 객체 생성
  mails.push(mail); // 저장할 리스트에 삽입

  var parser = new MailParser(); // 메일을 파싱할 라이브러리
  parser.on("headers", function (headers) {
    let mail = mails.filter((mail) => mail.seq == seqno)[0]; // 리스트에서 해당 seq 메일을 찾기

    mail.from = headers.get('from').text;
    mail.date = headers.get('date');
    mail.subject = headers.get('subject');
  });

  parser.on('data', data => {
    if (data.type === 'text') {
      let mail = mails.filter((mail) => mail.seq == seqno)[0]; // 리스트에서 해당 seq 메일을 찾기
      mail.content = data.text;
    }
  });

  msg.on("body", function (stream) {
    stream.on("data", function (chunk) {
      parser.write(chunk.toString("utf8"));
    });
  });

  msg.on("end", function () {
    parser.end();
  });
}


export default getMails;




