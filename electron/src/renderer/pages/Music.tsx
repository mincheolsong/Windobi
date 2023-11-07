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
    console.log(key);
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
      const result = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });

      let res = JSON.parse(result.choices[0].message.content); //   

      axios
        .get(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&part=id&maxResults=1&q=${res[0].song}%7C${res[0].artist}&type=video&videoCategoryId=10&key=${GOOGLE_API_KEY}`,
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    axios
      .get(
        'https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=UC7JbUmyD7g8JH6LvkkQuSZQ&maxResults=50&key=AIzaSyADgPDYY5VgeSQgOFuXdU7GaWQeWapbgKk',
      )
      .then((res) => {
        console.log(res);
        setPlaylist(res.data.items);
      })
      .catch(() => {});
  }, []);

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
