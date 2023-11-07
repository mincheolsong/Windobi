/* eslint-disable react/self-closing-comp */
import { useLocation } from 'react-router-dom';
import * as S from '../components/notification/MailContent.style';
import TMail from '../components/notification/TMail';

function MailContent() {
  const location = useLocation();
  const { mail } = location.state;

  // let mail = {
  //   seq: 1,
  //   subject: '주식회사 아식스코리아 이용약관 & 개인정보처리방침 개정 안내',
  //   date: new Date(2023, 0, 23, 15, 4),
  //   from: '아식스코리아 noreply-asics-korea@asics.co.kr',
  //   content: 'asdfasdfsdaf',
  // };

  window.electron.ipcRenderer.sendMessage('size', { width: 300, height: 400 });
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
        <S.Time>{mail.date.toLocaleString()}</S.Time>
      </S.Subject>
      <S.Line />
      <S.Content>{mail.content}</S.Content>
    </S.Wrapper>
  );
}

export default MailContent;
