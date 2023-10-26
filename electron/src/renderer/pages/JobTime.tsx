/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react';
import * as S from '../components/jobtime/JobTime.style';
import BarChart from '../components/jobtime/BarChart';

function JobTime() {
  const [dayJobTime, setDayJobTime] = useState<Array<any>>([]);
  const [weekJobTime, setWeekJobTime] = useState<Array<any>>([]);
  useEffect(() => {
    const { ipcRenderer } = window.electron;
    ipcRenderer.on('job-time', ({ type, result }) => {
      if (type === 'day') {
        setDayJobTime(result);
      } else if (type === 'week') {
        setWeekJobTime(result);
      }
    });
    ipcRenderer.sendMessage('size', { width: 400, height: 300 });
    ipcRenderer.sendMessage('job-time', 'day');
    ipcRenderer.sendMessage('job-time', 'week');

    const timerId = setInterval(() => {
      ipcRenderer.sendMessage('job-time', 'day');
    }, 1000 * 60);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <S.Wrapper>
      <BarChart jobs={dayJobTime} />
    </S.Wrapper>
  );
}

export default JobTime;
