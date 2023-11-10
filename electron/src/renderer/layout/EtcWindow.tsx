/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './SubWindow.style';

type TEtcWindow = {
  title?: string;
  children?: React.ReactNode;
};

function EtcWindow({ title = '', children }: TEtcWindow) {
  const navigate = useNavigate();
  const { ipcRenderer } = window.electron;

  useEffect(() => {
    ipcRenderer.sendMessage('stopMoving');
  }, []);

  const onClickClose = useCallback(() => {
    navigate('/youtubeClosed');
    ipcRenderer.sendMessage('restartMoving');
  }, []);

  return (
    <S.Wrapper>
      <S.Header>
        {title}
        <S.Close onClick={onClickClose} />
      </S.Header>
      <S.Body>{children}</S.Body>
    </S.Wrapper>
  );
}

export default EtcWindow;
