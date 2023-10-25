import { useState, useEffect } from 'react';
import * as S from './BarChart.style';

/* eslint-disable jsx-a11y/alt-text */
type TJob = {
  application: string;
  active_time: number;
  icon: string;
};

type TBarChart = {
  jobs: Array<TJob>;
};

interface IJobTimed extends TJob {
  timeString: string;
}

function BarChart({ jobs }: TBarChart) {
  const [maxTime, setMaxTime] = useState<number>(1);
  const [ascJobs, setAscJobs] = useState<Array<IJobTimed>>([]);

  const timeToString = (time: number) => {
    const hour = Math.floor(time / 3600);
    const minute = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    let result = '';
    result = result.concat(hour > 0 ? `${hour}시` : '');
    result = result.concat(minute > 0 ? `${minute}분` : '');
    result = result.concat(`${seconds}초`);

    return result;
  };

  useEffect(() => {
    let max = -1;
    jobs.forEach((job) => {
      max = Math.max(max, job.active_time);
    });
    setMaxTime(max);

    const timed = jobs.map((job) => {
      return { ...job, timeString: timeToString(job.active_time) };
    });

    const sorted = timed.sort((a, b) => {
      if (a.active_time > b.active_time) return -1;
      if (a.active_time < b.active_time) return 1;
      return 0;
    });
    setAscJobs(sorted);
  }, [jobs]);

  return (
    <div>
      <S.Wrapper>
        <S.Ul>
          {ascJobs.map((job) => {
            return (
              <S.Li key={job.application}>
                <img src={job.icon} width={30} height={30} />
                <S.Bar percentage={(100 * job.active_time) / maxTime}>
                  {job.timeString}
                </S.Bar>
              </S.Li>
            );
          })}

          {/* {jobs.map((job) => {
            return (
                  <img src={job.icon} width={40} height={40} />
                  <div>
                    <S.Bar width={job.active_time / maxTime} />
                    {job.application.substr(0, 16)} - {job.active_time}초
                  </div>
            );
          })} */}
        </S.Ul>
      </S.Wrapper>
    </div>
  );
}

export default BarChart;
