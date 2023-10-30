import * as S from '../components/notification/Notification.style';
import MailBox from '../components/notification/MailBox';
import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

function Notification() {
  // 메일들을 받아온 후 Mail의 props로 넘겨주기
  window.electron.ipcRenderer.sendMessage('size', {width: 500, height: 400});
  return (
    <S.Wrapper>
      <MailBox></MailBox>
    </S.Wrapper>
  );
}


export default Notification;
