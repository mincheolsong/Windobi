import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import BarChart from '../components/jobtime/BarChart';
import { ipcRenderer } from 'electron';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveTimeRange } from '@nivo/calendar';
import * as S from '../components/report/Report.style';
import RecentApplication from '../components/jobtime/RecentApplication';
import PieChart from '../components/jobtime/PieChart';

type Data = {
  day: number;
  time: number;
};

type DataOfDev = {
  day: number;
  active_time: number;
};

interface ModifiedData {
  day: string;
  value: number;
}

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
  const lastWeek: Array<Data> = state.lastWeekAvg;
  const entireDevAmt: Array<DataOfDev> = state.entireDevAmt;

  const modifiedData: ModifiedData[] = entireDevAmt.map((item) => {
    const dateString = item.day.toString();
    const formattedDate = `${dateString.slice(0, 4)}-${dateString.slice(
      4,
      6,
    )}-${dateString.slice(6, 8)}`;

    return {
      day: formattedDate,
      value: Math.floor(item.active_time / 60),
    };
  });

  let from = new Date();
  let to = new Date();
  from.setDate(from.getDate() - 90);

  from = `${from.getFullYear()}-${(from.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${from.getDate().toString().padStart(2, '0')}`;

  to = `${to.getFullYear()}-${(to.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${to.getDate().toString().padStart(2, '0')}`;

  const lastAvg = lastWeek[0].time / 7;

  // let { day: highestDay, time: highestTime } = result.reduce(
  //   (max, current) => (current.time > max.time ? current : max),
  //   result[0],
  // );
  // const highestHour = Math.floor(highestTime, 0);
  // const highestMin = Math.floor((highestTime % 1) * 60, 0);

  const timeSum: number = result.reduce((sum, data) => sum + data.time, 0);
  const timeAvg: number = timeSum / result.length;
  const timeAvgHour: number = Math.floor(timeAvg, 0);
  const timeAvgMin: number = Math.floor((timeAvg % 1) * 60, 0);

  const lastAvgHour: number = Math.floor(lastAvg, 0);
  const lastAvgMin: number = Math.floor((lastAvg % 1) * 60, 0);

  const avgDiff = timeAvg - lastAvg; // 양수 : 더 많이 사용, 음수 : 덜 사용

  const absAvgDiff = Math.abs(avgDiff);
  const absAvgDiffHour: number = Math.floor(absAvgDiff, 0);
  const absAvgDiffMin: number = Math.floor((absAvgDiff % 1) * 60, 0);

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
              markers={[
                {
                  axis: 'y',
                  value: timeAvg,
                  legend: '평균',
                  lineStyle: {
                    stroke: 'red',
                  },
                  textStyle: {
                    fill: 'red',
                  },
                },
              ]}
              data={result}
              keys={['time']}
              indexBy="day"
              margin={{ top: 50, right: 40, bottom: 100, left: 40 }}
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

          <S.LastWeekContainer>
            지난주 보다&nbsp;
            <S.LastWeekHeader>
              <S.Bolder> {absAvgDiffHour}</S.Bolder>시간{' '}
              <S.Bolder> {absAvgDiffMin} </S.Bolder>분&nbsp;
            </S.LastWeekHeader>
            {avgDiff < 0 ? <p> 덜 사용 했습니다</p> : <p> 더 사용 했습니다</p>}
          </S.LastWeekContainer>

          <S.MostAppContainer>
            <S.MostTitle>많이 사용한 앱</S.MostTitle>
            <RecentApplication></RecentApplication>
          </S.MostAppContainer>
        </div>
        <S.MostDetailContainer>
          <S.MostLangTitle>사용 언어</S.MostLangTitle>
          <PieChart
            application="Visual Studio Code"
            day={new Date()}
            type="weekly"
          ></PieChart>
        </S.MostDetailContainer>

        <S.GrassContainer>
          <S.MostLangTitle>개발 잔디 (단위 : 분)</S.MostLangTitle>
          <ResponsiveTimeRange
            dayRadius={5}
            data={modifiedData}
            from={from}
            to={to}
            emptyColor="#eeeeee"
            colors={['#b4d9fa', '#8ec8fa', '#51acfc', '#2694f5']}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'row',
                justify: false,
                itemCount: 4,
                itemWidth: 59,
                itemHeight: 50,
                itemsSpacing: 26,
                itemDirection: 'right-to-left',
                translateX: -70,
                translateY: -70,
                symbolSize: 23,
              },
            ]}
          />
        </S.GrassContainer>
        {/* <S.MostDetailContainer>
          <S.MostLangTitle>카톡</S.MostLangTitle>
          <PieChart
            application="KakaoTalk"
            day={new Date()}
            type="weekly"
          ></PieChart>
        </S.MostDetailContainer> */}
      </S.Body>
    </div>
  );
}

export default CreatedChart;
