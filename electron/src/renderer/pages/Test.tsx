import { useEffect } from 'react';

function Test() {
  useEffect(() => {
    console.log('리다이렉트 됨');
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
