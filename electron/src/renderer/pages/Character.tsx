import { useEffect, useState } from 'react';
import * as S from '../components/character/Character.style';
import Menu from '../components/character/Menu';

function Chracter() {
  const [index, setIndex] = useState<number>(0);
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

  useEffect(() => {
    document.addEventListener('keydown', keyEvent);

    return () => {
      document.removeEventListener('keydown', keyEvent);
    };
  }, []);

  return (
    <S.Wrapper>
      <Menu index={index} />
    </S.Wrapper>
  );
}

export default Chracter;
