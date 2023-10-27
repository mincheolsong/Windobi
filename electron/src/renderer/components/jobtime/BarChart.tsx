/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useCallback } from 'react';
import * as S from './BarChart.style';

type TJob = {
  application: string;
  active_time: number;
  icon: string;
  path: string;
};

type TColor = {
  h: number;
  s: number;
  l: number;
};

interface IJobTimed extends TJob {
  timeString: string;
  color: TColor;
}
type TBarChart = {
  dailyJobs: Array<TJob>;
  weeklyJobs: Array<TJob>;
};

function BarChart({ dailyJobs, weeklyJobs }: TBarChart) {
  // const [maxTime, setMaxTime] = useState<number>(1);
  // const [ascJobs, setAscJobs] = useState<Array<IJobTimed>>([]);

  const [dailyMax, setDailyMax] = useState<number>(1);
  const [sortedDailyJobs, setSortedDailyJobs] = useState<Array<IJobTimed>>([]);

  const [weeklyMax, setWeeklyMax] = useState<number>(1);
  const [sortedweeklyJobs, setSortedWeeklyJobs] = useState<Array<IJobTimed>>(
    [],
  );

  const timeToString = (time: number) => {
    const hour = Math.floor(time / 3600);
    const minute = Math.floor((time % 3600) / 60);

    let result = '';
    result = result.concat(hour > 0 ? `${hour}시` : '');
    result = result.concat(minute > 0 ? `${minute}분` : '');

    return result;
  };

  useEffect(() => {
    if (!dailyJobs || !weeklyJobs) {
      return;
    }
    preprocess(dailyJobs, setSortedDailyJobs, setDailyMax);
    preprocess(weeklyJobs, setSortedWeeklyJobs, setWeeklyMax);
  }, [dailyJobs, weeklyJobs]);

  const preprocess = (
    jobs: Array<TJob>,
    setJobs: React.Dispatch<React.SetStateAction<IJobTimed[]>>,
    setMax: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    let max = -1;
    const filtered = jobs.filter((job) => {
      return job.active_time >= 60;
    });

    filtered.forEach((job) => {
      max = Math.max(max, job.active_time);
    });

    setMax(max);

    const timed = filtered.map((job) => {
      return {
        ...job,
        timeString: timeToString(job.active_time),
        color: {
          h: Math.floor(180 - (job.active_time / max) * 180),
          s: 82,
          l: 80,
        },
      };
    });

    const sorted = timed.sort((a, b) => {
      if (a.active_time > b.active_time) return -1;
      if (a.active_time < b.active_time) return 1;
      return 0;
    });

    setJobs(sorted);
  };

  return (
    <S.Wrapper>
      <S.Ul>
        <Bar jobs={sortedDailyJobs} max={dailyMax} />
      </S.Ul>
    </S.Wrapper>
  );
}

type TBar = {
  jobs: Array<IJobTimed>;
  max: number;
};

function Bar({ jobs, max }: TBar) {
  const { ipcRenderer } = window.electron;

  const onClickImage = useCallback((path: string) => {
    ipcRenderer.sendMessage('application', path);
  }, []);

  return (
    <>
      {jobs.map((job) => {
        return (
          <S.Li key={job.application}>
            <S.Image
              src={job.icon}
              width={30}
              height={30}
              onClick={() => onClickImage(job.path)}
            />
            <S.Bar
              title={job.application}
              percentage={Math.max((100 * job.active_time) / max, 20)}
              barcolor={`hsla(${job.color.h}, ${job.color.s}%, ${job.color.l}%, 1)`}
            >
              {job.timeString}
            </S.Bar>
          </S.Li>
        );
      })}
    </>
  );
}

export default BarChart;
