import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { ResponsiveBar } from '@nivo/bar';
import * as S from '../components/report/Report.style';

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
        console.log(dataUrl);
      });
    }, 10000);
  }, []);

  const result: Array<Data> = state.weeklyJobs;

  const timeSum: number = result.reduce((sum, data) => sum + data.time, 0);
  const timeAvg: number = timeSum / result.length;
  const timeAvgHour: number = Math.floor(timeAvg, 0);
  const timeAvgMin: number = Math.floor((timeAvg % 1) * 60, 0);

  console.log(timeAvgHour + ' : ' + timeAvgMin);

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

      <div>
        <S.header>
          <S.bolder>{timeAvgHour}</S.bolder>시간{' '}
          <S.bolder>{timeAvgMin}</S.bolder>분
        </S.header>
        <S.lighter>하루 평균 사용시간</S.lighter>
      </div>
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
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: '#2694F5',
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: '#2694F5',
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        // fill={[
        //   {
        //     match: {
        //       id: 'fries',
        //     },
        //     id: 'dots',
        //   },
        //   {
        //     match: {
        //       id: 'sandwich',
        //     },
        //     id: 'lines',
        //   },
        // ]}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        borderRadius={'10px'}
        axisTop={null}
        axisRight={null}
        // axisBottom={{
        //   tickSize: 5,
        //   tickPadding: 5,
        //   tickRotation: 0,
        //   legend: 'country',
        //   legendPosition: 'middle',
        //   legendOffset: 32,
        // }}
        // axisLeft={{
        //   tickSize: 5,
        //   tickPadding: 5,
        //   tickRotation: 0,
        //   legend: 'food',
        //   legendPosition: 'middle',
        //   legendOffset: -40,
        //   tickValues: [0, 2, 4, 6],
        // }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        // legends={[
        //   {
        //     dataFrom: 'keys',
        //     anchor: 'bottom-right',
        //     direction: 'column',
        //     justify: false,
        //     translateX: 120,
        //     translateY: 0,
        //     itemsSpacing: 2,
        //     itemWidth: 100,
        //     itemHeight: 20,
        //     itemDirection: 'left-to-right',
        //     itemOpacity: 0.85,
        //     symbolSize: 20,
        //     effects: [
        //       {
        //         on: 'hover',
        //         style: {
        //           itemOpacity: 1,
        //         },
        //       },
        //     ],
        //   },
        // ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        // barAriaLabel={(e) =>
        //   e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue
        // }
      />
    </div>
  );
}

export default CreatedChart;
