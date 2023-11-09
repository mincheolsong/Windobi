import { useEffect } from 'react';

function YoutubeMusic() {
  return (
    <webview
      id="foo"
      src="https://music.youtube.com/browse/VLPLDRiSsyuI9qDl5zYIaEDgoyRzHw3hcCRB"
      style={{ display: 'inline-flex', width: '100%', height: '100%' }}
    ></webview>
  );
}

export default YoutubeMusic;
