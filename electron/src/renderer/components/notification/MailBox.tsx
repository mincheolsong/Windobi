/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import naver from '../../../../assets/naver.png';
import * as S from './Mail.style';
import Time from './Time';
import TMail from './TMail';
import { useNavigate } from 'react-router-dom';

// async function click(){
//   let a = await window.electron.ipcRenderer.invoke('test', 1);
//   alert(a);
// }



function MailBox({ mails, setMails }: { mails: TMail[], setMails: React.Dispatch<React.SetStateAction<TMail[]>>}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!mails || mails.length === 0) return;
    for (let i = 0; i < mails.length; ++i) {
      console.log(mails[i].subject);
    }
  }, [mails]);

  return (
    <>
      {mails.map((mail) => {
        return (
          <S.Wrapper key={mail.seq}>
            <S.MailWrapper>
              <S.Icon src={naver} />
              <S.Contents>
                <S.ContentsDiv>
                  <S.Sender>
                    {mail.from}
                  </S.Sender>
                  <Time
                    onClick={() => {
                      setMails((prevMails) => prevMails.filter((m) => m.seq !== mail.seq));
                    }}
                    time={mail.date}
                  />
                </S.ContentsDiv>
                <S.Title>
                  <S.Text
                    onClick={() => {
                      navigate('/jobtime');
                    }}
                  >
                    {mail.subject}
                  </S.Text>
                </S.Title>
              </S.Contents>
            </S.MailWrapper>
          </S.Wrapper>
        );
      })}
    </>
  );
}

export default MailBox;
