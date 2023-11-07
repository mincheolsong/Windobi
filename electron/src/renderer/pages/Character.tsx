/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from 'react';
import * as S from '../components/character/Character.style';
import CharacterImg from '../components/character/CharacterImg';

function Chracter() {
  const { ipcRenderer } = window.electron;

  const leftClick = useRef<boolean>(true);
  const canRightClick = useRef<boolean>(true);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 0) {
      // 좌클릭인 경우
      leftClick.current = true;
      canRightClick.current = false;
      ipcRenderer.sendMessage('start-move');
      ipcRenderer.sendMessage('stopMoving');
      ipcRenderer.sendMessage('character-left-click');
    } else if (e.button === 2) {
      // 우클릭인 경우
      if (!canRightClick.current) return;
      // 메뉴를 열어주자
      window.electron.ipcRenderer.sendMessage('toggleMenuOn', {});
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 0) {
      leftClick.current = false;
      canRightClick.current = true;

      // 메뉴가 열려있지 않으면 다시 움직여주자
      ipcRenderer.sendMessage('stop-move');
      ipcRenderer.sendMessage('restartMoving');
    }
  };

  return (
    <S.Wrapper onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <CharacterImg />
    </S.Wrapper>
  );
}

export default Chracter;
