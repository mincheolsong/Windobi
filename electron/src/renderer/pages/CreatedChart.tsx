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

  const timeSum: number = result.reduce((sum, data) => sum + data.time, 0);
  const timeAvg: number = timeSum / result.length;
  const timeAvgHour: number = Math.floor(timeAvg, 0);
  const timeAvgMin: number = Math.floor((timeAvg % 1) * 60, 0);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      {/* <BarChart
        dailyJobs={[]}
        weeklyJobs={state.weeklyJobs}
        setApplication={setDummy}
        type="weekly"
      /> */}
      {/* {result.map((item, index) => (
        <div key={index}>{JSON.stringify(item)}</div>
      ))} */}

      <div style={{ width: '200px', height: '200px' }}>
        <PieChart
          application="Visual Studio Code"
          day={new Date()}
          type="weekly"
        ></PieChart>
      </div>
      <RecentApplication></RecentApplication>
      <div>
        <S.header>
          <S.bolder>{timeAvgHour}</S.bolder>시간{' '}
          <S.bolder>{timeAvgMin}</S.bolder>분
        </S.header>
        <S.lighter>하루 평균 사용시간</S.lighter>
      </div>
      <div style={{ height: '400px' }}>
        <ResponsiveBar
          data={result}
          keys={['time']}
          indexBy="day"
          margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
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
      </div>
    </div>
  );
}

export default CreatedChart;
