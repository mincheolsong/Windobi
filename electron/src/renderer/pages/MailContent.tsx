/* eslint-disable react/self-closing-comp */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as S from '../components/notification/MailContent.style';

function MailContent() {
  const { ipcRenderer } = window.electron;
  const location = useLocation();
  const { mail } = location.state;

  useEffect(() => {
    ipcRenderer.sendMessage('windowOpened');
    ipcRenderer.sendMessage('size', { width: 300, height: 400 });
  }, []);

  if (!mail) {
    return <h2>Not</h2>;
  }
  return (
    <S.Wrapper>
      <S.From>
        <S.Text width="17%" size="10px" bold="">
          보낸사람
        </S.Text>
        <S.Sender>
          <S.SenderText>{mail.from}</S.SenderText>
        </S.Sender>
      </S.From>
      <S.Line />
      <S.Subject>
        <S.Text width="100%" size="14px" bold="bold">
          {mail.subject}
        </S.Text>
        <S.Time>
          {mail.date === undefined || mail.date === null
            ? ''
            : mail.date.toLocaleString()}
        </S.Time>
      </S.Subject>
      <S.Line />
      <S.Content>{mail.content}</S.Content>
    </S.Wrapper>
  );
}

export default MailContent;
