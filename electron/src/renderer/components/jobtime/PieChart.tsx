/* eslint-disable no-return-assign */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import {
  ComputedDatum,
  DatumId,
  MayHaveLabel,
  PieTooltipProps,
  ResponsivePie,
} from '@nivo/pie';
import * as S from './PieChart.style';
import { timeToString } from '../../util';

type TPiechart = {
  application: string;
  day: Date;
  type: 'daily' | 'weekly';
};

interface TData extends MayHaveLabel {
  id: DatumId;
  value: number;
}

interface IFilteredData extends MayHaveLabel {
  id: DatumId;
  color: string;
  value: number;
}

function PieChart({ application, day, type }: TPiechart) {
  const { ipcRenderer } = window.electron;

  const [data, setData] = useState<Array<TData>>([]);
  const [totalActiveTime, setTotalActiveTime] = useState<number>(1);
  const [filtered, setFiltered] = useState<Array<IFilteredData>>([]);

  const getPercentage = (value: number) => {
    const percent = value / totalActiveTime;
    return `${Math.floor(percent * 100)}%`;
  };

  useEffect(() => {
    if (!application) {
      setData([]);
      return;
    }

    (async () => {
      const result = await ipcRenderer.invoke('sub-job-time', {
        application,
        date: day,
        type,
      });

      const fetchData = result.map(
        ({
          sub_application,
          active_time,
        }: {
          sub_application: string;
          active_time: number;
        }) => {
          return {
            id: sub_application,
            value: active_time,
            label: sub_application,
          };
        },
      );

      setData(fetchData);
    })();
  }, [application, day]);

  useEffect(() => {
    let acc = 0;
    data.forEach((d) => {
      acc += d.value;
    });
    setTotalActiveTime(acc);

    // 일정 비율이 넘어가지않는 것들에 대해서는 합쳐서 '기타'로 표시
    const result = data.filter((item) => {
      return item.value / acc >= 0.05;
    });
    const etcs = data.filter((item) => {
      return item.value / acc < 0.05;
    });

    const sumOfEtc = etcs
      .map((e) => e.value)
      .reduce((accu, curr) => accu + curr, 0);

    if (sumOfEtc !== 0)
      result.push({ id: '기타', value: sumOfEtc, label: '기타' });

    result.sort((a, b) => {
      return b.value - a.value;
    });

    const coloredData = result.map((d) => {
      const h = Math.floor((d.value / acc) * 180);

      return { ...d, color: `hsl(${h}, 60%, 80%)` };
    });

    setFiltered(coloredData);
  }, [data]);

  return (
    <S.Wrapper>
      <S.Application>{application}</S.Application>
      <ResponsivePie
        borderWidth={1}
        cornerRadius={5}
        data={filtered}
        colors={{ scheme: 'nivo' }}
        tooltip={createToolTip}
        arcLabel={createArcLabel}
        valueFormat={getPercentage}
        enableArcLinkLabels={false}
        innerRadius={0.4}
      />
    </S.Wrapper>
  );
}

const createArcLabel = (item: ComputedDatum<IFilteredData>) => {
  const labelString = item.label.toString();
  let shortLabel = '';
  if (labelString.length > 10) {
    shortLabel = `${labelString.substring(0, 10)}...`;
  } else {
    shortLabel = labelString;
  }

  return `${shortLabel}(${item.formattedValue})`;
};

const createToolTip = (e: PieTooltipProps<IFilteredData>) => {
  const { datum } = e;
  const time = timeToString(datum.value);

  return <S.Tooltip>{`${datum.id} - ${time}`}</S.Tooltip>;
};

export default PieChart;
