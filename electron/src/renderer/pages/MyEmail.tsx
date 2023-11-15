import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import naverImage from '../../../assets/naver.png';
import daumImage from '../../../assets/daum.png';
import * as S from '../components/myEmail/MailBox.style';

function MyEmail() {
  const { ipcRenderer } = window.electron;
  const [emails, setEmails] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    ipcRenderer.sendMessage('windowOpened');
    ipcRenderer.sendMessage('size', { width: 500, height: 400 });

    const getEmails = async () => {
      const temp = await ipcRenderer.invoke('accountRequest');
      const arr = temp.map((email) => {
        switch (email.host) {
          case 'imap.naver.com':
            email.img = naverImage;
            break;
          case 'imap.daum.net':
            email.img = daumImage;
            break;
        }
      });

      setEmails(temp);
    };

    getEmails();
  }, []);

  const handleDeleteEmail = (email: String) => {
    // 이메일 삭제 로직 구현
    window.electron.ipcRenderer.sendMessage('accountDelete', email);
    setEmails((prevMails) =>
      prevMails.filter((m) => m.id !== email.id || m.host !== email.host),
    );
  };
  return (
    <S.Container>
      {emails.length > 0 &&
        emails.map((email) => (
          <S.Wrapper key={email}>
            <S.Icon src={email.img} alt="email logo" />
            <span>{email.id}</span>
            <S.DeleteButton onClick={() => handleDeleteEmail(email)}>
              삭제
            </S.DeleteButton>
          </S.Wrapper>
        ))}
      <S.button
        onClick={() => {
          navigate('/registemail');
        }}
      >
        이메일 등록하기
      </S.button>
    </S.Container>
  );
}
export default MyEmail;
