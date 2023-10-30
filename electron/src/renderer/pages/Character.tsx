import { useEffect, useState } from 'react';
import * as S from '../components/character/Character.style';
import Menu from '../components/character/Menu';
import CharacterImg from '../components/character/CharacterImg';

function Chracter() {
  const [index, setIndex] = useState<number>(0);

  window.electron.ipcRenderer.on('windowMoveDone', () => {
    window.electron.ipcRenderer.sendMessage('windowMoveDone');
  });

  useEffect(() => {
    console.log('Main Window');
  }, []);

  let mouseX;
  let mouseY;
  let isMove = false;

  const numOfMenu = 8;

  const keyEvent = (e: KeyboardEvent) => {
    if (
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowDown' ||
      e.key === 'a' ||
      e.key === 's'
    ) {
      setIndex((prev) => (numOfMenu + (prev - 1)) % numOfMenu);
    } else if (
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'd' ||
      e.key === 'w'
    ) {
      setIndex((prev) => (numOfMenu + (prev + 1)) % numOfMenu);
    }
  };

  // 캐릭터를 오른쪽 클릭하면 메뉴를 펼침
  const rightClick = () => {
    window.electron.ipcRenderer.sendMessage('stop-move'); // 메뉴 누르면 캐릭터 이동 멈추기
    window.electron.ipcRenderer.sendMessage('toggleMenuOn', {});
  };

  const moveCharacter = (e: MouseEvent) => {
    if (isMove) {
      mouseX = e.screenX;
      mouseY = e.screenY;
      window.electron.ipcRenderer.sendMessage('windowMoving', {
        mouseX,
        mouseY,
      });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', keyEvent);
    document.addEventListener('contextmenu', rightClick);
    return () => {
      document.removeEventListener('keydown', keyEvent);
      document.removeEventListener('contextmenu', rightClick);
    };
  }, []);

  return (
    <S.Wrapper
      onMouseDown={(e) => {
        if (e.type === 'click') {
          isMove = true;
          mouseX = e.screenX;
          mouseY = e.screenY;
          window.electron.ipcRenderer.sendMessage('windowMoving', {
            mouseX,
            mouseY,
          });
        }
      }}
      onMouseUp={(e) => {
        if (e.type === 'click') {
          // 좌클릭일때만 실행
          isMove = false;
          window.electron.ipcRenderer.sendMessage('windowMoveDone');
        }
      }}
      onMouseMove={moveCharacter}
    >
      <CharacterImg />
    </S.Wrapper>
  );
}

export default Chracter;
