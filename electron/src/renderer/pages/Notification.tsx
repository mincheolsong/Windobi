import * as S from '../components/notification/Notification.style';
import MailBox from '../components/notification/MailBox';
import { useState, useEffect } from 'react';

function Notification() {
  // 메일들을 받아온 후 Mail의 props로 넘겨주기

  return (
    <S.Wrapper>
      <MailBox></MailBox>
    </S.Wrapper>
  );
}


export default Notification;
