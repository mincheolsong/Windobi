import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from '../components/myEmail/RegistEmail.style';

function RegistEmail() {
  const { ipcRenderer } = window.electron;
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('naver.com');
  const [message, setMessage] = useState('');
  const domains = ['naver.com', 'daum.net'];

  const navigate = useNavigate();
  const handleDomainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDomain(event.target.value);
  };

  const inserton = () => {
    const email = {
      id,
      password,
      main_email: false,
      host: domain === 'naver.com' ? 'imap.naver.com' : 'imap.daum.net',
    };

    ipcRenderer.sendMessage('accountSave', email);
  };

  useEffect(() => {
    ipcRenderer.sendMessage('windowOpened');
    ipcRenderer.sendMessage('size', {
      width: 380,
      height: 220,
    });

    ipcRenderer.on('accountSave', (result) => {
      if (result.code === '200') {
        navigate(-1);
        // 메일 리스너 돌아가기
      } else if (result.code === '400') {
        setMessage('중복된 이메일 입니다');
        // alert("중복된 이메일 입니다.");
      } else if (result.code === '401') {
        setMessage('인증 오류입니다');
        // alert("인증 오류입니다.");
      }
    });
  }, []);

  return (
    <S.Container>
      <S.InputContainer>
        아이디
        <S.InputField
          type="text"
          onChange={(e) => setId(e.target.value)}
          placeholder="email"
          style={{ marginLeft: '21px' }}
        />
        @
        <S.InputSelect onChange={handleDomainChange} value={domain}>
          {domains.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </S.InputSelect>
      </S.InputContainer>
      <S.InputContainer>
        비밀번호
        <S.InputField
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="●●●●●●"
        />
      </S.InputContainer>
      {message && <S.Message>{message}</S.Message>}
      <S.ButtonContainer>
        <S.Button onClick={inserton}>등록하기</S.Button>
      </S.ButtonContainer>
    </S.Container>
  );
}
export default RegistEmail;
