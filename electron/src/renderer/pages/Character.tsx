/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import * as S from '../components/character/Character.style';
import CharacterImg from '../components/character/CharacterImg';

function Chracter() {
  const { ipcRenderer } = window.electron;
  let canRightClick = true;

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 0) {
      // 좌클릭인 경우
      canRightClick = false;
      ipcRenderer.sendMessage('start-move');
    } else if (e.button === 2) {
      // 우클릭인 경우
      if (!canRightClick) return;
      // 메뉴를 열어주자
      window.electron.ipcRenderer.sendMessage('toggleMenuOn', {});
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 0) {
      canRightClick = true;
      ipcRenderer.sendMessage('stop-move');
    }
  };

  useEffect(() => {
    console.log('Main Window');
  }, []);

  return (
    <S.Wrapper onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <CharacterImg />
    </S.Wrapper>
  );
}

export default Chracter;
