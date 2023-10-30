/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react';
import ReactSwitch from 'react-switch';
import * as S from '../components/jobtime/JobTime.style';
import BarChart from '../components/jobtime/BarChart';

type TType = 'daily' | 'weekly';

function JobTime() {
  const [dailyJobs, setDailyJobs] = useState<Array<any>>([]);
  const [weeklyJobs, setWeeklyJobs] = useState<Array<any>>([]);
  const [type, setType] = useState<boolean>(true);
  const [stringType, setStringType] = useState<TType>(
    type ? 'daily' : 'weekly',
  );

  useEffect(() => {
    const { ipcRenderer } = window.electron;
    ipcRenderer.sendMessage('size', { width: 400, height: 300 });

    ipcRenderer.on('job-time', ({ type, result }) => {
      if (type === 'day') {
        setDailyJobs(result);
      } else if (type === 'week') {
        setWeeklyJobs(result);
      }
    });
    ipcRenderer.sendMessage('job-time', 'day');
    ipcRenderer.sendMessage('job-time', 'week');

    const timerId = setInterval(() => {
      ipcRenderer.sendMessage('job-time', 'day');
    }, 1000 * 10);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    setStringType(type ? 'daily' : 'weekly');
  }, [type]);

  return (
    <S.Wrapper>
      <ReactSwitch
        checked={type}
        onChange={setType}
        onColor="#428df5"
        offColor="#7ad2f5"
        checkedIcon={<S.TypeText>일간</S.TypeText>}
        uncheckedIcon={<S.TypeText>주간</S.TypeText>}
      />
      <BarChart
        dailyJobs={dailyJobs}
        weeklyJobs={weeklyJobs}
        type={stringType}
      />
    </S.Wrapper>
  );
}

export default JobTime;
