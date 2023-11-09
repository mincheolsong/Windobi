import { useEffect, useState } from 'react';
import * as S from '../../../src/renderer/components/myEmail/RegistEmail.style';

function RegistEmail() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('@example.com');
  const domains = ['naver.com', 'daum.net'];

  const handleDomainChange = (event) => {
    setDomain(event.target.value);
  };

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('size', {
      width: 500,
      height: 400,
    });
  }, []);

  return (
    <S.Container>
      <S.InputContainer>
        아이디:{' '}
        <S.InputField type="text" value={id} onChange={(e) => setId(e.target.value)} />
        @
        <S.Select onChange={handleDomainChange} value={domain}>
          {domains.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </S.Select>
      </S.InputContainer>
      <S.InputContainer>
        비밀번호:{' '}
        <S.InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </S.InputContainer>
      <S.ButtonContainer>
        <S.Button>검증하기</S.Button>
        <S.Button>등록하기</S.Button>
      </S.ButtonContainer>
    </S.Container>
  );
}
export default RegistEmail;
