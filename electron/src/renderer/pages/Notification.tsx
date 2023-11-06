/* eslint-disable react/self-closing-comp */
import * as S from '../components/notification/Notification.style';
import MailBox from '../components/notification/MailBox';
import { useState, useEffect } from 'react';


type TMail = {
  seq: number;
  from: string;
  date: Date;
  subject: string;
  content: string;
}

function Notification() {
  const { ipcRenderer } = window.electron;
  const [mails, setMails] = useState<Array<any>>( [] );

  ipcRenderer.on('mailSending', (mails)=>{
    // 메일이 수신 된 경우
    console.log("수신 완료!!!!!!!", mails);
    // let match = mails.filter((m)=>m.seq == mail.seq);
    // let temp = [...mails, mail];

    // if(match.length == 0){
    //   setMails(temp);
    // }

  });


  var moment = require('moment');
  require('moment-timezone');
  moment.tz.setDefault("Asia/Seoul");
  useEffect(()=>{
    console.log("notificdation hook:", mails);
  }, [mails])

  // const [mails, setMails] = useState<TMail[]>([]);
  // 메일들을 받아온 후 Mail의 props로 넘겨주기
  useEffect(()=>{
    window.electron.ipcRenderer.sendMessage('mailRequest');
    console.log("SUB WINDOW!!!!!!!!!!!!")
    console.log("Notification mails: ", mails);
  }, []);


  window.electron.ipcRenderer.sendMessage('size', { width: 500, height: 400 });
  return (
    <S.Wrapper>
      <MailBox mails={mails} setMails={setMails}></MailBox>
    </S.Wrapper>
  );
}

export default Notification;
