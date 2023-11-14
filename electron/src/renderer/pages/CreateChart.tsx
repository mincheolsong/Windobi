import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateChart() {
  const { ipcRenderer } = window.electron;
  const navigate = useNavigate();
  const [_dummy, setDummy] = useState<string>('');

  useEffect(() => {
    (async () => {
      const weeklyJobs = await ipcRenderer.invoke('job-time', 'dayOfWeek');
      const lastWeekAvg = await ipcRenderer.invoke('job-time', 'lasyWeekAvg');
      console.log(lastWeekAvg);
      navigate('/createdchart', { state: { weeklyJobs, lastWeekAvg } });
    })();
  }, []);

  return <div></div>;
}

export default CreateChart;
