import { useEffect } from 'react';

function YoutubeClosed() {
  useEffect(() => {
    const { ipcRenderer } = window.electron;
    // ipcRenderer.sendMessage('windowClosed');
    ipcRenderer.sendMessage('etcSize', { width: 0, height: 0 });
  }, []);

  return <div />;
}

export default YoutubeClosed;
