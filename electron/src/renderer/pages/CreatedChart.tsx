import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import BarChart from '../components/jobtime/BarChart';
import { ipcRenderer } from 'electron';
import { ResponsiveBar } from '@nivo/bar';
import * as S from '../components/report/Report.style';
import RecentApplication from '../components/jobtime/RecentApplication';
import PieChart from '../components/jobtime/PieChart';

type Data = {
  day: number;
  time: number;
};

function CreatedChart() {
  const { state } = useLocation();
  const [_dummy, setDummy] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (ref.current === null) return;
      toPng(ref.current, { cacheBust: true }).then((dataUrl) => {
        window.electron.ipcRenderer.sendMessage('chartChannel', dataUrl);
      });
    }, 3000);
  }, []);

  const result: Array<Data> = state.weeklyJobs;
  console.log(result);
  let { day: highestDay, time: highestTime } = result.reduce(
    (max, current) => (current.time > max.time ? current : max),
    result[0],
  );
  const highestHour = Math.floor(highestTime, 0);
  const highestMin = Math.floor((highestTime % 1) * 60, 0);

  const timeSum: number = result.reduce((sum, data) => sum + data.time, 0);
  const timeAvg: number = timeSum / result.length;
  const timeAvgHour: number = Math.floor(timeAvg, 0);
  const timeAvgMin: number = Math.floor((timeAvg % 1) * 60, 0);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        background: '#F6F6F8',
        overflow: 'scroll',
      }}
    >
      {/* <BarChart
        dailyJobs={[]}
        weeklyJobs={state.weeklyJobs}
        setApplication={setDummy}
        type="weekly"
      /> */}
      {/* {result.map((item, index) => (
        <div key={index}>{JSON.stringify(item)}</div>
      ))} */}

      <S.Title>주간 리포트</S.Title>
      <S.Date>
        {result[0].day} - {result[result.length - 1].day}
      </S.Date>
      <S.Body>
        <div>
          <S.BarContainer>
            <S.BarHeader>
              <S.Bolder>{timeAvgHour}</S.Bolder>시간{' '}
              <S.Bolder>{timeAvgMin}</S.Bolder>분
            </S.BarHeader>
            <S.Lighter>하루 평균 사용시간</S.Lighter>

            <ResponsiveBar
              data={result}
              keys={['time']}
              indexBy="day"
              margin={{ top: 50, right: 50, bottom: 100, left: 50 }}
              padding={0.7}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={['#2694F5']}
              enableLabel={false}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]],
              }}
              borderRadius={'10px'}
              axisTop={null}
              axisRight={null}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1.6]],
              }}
              role="application"
              ariaLabel="Nivo bar chart demo"
            />
          </S.BarContainer>

          <S.MostAppContainer>
            <S.MostTitle>많이 사용한 앱</S.MostTitle>
            <RecentApplication></RecentApplication>
          </S.MostAppContainer>
        </div>
        <S.MostDetailContainer>
          <S.MostLangTitle>사용한 언어</S.MostLangTitle>
          <PieChart
            application="Visual Studio Code"
            day={new Date()}
            type="weekly"
          ></PieChart>
        </S.MostDetailContainer>

        <S.MostDetailContainer>
          <S.MostLangTitle>카톡</S.MostLangTitle>
          <PieChart
            application="KakaoTalk"
            day={new Date()}
            type="weekly"
          ></PieChart>
        </S.MostDetailContainer>
      </S.Body>
    </div>
  );
}

export default CreatedChart;
