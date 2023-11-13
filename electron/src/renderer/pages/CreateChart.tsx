import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateChart() {
  const { ipcRenderer } = window.electron;
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('size', {
      width: 600,
      height: 800,
    });
    (async () => {
      const weeklyJobs = await ipcRenderer.invoke('job-time', 'week');
      console.log(weeklyJobs);
      navigate('/createdchart', { state: { weeklyJobs } });
    })();
  }, []);

  return <div />;
}

export default CreateChart;
