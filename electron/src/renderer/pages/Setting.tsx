/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from '../components/setting/Setting.style';

function Setting() {
  const navigate = useNavigate();

  const { ipcRenderer } = window.electron;

  useEffect(() => {
    ipcRenderer.sendMessage('size', { width: 300, height: 200 });
  }, []);

  return (
    <S.Wrapper>
      <S.Ul>
        <S.Li onClick={() => navigate('/changecharacter')}>캐릭터 변경</S.Li>
        <S.Li>2</S.Li>
      </S.Ul>
    </S.Wrapper>
  );
}

export default Setting;
