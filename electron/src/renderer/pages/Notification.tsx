/* eslint-disable react/self-closing-comp */
import * as S from '../components/notification/Notification.style';
import MailBox from '../components/notification/MailBox';
import { useState, useEffect } from 'react';

type TMail = {
  id: string;
  title: string;
  time: Date;
  sender: string;
  content: string;
}

function Notification() {
  var moment = require('moment');
  require('moment-timezone');
  moment.tz.setDefault("Asia/Seoul");


  // 메일들을 받아온 후 Mail의 props로 넘겨주기
  const [mails, setMails] = useState<TMail[]>([]);
  useEffect(()=>{
    // 메인으로 부터 메일 받아오기
    let mail = {
      id: "1",
      title: "주식회사 아식스코리아 이용약관 & 개인정보처리방침 개정 안내",
      time: new Date(2023, 0, 23, 15, 4),
      sender: "아식스코리아 noreply-asics-korea@asics.co.kr",
      content: "asdfasdfsdaf"
    };
    let mail2 = {
      id: "2",
      title: "안녕하세요?",
      time: new Date(2023, 9, 31, 14, 10),
      sender: "hyerdd@naver.com",
      content: "asdfasdfsdaf"
    };


    setMails([mail, mail2]);
  }, []);


  window.electron.ipcRenderer.sendMessage('size', { width: 500, height: 400 });
  return (
    <S.Wrapper>
      <MailBox mails={mails} setMails={setMails}></MailBox>
    </S.Wrapper>
  );
}

export default Notification;
