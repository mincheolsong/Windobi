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

      if (holdLeftClickId.current !== null) {
        clearTimeout(holdLeftClickId.current);
      }

      ipcRenderer.sendMessage('stopMoving');

      // 일단 짧게 누르는 거라고 표시해놓고
      isShortHold.current = true;

      // 일정시간 누르고 있을때만 움직이기 이벤트를 시작하자
      holdLeftClickId.current = setTimeout(() => {
        isShortHold.current = false;
        ipcRenderer.sendMessage('start-move');
      }, 200);

      canRightClick.current = false;
    } else if (e.button === 2) {
      // 우클릭인 경우
      if (!canRightClick.current) return;
      // 메뉴를 열어주자
      window.electron.ipcRenderer.sendMessage('toggleMenuOn', {});
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 0) {
      // 좌클릭인 경우
      canRightClick.current = true;

      if (holdLeftClickId.current !== null) {
        clearTimeout(holdLeftClickId.current);
      }

      if (isShortHold.current) {
        // 짧게 누르는 경우이면
        ipcRenderer.sendMessage('character-left-click');
      } else {
        // 길게 누르고 있던 경우이면
        ipcRenderer.sendMessage('stop-move');
      }
      ipcRenderer.sendMessage('restartMoving');

      // 메뉴가 열려있지 않으면 다시 움직여주자
    }
  };

  return (
    <S.Wrapper onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <CharacterImg />
    </S.Wrapper>
  );
}

export default Chracter;
