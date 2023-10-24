import { useEffect, useRef } from 'react';
import * as S from './Menu.style';

type TMenu = {
  index: number;
  numOfMenu: number;
};

function Menu({ index, numOfMenu }: TMenu) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(index);
  }, [index]);

  return (
    <S.Wrapper ref={wrapperRef}>
      <S.MenuItem>1</S.MenuItem>
      <S.MenuItem>2</S.MenuItem>
      <S.MenuItem>3</S.MenuItem>
      <S.MenuItem>4</S.MenuItem>
    </S.Wrapper>
  );
}

export default Menu;
