/* eslint-disable react/self-closing-comp */
import { useState, useEffect } from 'react';
import * as S from '../components/notification/Notification.style';
import MailBox from '../components/notification/MailBox';

type TMail = {
  seq: number;
  from: string;
  date: Date;
  subject: string;
  content: string;
};

function Notification() {
  const { ipcRenderer } = window.electron;
  const [mails, setMails] = useState<Array<any>>([]);

  const moment = require('moment');
  require('moment-timezone');
  moment.tz.setDefault('Asia/Seoul');

<<<<<<< HEAD
=======
  // const [mails, setMails] = useState<TMail[]>([]);
  // 메일들을 받아온 후 Mail의 props로 넘겨주기
>>>>>>> bb8b706ee81ac23e751b9f6166f6ea98c6d64ff4
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('size', {
      width: 500,
      height: 400,
    });
    const receiveRemover = ipcRenderer.on('mailReceiving', (mail: TMail) => {
      setMails([...mails, mail]);
    });

    const requestRemover = ipcRenderer.on('mailRequest', (mails: TMail[]) => {
      setMails(mails);
    });

    // 메일들을 받아온 후 Mail의 props로 넘겨주기
    window.electron.ipcRenderer.sendMessage('mailRequest');
<<<<<<< HEAD

    return () => {
      receiveRemover();
      requestRemover();
    };
=======
    ipcRenderer.once('mailReceiving', (mail: TMail) => {
      setMails([...mails, mail]);
    });

    ipcRenderer.once('mailRequest', (mails: TMail[]) => {
      setMails(mails);
    });
>>>>>>> bb8b706ee81ac23e751b9f6166f6ea98c6d64ff4
  }, []);

  return (
    <S.Wrapper>
      <MailBox mails={mails} setMails={setMails}></MailBox>
    </S.Wrapper>
  );
}

export default Notification;
