/* eslint-disable @typescript-eslint/no-unused-vars */
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

type TType = 'daily' | 'weekly';

type TBarChart = {
  dailyJobs: Array<TJob>;
  weeklyJobs: Array<TJob>;
  type: TType;
  setApplication: React.Dispatch<React.SetStateAction<string>>;
};

function BarChart({ dailyJobs, weeklyJobs, type, setApplication }: TBarChart) {
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

  const preprocess = useCallback(
    (
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
    },
    [],
  );

  useEffect(() => {
    if (!dailyJobs || !weeklyJobs) {
      return;
    }
    preprocess(dailyJobs, setSortedDailyJobs, setDailyMax);
    preprocess(weeklyJobs, setSortedWeeklyJobs, setWeeklyMax);
  }, [dailyJobs, weeklyJobs, preprocess]);

  return (
    <S.Wrapper>
      <S.Ul>
        <Bar
          jobs={type === 'daily' ? sortedDailyJobs : sortedweeklyJobs}
          max={type === 'daily' ? dailyMax : weeklyMax}
          onClick={setApplication}
        />
      </S.Ul>
    </S.Wrapper>
  );
}

type TBar = {
  jobs: Array<IJobTimed>;
  max: number;
  onClick: (application: string) => void;
};
function Bar({ jobs, max, onClick }: TBar) {
  const { ipcRenderer } = window.electron;

  const executeApplication = useCallback(
    (path: string) => {
      ipcRenderer.sendMessage('application', path);
    },
    [ipcRenderer],
  );

  return (
    <>
      {jobs.map((job) => {
        return (
          <S.Li key={job.application}>
            <S.Image
              src={job.icon}
              width={30}
              height={30}
              onClick={() => executeApplication(job.path)}
            />
            <S.Bar
              title={job.application}
              percentage={Math.max((100 * job.active_time) / max, 15)}
              barcolor={`hsla(${job.color.h}, ${job.color.s}%, ${job.color.l}%, 1)`}
              onClick={() => onClick(job.application)}
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
