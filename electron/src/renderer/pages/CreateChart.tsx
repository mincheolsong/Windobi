import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateChart() {
  const { ipcRenderer } = window.electron;
  const navigate = useNavigate();
  const [_dummy, setDummy] = useState<string>('');

  useEffect(() => {
    (async () => {
      const weeklyJobs = await ipcRenderer.invoke('job-time', 'dayOfWeek');
      const lastWeekAvg = await ipcRenderer.invoke('job-time', 'lastWeekSum');
      const lastWeekTime = await ipcRenderer.invoke('job-time', 'lastWeekTime');
      const entireDevAmt = await ipcRenderer.invoke('sub-job-time', {
        application: null,
        type: 'entire',
        date: null,
      });
      navigate('/createdchart', {
        state: { weeklyJobs, lastWeekAvg, entireDevAmt, lastWeekTime },
      });
    })();
  }, []);

  return <div></div>;
}

export default CreateChart;
