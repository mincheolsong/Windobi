import { useEffect, useState } from 'react';

const { ipcRenderer } = window.electron;
function YoutubeMusic() {
  let [url, setUrl] = useState('');

  ipcRenderer.on('url', (playlisturl) => {
    setUrl(playlisturl);
  });

  useEffect(() => {}, [url]);

  return (
    <webview
      id="foo"
      src={url}
      style={{ display: 'inline-flex', width: '100%', height: '100%' }}
    ></webview>
  );
}

export default YoutubeMusic;
