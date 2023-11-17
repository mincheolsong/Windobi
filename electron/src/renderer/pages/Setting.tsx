/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from '../components/setting/Setting.style';

function Setting() {
  const navigate = useNavigate();

  const { ipcRenderer } = window.electron;

  useEffect(() => {
    ipcRenderer.sendMessage('windowOpened');
    ipcRenderer.sendMessage('size', { width: 300, height: 300 });
  }, []);

  return (
    <S.Wrapper>
      <S.Ul>
        <S.Li onClick={() => navigate('/addcharacter')}>캐릭터 추가</S.Li>
        <S.Li onClick={() => navigate('/changecharacter')}>캐릭터 변경</S.Li>
        <S.Li onClick={() => navigate('/deletecharacter')}>캐릭터 삭제</S.Li>
      </S.Ul>
    </S.Wrapper>
  );
}

export default Setting;
