import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateChart() {
  const { ipcRenderer } = window.electron;
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("size", {
      width: 300,
      height: 300,
    });
    // (async () => {
    //   const dailyJobs = await ipcRenderer.invoke('job-time', 'day', new Date());
    //   console.log(dailyJobs);
    //   navigate('/createchart', { state: { dailyJobs } });
    // })();
  }, []);

  return <div>sdafjlksadjflksadjklfs</div>;
}

export default CreateChart;
