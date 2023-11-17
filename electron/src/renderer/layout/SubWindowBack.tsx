/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import * as S from './SubWindow.style';
import * as SS from './SubWindowBack.style';

type TSubWindow = {
  title?: string;
  children?: React.ReactNode;
};

function SubWindowBack({ title = '', children }: TSubWindow) {
  const navigate = useNavigate();
  const { ipcRenderer } = window.electron;
  const onClickClose = useCallback(() => {
    navigate('/closed');
    ipcRenderer.sendMessage('restartMoving');
  }, []);
  const onClickBack = useCallback(() => {
    navigate(-1);
  }, []);
  return (
    <S.Wrapper>
      <S.Header>
        <SS.Back onClick={onClickBack}>
          <IoMdArrowBack size="30px" />
        </SS.Back>
        {title}
        <S.Close onClick={onClickClose} />
      </S.Header>
      <S.Body>{children}</S.Body>
    </S.Wrapper>
  );
}

export default SubWindowBack;
