import { useEffect, useState } from 'react';

function YoutubeMusic() {
  const { ipcRenderer } = window.electron;
  const [url, setUrl] = useState('');

  useEffect(() => {
    ipcRenderer.sendMessage('etcSize', {
      width: 400,
      height: 700,
    });
    const remover = ipcRenderer.on('url', (playlisturl) => {
      setUrl(playlisturl);
    });

    return () => {
      remover();
    };
  }, []);

  return (
    <webview
      id="foo"
      src={url}
      style={{ display: 'inline-flex', width: '100%', height: '100%' }}
    />
  );
}

export default YoutubeMusic;
