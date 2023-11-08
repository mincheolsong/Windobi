import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import axios from 'axios';

import * as S from '../components/music/Music.style';

const GOOGLE_API_KEY = 'AIzaSyADgPDYY5VgeSQgOFuXdU7GaWQeWapbgKk';

let example_json = `
[
  {"song": "Hurt", "artist": "Johnny Cash"},
  {"song": "Someone Like You", "artist": "Adele"},
  {"song": "Everybody Hurts", "artist": "R.E.M."},
  {"song": "The Sound of Silence", "artist": "Simon & Garfunkel"},
  {"song": "Yesterday", "artist": "The Beatles"}
]
`;
function Music() {
  const [openai, setOpenai] = useState();
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(1);
  let playlistId;

  const messages = [
    {
      role: 'system',
      content: `You are helpful playlist generating assistant.
    You should generate a list of songs and their artists according to a text prompt.
    You should return a JSON array, where each element follows this format : {"song" : <song_title>, "artist" : <artist_name>}`,
    },
    {
      role: 'user',
      content:
        'Generate a playlist of 5 songs based on this prompt : super super sad songs',
    },
    { role: 'assistant', content: example_json },
    {
      role: 'user',
      content: `Generate a playlist of ${count} songs based on this prompt : ${prompt}`,
    },
  ];
  const settingOpenAi = async () => {
    const key = await window.electron.ipcRenderer.invoke(
      'env',
      'OPENAI_API_KEY',
    );
    setOpenai(
      new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true,
      }),
    );
  };

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('size', {
      width: 300,
      height: 300,
    });

    settingOpenAi();
  }, []);

  const [playlist, setPlaylist] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // openai에게 추천받기
      const openaiResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });

      const parsedOneaiResponse = JSON.parse(
        openaiResponse.choices[0].message.content,
      ); // openai에서 받은 응답 [ {song : 'title', artist : 'artist'}, {song : 'title', artist : 'artist'}]

      // youtube에 playlist만들기
      const playListResponse = await axios.post(
        `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&part=status&key=${GOOGLE_API_KEY}`,
        {
          snippet: {
            title: prompt.concat(' by windobi'), // 플레이 리스트 제목
          },
          status: {
            privacyStatus: 'public', // 플레이리스트가 public으로 만들어 짐
          },
        },
        {
          headers: {
            Authorization:
              'Bearer ya29.a0AfB_byBG5FLoZwNmiRNHLSo4KMHzGVD40AxmVMxSFarkDUwM88WrFodwOEHn97pQ-g6E-3ObJqL21xWqXBNmCd5QT9tZoUdOBjsXjPuvbZDt0RBq4yhsayLyV73uS3_a5P00cnjHCzIJl6tunSEJQ0MJtdZexi5yLAaCgYKATASARMSFQHGX2Micbk8RrN3P814efKMEnDgSg0169',
          },
        },
      );

      playlistId = playListResponse.data.id; // 생성된 플레이리스트 아이디

      console.log('생성된 플레이리스트 아이디 '.concat(playlistId));

      // youtube에 노래 검색
      const youtubeSearchResponse = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&part=id&maxResults=1&q=${parsedOneaiResponse[0].song}%7C${parsedOneaiResponse[0].artist}&type=video&videoCategoryId=10&key=${GOOGLE_API_KEY}`,
      );

      console.log(youtubeSearchResponse.data.items[0]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <S.Wrapper>
      <input
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
      ></input>
      <input
        onChange={(e) => {
          setCount(e.target.valueAsNumber);
        }}
        type="number"
      ></input>
      <button onClick={handleSubmit}>제출</button>

      {prompt}
      <br></br>
      {count}
    </S.Wrapper>
  );
}

export default Music;
