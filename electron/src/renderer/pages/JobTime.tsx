/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react';
import * as S from '../components/jobtime/JobTime.style';

function JobTime() {
  const { ipcRenderer } = window.electron;
  const [dayJobTime, setDayJobTime] = useState<Array<any>>([]);

  ipcRenderer.on('test', (v) => {
    setDayJobTime(v);
  });

  useEffect(() => {
    ipcRenderer.sendMessage('size', { width: 400, height: 300 });
    ipcRenderer.sendMessage('test', 'HI!!!');
  }, [ipcRenderer]);

  return (
    <S.Wrapper>
      {dayJobTime.map((job) => {
        return (
          <div>
            <div>
              <img src={job.icon} width={30} height={30} />
              {job.application.substr(0, 16)} - {job.active_time}초
            </div>
          </div>
        );
      })}
    </S.Wrapper>
  );
}

export default JobTime;
