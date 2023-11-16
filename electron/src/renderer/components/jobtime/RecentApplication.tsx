import { useState, useEffect, useCallback } from 'react';
import * as S from './RecentApp.style';
import { timeToString } from '../../util';

type TJobTime = {
  application: string;
  icon: string;
  sum_of_active_time: number;
  index: number;
};

function RecentApplication() {
  const { ipcRenderer } = window.electron;
  const [jobTime, setJobTime] = useState<Array<TJobTime>>([]);

  useEffect(() => {
    (async () => {
      const data: Array<TJobTime> = await ipcRenderer.invoke(
        'job-time',
        'weekPerApplication',
      );
      data.splice(4);

      setJobTime(data);
    })();
  }, []);

  const shortApplication = useCallback((application: string) => {
    if (application.length > 8) {
      return application.substring(0, 8).concat('...');
    }
    return application;
  }, []);

  return (
    <S.Wrapper>
      {jobTime.map(({ application, sum_of_active_time, icon, index }) => {
        return (
          <S.ApplicationWrapper key={index}>
            <S.Img src={icon} alt={application} />
            <div
              style={{ fontFamily: 'GmarketSansTTFMedium', fontSize: '15px' }}
            >
              {shortApplication(application)}
            </div>
            <div
              style={{
                paddingTop: '3px',
                fontFamily: 'GmarketSansTTFMedium',
                fontSize: '15px',
              }}
            >
              {timeToString(sum_of_active_time)}
            </div>
          </S.ApplicationWrapper>
        );
      })}
    </S.Wrapper>
  );
}
export default RecentApplication;
