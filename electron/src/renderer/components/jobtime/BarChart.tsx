import { useState, useEffect } from 'react';
import * as S from './BarChart.style';

/* eslint-disable jsx-a11y/alt-text */
type TJob = {
  application: string;
  active_time: number;
  icon: string;
  path: string;
};

type TBarChart = {
  jobs: Array<TJob>;
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

function BarChart({ jobs }: TBarChart) {
  const [maxTime, setMaxTime] = useState<number>(1);
  const [ascJobs, setAscJobs] = useState<Array<IJobTimed>>([]);

  const { ipcRenderer } = window.electron;

  const timeToString = (time: number) => {
    const hour = Math.floor(time / 3600);
    const minute = Math.floor((time % 3600) / 60);

    let result = '';
    result = result.concat(hour > 0 ? `${hour}시` : '');
    result = result.concat(minute > 0 ? `${minute}분` : '');

    return result;
  };

  useEffect(() => {
    if (!jobs) {
      return;
    }

    let max = -1;
    const filtered = jobs.filter((job) => {
      return job.active_time >= 60;
    });
    filtered.forEach((job) => {
      max = Math.max(max, job.active_time);
    });
    setMaxTime(max);
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

    setAscJobs(sorted);
  }, [jobs]);

  const executeApplication = (path: string) => {
    ipcRenderer.sendMessage('application', path);
  };
  return (
    <S.Wrapper>
      <S.Ul>
        {ascJobs.map((job) => {
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
                percentage={15 + (85 * job.active_time) / maxTime}
                barcolor={`hsla(${job.color.h}, ${job.color.s}%, ${job.color.l}%, 1)`}
              >
                {job.timeString}
              </S.Bar>
            </S.Li>
          );
        })}
      </S.Ul>
    </S.Wrapper>
  );
}

export default BarChart;
