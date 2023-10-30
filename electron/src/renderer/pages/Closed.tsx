import { useEffect } from 'react';

function Closed() {
  useEffect(() => {
    console.log('Sub Window');
    const { ipcRenderer } = window.electron;
    ipcRenderer.sendMessage('size', { width: 0, height: 0 });
  }, []);

  return <div />;
}

export default Closed;
