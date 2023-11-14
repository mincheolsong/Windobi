/* eslint-disable react/self-closing-comp */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as S from '../components/notification/Alarm.style';

function Alarm() {
  const { ipcRenderer } = window.electron;
  useEffect(() => {
    ipcRenderer.sendMessage('stopMoving');
    ipcRenderer.sendMessage('size', { width: 300, height: 90 });
    setTimeout(()=>{
      ipcRenderer.sendMessage('size', {width:0, height: 0});
      ipcRenderer.sendMessage('restartMoving');
    }, 2000);
  }, []);
  let mailReceived = "메일이 도착하였습니다."

  return <S.Text>{mailReceived}</S.Text>;
}

export default Alarm;
