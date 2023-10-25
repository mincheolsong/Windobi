/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react';
import * as S from '../components/jobtime/JobTime.style';
import BarChart from '../components/jobtime/BarChart';

function JobTime() {
  const [dayJobTime, setDayJobTime] = useState<Array<any>>([]);
  useEffect(() => {
    const { ipcRenderer } = window.electron;
    ipcRenderer.on('test', (jobs) => {
      setDayJobTime(jobs);
    });
    ipcRenderer.sendMessage('size', { width: 400, height: 300 });
    ipcRenderer.sendMessage('test');
  }, []);

  return (
    <S.Wrapper>
      <BarChart jobs={dayJobTime} />
    </S.Wrapper>
  );
}

export default JobTime;
