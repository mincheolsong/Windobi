/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react';
import * as S from '../components/jobtime/JobTime.style';
import BarChart from '../components/jobtime/BarChart';

type TType = 'daily' | 'weekly';

function JobTime() {
  const [dailyJobs, setDailyJobs] = useState<Array<any>>([]);
  const [weeklyJobs, setWeeklyJobs] = useState<Array<any>>([]);
  const [type, setType] = useState<TType>('daily');

  useEffect(() => {
    const { ipcRenderer } = window.electron;
    ipcRenderer.on('job-time', ({ type, result }) => {
      if (type === 'day') {
        setDailyJobs(result);
      } else if (type === 'week') {
        setWeeklyJobs(result);
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
      <BarChart dailyJobs={dailyJobs} weeklyJobs={weeklyJobs} />
    </S.Wrapper>
  );
}

export default JobTime;
