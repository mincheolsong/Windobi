/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
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

  const { ipcRenderer } = window.electron;

  useEffect(() => {
    ipcRenderer.sendMessage('size', { width: 700, height: 350 });

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

  return (
    <S.Wrapper>
      <S.Half>
        <S.Header>
          <ReactSwitch
            checked={type}
            onChange={setType}
            onColor="#428df5"
            offColor="#7ad2f5"
            checkedIcon={<S.TypeText>일간</S.TypeText>}
            uncheckedIcon={<S.TypeText>주간</S.TypeText>}
          />
          {stringType === 'daily' && (
            <Selector day={day} setPrevDay={setPrevDay} prevDay={prevDay} />
          )}
        </S.Header>
        <BarChart
          dailyJobs={dailyJobs}
          weeklyJobs={weeklyJobs}
          type={stringType}
        />
      </S.Half>
      <S.Half>asdf</S.Half>
    </S.Wrapper>
  );
}

// 화살표를 통해 일간 통계를 볼때 날짜를 선택할 수 있도록 해주자
type TSelector = {
  day: Date;
  prevDay: number;
  setPrevDay: React.Dispatch<React.SetStateAction<number>>;
};

function Selector({ day, prevDay, setPrevDay }: TSelector) {
  const dateToString = ['일', '월', '화', '수', '목', '금', '토'];

  const dayToString = (targetDay: Date) => {
    const month = targetDay.getMonth() + 1;
    const date = targetDay.getDate();
    const day = dateToString[targetDay.getDay()];
    return `${month}월 ${date}일 (${day})`;
  };

  return (
    <>
      <S.Left
        onClick={() => prevDay !== -6 && setPrevDay((prev) => prev - 1)}
        disabled={prevDay === -6}
      />
      {dayToString(day)}
      <S.Right
        onClick={() => prevDay !== 0 && setPrevDay((prev) => prev + 1)}
        disabled={prevDay === 0}
      />
    </>
  );
}

export default JobTime;
