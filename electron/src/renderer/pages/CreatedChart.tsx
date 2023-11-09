import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import BarChart from '../components/jobtime/BarChart';
import { ipcRenderer } from 'electron';

function CreatedChart() {
  const { state } = useLocation();
  const [_dummy, setDummy] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (ref.current === null) return;
      toPng(ref.current, { cacheBust: true }).then((dataUrl) => {
        window.electron.ipcRenderer.sendMessage("chartChannel", dataUrl);
      });
    }, 3000);
  }, []);

  return (
    <div ref={ref}>
      <BarChart
        dailyJobs={state.dailyJobs}
        weeklyJobs={[]}
        setApplication={setDummy}
        type="daily"
      />
    </div>
  );
}

export default CreatedChart;
