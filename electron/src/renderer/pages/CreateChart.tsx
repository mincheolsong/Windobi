import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateChart() {
  const { ipcRenderer } = window.electron;
  const navigate = useNavigate();

  useEffect(() => {

    (async () => {
      const weeklyJobs = await ipcRenderer.invoke('job-time', 'dayOfWeek');
      navigate('/createdchart', { state: { weeklyJobs } });
    })();
  }, []);

  return <div />;
}

export default CreateChart;
