/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from 'react';
import * as S from '../components/character/Character.style';
import CharacterImg from '../components/character/CharacterImg';

function Chracter() {
  const { ipcRenderer } = window.electron;

  const canRightClick = useRef<boolean>(true);

  const isShortHold = useRef<boolean>(false); // 짧은 클릭인지 확인
  const holdLeftClickId = useRef<TimeoutId>(null); // 길게 누르는 클릭인지 확인

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 0) {
      // 좌클릭인 경우

      // 켜져있던 메뉴는 끄기
      ipcRenderer.sendMessage('hide-menu');
      // 좌클릭을 때기 전까지 우클릭은 막기
      canRightClick.current = false;
      if (holdLeftClickId.current !== null) {
        clearTimeout(holdLeftClickId.current);
      }

      // 일단 짧게 누르는 거라고 표시해놓고
      isShortHold.current = true;

      // 좌클릭 길게 누르고 있을 때 발동
      holdLeftClickId.current = setTimeout(() => {
        isShortHold.current = false; // 일단 짧은 좌클릭은 아니라고 표시

        ipcRenderer.sendMessage('start-drag');
        ipcRenderer.sendMessage('stopMoving');
      }, 150);
    } else if (e.button === 2) {
      // 우클릭인 경우

      // 우클릭을 못하는 상태이면 아무것도 하지 않는다
      if (!canRightClick.current) return;

      ipcRenderer.sendMessage('show-menu');
      ipcRenderer.sendMessage('stopMoving');
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 0) {
      if (holdLeftClickId.current !== null) {
        clearTimeout(holdLeftClickId.current);
        holdLeftClickId.current = null;
      }

      // 짧게 누르는 경우이면
      if (isShortHold.current) {
        ipcRenderer.sendMessage('stopMoving');
        ipcRenderer.sendMessage('character-left-click');
      }
      // 길게 누르고 있던 경우이면
      else {
        ipcRenderer.sendMessage('stop-drag');
        ipcRenderer.sendMessage('restartMoving');
      }

      // 좌클릭을 놓는 경우 -> 우클릭 가능하게 바꾸기
      canRightClick.current = true;
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.buttons !== 1) {
      // 좌클릭이 눌려있지 않으면
      if (holdLeftClickId.current !== null) {
        // 만약 제대로 좌클릭이 떼어진 상태가 발동안되었으면
        ipcRenderer.sendMessage('stop-drag');
        ipcRenderer.sendMessage('restartMoving');
        holdLeftClickId.current = null;
      }
    }
  };

  return (
    <S.Wrapper
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <CharacterImg />
    </S.Wrapper>
  );
}

export default Chracter;
