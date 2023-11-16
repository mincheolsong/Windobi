import { useEffect } from 'react';

function Test() {
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('size', {
      width: 300,
      height: 300,
    });
  }, []);
  return (
    <div>
      test
      <p>dd</p>
    </div>
  );
}

export default Test;
