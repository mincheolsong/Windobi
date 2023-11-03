/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import * as S from './SubWindow.style';

type TSubWindow = {
  title?: string;
  children?: React.ReactNode;
};

function SubWindow({ title = '', children }: TSubWindow) {
  const navigate = useNavigate();

  const onClickClose = useCallback(() => {
    navigate('/closed');
  }, []);

  return (
    <S.Wrapper>
      <S.Header>
        {title}
        <S.Close onClick={onClickClose}>
          <AiOutlineClose size="22px" />
        </S.Close>
      </S.Header>
      <S.Body>{children}</S.Body>
    </S.Wrapper>
  );
}

export default SubWindow;
