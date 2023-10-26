import { useEffect, useState } from 'react';
import * as S from '../components/character/Character.style';
import Menu from '../components/character/Menu';
import CharacterImg from '../components/character/CharacterImg';

function Chracter() {
  const [index, setIndex] = useState<number>(0);

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
    } else if (e.key === 'm') {
      window.electron.ipcRenderer.sendMessage('toggleMenu', {});
    }
  };

  const rightClick = () => {
    window.electron.ipcRenderer.sendMessage('toggleMenu', {});
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
      onWheel={(e) => {
        console.log(e.deltaY);
      }}
      onMouseDown={(e) => {
        isMove = true;
        mouseX = e.screenX;
        mouseY = e.screenY;
        window.electron.ipcRenderer.sendMessage('windowMoving', {
          mouseX,
          mouseY,
        });
      }}
      onMouseUp={() => {
        isMove = false;
        window.electron.ipcRenderer.sendMessage('windowMoveDone');
      }}
      onMouseMove={moveCharacter}
    >
      <CharacterImg />
    </S.Wrapper>
  );
}

export default Chracter;
