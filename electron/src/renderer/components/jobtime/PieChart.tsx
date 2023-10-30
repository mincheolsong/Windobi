import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

type TPieChart = {
  jobs: Array<any>;
};

type TData = [string, number];

function PieChart({ jobs }: TPieChart) {
  const [data, setData] = useState<Array<TData>>([]);

  useEffect(() => {
    const converted: Array<TData> = jobs.map((job) => {
      return [job.application, job.active_time];
    });

    setData(converted);
  }, [jobs]);

  return (
    <div>
      <Chart chartType="PieChart" data={data} />
    </div>
  );
}

export default PieChart;
