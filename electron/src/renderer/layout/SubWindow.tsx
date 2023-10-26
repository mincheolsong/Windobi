/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import * as S from './SubWindow.style';

type TSubWindow = {
  children: React.ReactNode;
};

function SubWindow({ children }: TSubWindow) {
  return (
    <S.Wrapper>
      <S.Body>{children}</S.Body>
    </S.Wrapper>
  );
}

export default SubWindow;
