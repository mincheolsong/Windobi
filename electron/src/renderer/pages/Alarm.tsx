/* eslint-disable react/self-closing-comp */
import { useEffect } from 'react';
import * as S from '../components/notification/Alarm.style';

function Alarm() {
  const { ipcRenderer } = window.electron;
  useEffect(() => {
    ipcRenderer.sendMessage('stopMoving');
    ipcRenderer.sendMessage('size', { width: 300, height: 90 });
    setTimeout(() => {
      ipcRenderer.sendMessage('sub', 'closed');
      ipcRenderer.sendMessage('restartMoving');
    }, 2000);
  }, []);
  const mailReceived = '메일이 도착하였습니다.';

  return <S.Text>{mailReceived}</S.Text>;
}

export default Alarm;
