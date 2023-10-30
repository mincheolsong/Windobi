/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react';
import ReactSwitch from 'react-switch';
import * as S from '../components/jobtime/JobTime.style';
import BarChart from '../components/jobtime/BarChart';

type TType = 'daily' | 'weekly';

function JobTime() {
  const [dailyJobs, setDailyJobs] = useState<Array<any>>([]);
  const [weeklyJobs, setWeeklyJobs] = useState<Array<any>>([]);

  const [prevDay, setPrevDay] = useState<number>(0);
  const [day, setDay] = useState<Date>(new Date());
  const [type, setType] = useState<boolean>(true);
  const [stringType, setStringType] = useState<TType>(
    type ? 'daily' : 'weekly',
  );
  const dateToString = ['일', '월', '화', '수', '목', '금', '토'];

  const { ipcRenderer } = window.electron;

  useEffect(() => {
    ipcRenderer.sendMessage('size', { width: 400, height: 300 });

    ipcRenderer.on('job-time', ({ type, result }) => {
      if (type === 'day') {
        setDailyJobs(result);
      } else if (type === 'week') {
        setWeeklyJobs(result);
      }
    });
    ipcRenderer.sendMessage('job-time', 'day', new Date());
    ipcRenderer.sendMessage('job-time', 'week');

    const timerId = setInterval(() => {
      ipcRenderer.sendMessage('job-time', 'day');
    }, 1000 * 10);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    // 주간 또는 일간에 대한 boolean값을 변경해주면'
    // 이에 따라 string으로 된 type을 변경해주자
    setStringType(type ? 'daily' : 'weekly');
  }, [type]);

  useEffect(() => {
    // n일 전의 데이터를 불러오기 위해 prevDay가 바뀔때마다
    // 실제 해당 날짜를 계산해주자
    const target = new Date();
    target.setDate(target.getDate() + prevDay);
    setDay(target);
  }, [prevDay]);

  useEffect(() => {
    // 보여줘야 할 날짜가 바뀌면 데이터를 갱신받자
    ipcRenderer.sendMessage('job-time', 'day', day);
  }, [day]);

  const dayToString = (day: Date) => {
    const date = day.getDay();
    return `${day.getMonth() + 1}월 ${day.getDate()}일 (${dateToString[date]})`;
  };

  return (
    <S.Wrapper>
      <S.Header>
        <ReactSwitch
          checked={type}
          onChange={setType}
          onColor="#428df5"
          offColor="#7ad2f5"
          checkedIcon={<S.TypeText>일간</S.TypeText>}
          uncheckedIcon={<S.TypeText>주간</S.TypeText>}
        />
        <S.Left onClick={() => setPrevDay((prev) => prev - 1)} />
        {dayToString(day)}
        <S.Right
          onClick={() => setPrevDay((prev) => prev + 1)}
          disabled={prevDay === 0}
        />
      </S.Header>
      <BarChart
        dailyJobs={dailyJobs}
        weeklyJobs={weeklyJobs}
        type={stringType}
      />
    </S.Wrapper>
  );
}

export default JobTime;
