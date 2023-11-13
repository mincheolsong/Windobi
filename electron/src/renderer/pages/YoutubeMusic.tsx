import { useEffect, useState } from 'react';

function YoutubeMusic() {
  const { ipcRenderer } = window.electron;
  let [url, setUrl] = useState('');

  ipcRenderer.on('url', (playlisturl) => {
    console.log(playlisturl);
    setUrl(playlisturl);
  });
  useEffect(() => {
    ipcRenderer.sendMessage('etcSize', {
      width: 400,
      height: 700,
    });
  }, []);

  return (
    <webview
      id="foo"
      src={url}
      style={{ display: 'inline-flex', width: '100%', height: '100%' }}
    ></webview>
  );
}

export default YoutubeMusic;
