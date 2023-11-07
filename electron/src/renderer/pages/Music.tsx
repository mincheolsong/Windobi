import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import axios from 'axios';

import * as S from '../components/music/Music.style';

function Music() {
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('size', {
      width: 300,
      height: 300,
    });
  }, []);

  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    // axios
    //   .get(
    //     'https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId={채널 ID}&maxResults=50&key={AIzaSyADgPDYY5VgeSQgOFuXdU7GaWQeWapbgKk}',
    //   )
    //   .then((res) => {
    //     console.log(res);
    //     setPlaylist(res.data.items);
    //   })
    //   .catch(() => {});
  }, []);
  console.log(playlist);

  return <S.Wrapper></S.Wrapper>;
}

export default Music;
