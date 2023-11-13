import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import BarChart from '../components/jobtime/BarChart';

function CreatedChart() {
  const { state } = useLocation();
  const [_dummy, setDummy] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('size', {
      width: 600,
      height: 600,
    });

    setTimeout(() => {
      if (ref.current === null) return;
      toPng(ref.current, { cacheBust: true }).then((dataUrl) => {
        console.log(dataUrl);
      });
    }, 10000);
  }, []);

  const result = state.weeklyJobs;

  return (
    <div ref={ref}>
      {/* <BarChart
        dailyJobs={[]}
        weeklyJobs={state.weeklyJobs}
        setApplication={setDummy}
        type="weekly"
      /> */}
      {result.map((item, index) => (
        <div key={index}>{JSON.stringify(item)}</div>
      ))}
    </div>
  );
}

export default CreatedChart;
