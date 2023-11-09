import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import naverImage from '../../../assets/naver.png';
import defaultImage from '../../../assets/icon.png';
import * as S from '../components/myEmail/MailBox.style';

function MyEmail() {
  const navigate = useNavigate();
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('size', {
      width: 500,
      height: 400,
    });
  }, []);

  // 이메일 도메인에 따른 이미지 가져오기
  const getEmailImage = (email: String) => {
    if (email.endsWith('@naver.com')) {
      return naverImage;
    }
    if (email.endsWith('@gmail.com')) {
      return defaultImage;
    }
    return defaultImage;
  };
  const emails = [
    'wlgns1718@naver.com',
    'wlgnsl1718@gmail.com',
    'asd',
    'asd',
    'asd',
    'asd',
    'asd',
    'asd',
    'asd',
    'asd',
    'asd',
    'asd',
    'asd',
  ];

  const handleDeleteEmail = (email: String) => {
    // 이메일 삭제 로직 구현
    // console.log(email);
  };
  return (
    <S.Container>
      {emails.map((email) => (
        <S.Wrapper key={email}>
          <S.Icon src={getEmailImage(email)} alt="email logo" />
          <span>{email}</span>
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
