import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import naverImage from '../../../assets/naver.png';
import daumImage from '../../../assets/daum.png';
import * as S from '../components/myEmail/MailBox.style';

type THost = 'imap.naver.com' | 'imap.daum.net';

type TEmail = {
  id: string;
  host: THost;
  img: string;
};

type TResponse = Pick<TEmail, 'id' | 'host'>;

function MyEmail() {
  const { ipcRenderer } = window.electron;
  const [emails, setEmails] = useState<Array<TEmail>>([]);

  const hostToImage = {
    'imap.daum.net': daumImage,
    'imap.naver.com': naverImage,
  };

  const navigate = useNavigate();
  useEffect(() => {
    ipcRenderer.sendMessage('windowOpened');
    ipcRenderer.sendMessage('size', { width: 500, height: 400 });

    const getEmails = async () => {
      const registedMails: Array<TResponse> =
        await ipcRenderer.invoke('accountRequest');

      const containImage = registedMails.map((mail) => {
        return {
          ...mail,
          img: hostToImage[mail.host],
        };
      });

      setEmails(containImage);
    };

    getEmails();
  }, []);

  const handleDeleteEmail = (email: TEmail) => {
    // 이메일 삭제 로직 구현
    ipcRenderer.sendMessage('accountDelete', email);
    setEmails((prevMails) =>
      prevMails.filter((m) => m.id !== email.id || m.host !== email.host),
    );
  };
  return (
    <S.Container>
      {emails.length > 0 &&
        emails.map((email) => (
          <S.Wrapper key={email.id}>
            <S.Icon src={email.img} alt="email logo" />
            <span>{email.id}</span>
            <S.DeleteButton onClick={() => handleDeleteEmail(email)}>
              삭제
            </S.DeleteButton>
          </S.Wrapper>
        ))}
      <S.Button
        onClick={() => {
          navigate('/registemail');
        }}
      >
        이메일 등록
      </S.Button>
    </S.Container>
  );
}
export default MyEmail;
