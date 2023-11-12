/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
// import { PieChart as Pie, PieValueType } from '@mui/x-charts';
import * as S from './PieChart.style';

type TPiechart = {
  application: string;
  day: Date;
  type: 'daily' | 'weekly';
};

function PieChart({ application, day, type }: TPiechart) {
  return <div>파이차트 예정</div>;

  // const [data, setData] = useState<Array<PieValueType>>([]);
  // const [totalActiveTime, setTotalActiveTime] = useState<number>(1);
  // const [filtered, setFiltered] = useState<Array<PieValueType>>([]);

  // const { ipcRenderer } = window.electron;

  // const getPercentage = (item: PieValueType) => {
  //   const percent = item.value / totalActiveTime;
  //   return percent * 100;
  // };

  // useEffect(() => {
  //   if (!application) {
  //     setData([]);
  //     return;
  //   }

  //   (async () => {
  //     const result = await ipcRenderer.invoke('sub-job-time', {
  //       application,
  //       date: day,
  //       type,
  //     });

  //     const d = result.map((r: { sub_application: any; active_time: any }) => {
  //       const { sub_application, active_time } = r;
  //       return {
  //         id: sub_application,
  //         value: active_time,
  //         label: sub_application,
  //       };
  //     });

  //     setData(d);
  //   })();
  // }, [application, day]);

  // useEffect(() => {
  //   let acc = 0;
  //   data.forEach((d) => {
  //     acc += d.value;
  //   });
  //   setTotalActiveTime(acc);

  //   const result = data.filter((item) => {
  //     return item.value / acc >= 0.1;
  //   });
  //   const etcs = data.filter((item) => {
  //     return item.value / acc < 0.1;
  //   });

  //   const sumOfEtc = etcs.map((e) => e.value).reduce((accu, curr) => accu + curr, 0);

  //   if (sumOfEtc !== 0) result.push({ id: '기타', value: sumOfEtc, label: '기타' });

  //   setFiltered(result);
  // }, [data]);

  // return (
  //   <>
  //     <S.Application>{application}</S.Application>
  //     <S.Centerize>
  //       {/* <Pie
  //         series={[
  //           {
  //             data: filtered,
  //             arcLabel: (i) => `${getPercentage(i).toFixed(0)}%`,
  //             sortingValues: 'desc',
  //           },
  //         ]}
  //         width={220}
  //         height={220}
  //         margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
  //         slotProps={{
  //           legend: { hidden: true },
  //         }}
  //       /> */}
  //     </S.Centerize>
  //   </>
  // );
}

export default PieChart;
