/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import * as S from './SubWindow.style';

type TSubWindow = {
  title?: string;
  children: React.ReactNode;
};

function SubWindow({ title, children }: TSubWindow) {
  return (
    <S.Wrapper>
      {title && <S.Header>{title}</S.Header>}
      <S.Body>{children}</S.Body>
    </S.Wrapper>
  );
}

export default SubWindow;
