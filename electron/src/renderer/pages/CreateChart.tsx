import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateChart() {
  const { ipcRenderer } = window.electron;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const weeklyJobs = await ipcRenderer.invoke('job-time', 'week');
      console.log(weeklyJobs);
      navigate('/createdchart', { state: { weeklyJobs } });
    })();
  }, []);

  return <div />;
}

export default CreateChart;
