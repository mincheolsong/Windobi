import { useEffect, useState } from 'react';
import * as S from '../components/character/Character.style';
import CharacterImg from '../components/character/CharacterImg';

function Chracter() {
  const { ipcRenderer } = window.electron;

  const onMouseDown = () => {
    ipcRenderer.sendMessage('start-move');
  };

  const onMouseUp = () => {
    ipcRenderer.sendMessage('stop-move');
  };

  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    console.log('Main Window');
  }, []);

  let mouseX;
  let mouseY;
  const isMove = false;

  // 캐릭터를 오른쪽 클릭하면 메뉴를 펼침
  const rightClick = () => {
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
      window.electron.ipcRenderer.sendMessage('stopMoving');
    }
  };

  useEffect(() => {
    document.addEventListener('contextmenu', rightClick);
    return () => {
      document.removeEventListener('contextmenu', rightClick);
    };
  }, []);

  return (
    <S.Wrapper onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      {/* <S.Wrapper
      onMouseDown={(e) => {
        if (e.button === 0) {
          // 왼쪽 마우스 다운
          isMove = true;
          // mouseX = e.screenX;
          // mouseY = e.screenY;
          // window.electron.ipcRenderer.sendMessage('windowMoving', {
          //   mouseX,
          //   mouseY,
          // });
        }
      }}
      onMouseUp={(e) => {
        if (e.button === 0) {
          // 왼쪽 마우스 업
          isMove = false;
          window.electron.ipcRenderer.sendMessage('restartMoving');
        }
      }}
    > */}
      <CharacterImg />
    </S.Wrapper>
  );
}

export default Chracter;
