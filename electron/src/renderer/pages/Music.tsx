/* eslint-disable react/destructuring-assignment */
import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import axios from 'axios';
import * as S from '../components/music/Music.style';
import playBtn from '../../../assets/icons/playBtn.svg';

const GOOGLE_API_KEY = 'AIzaSyADgPDYY5VgeSQgOFuXdU7GaWQeWapbgKk';
const { ipcRenderer } = window.electron;
const playlist_prefix = 'https://music.youtube.com/browse/VL';
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
  const [count, setCount] = useState();
  const [loading, setLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState(
    'https://music.youtube.com/playlist?list=PLDRiSsyuI9qBJC4sCd1_qEuLrO8E0hjzD',
  );
  let playlistId;
  let videoId;

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
    const key = await ipcRenderer.invoke('env', 'OPENAI_API_KEY');

    setOpenai(
      new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true,
      }),
    );
  };

  // const openNewWindow = (url) => {
  //   window.open(url, '_blank', 'nodeIntegration=no');
  // };

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('size', {
      width: 300,
      height: 300,
    });
    ipcRenderer.sendMessage('windowOpened');
    settingOpenAi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const accessToken = await ipcRenderer.invoke('token');
    try {
      // openai에게 추천받기
      const openaiResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });

      const parsedOpenaiResponse = JSON.parse(
        openaiResponse.choices[0].message.content,
      ); // openai에서 받은 응답 [ {song : 'title', artist : 'artist'}, {song : 'title', artist : 'artist'}]

      console.log('1. openai : ' + JSON.stringify(parsedOpenaiResponse));
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
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      playlistId = playListResponse.data.id; // 생성된 플레이리스트 아이디 (insertitem 할때 필요한 값)

      console.log('2. playlistId : ' + playlistId);

      const playlistUrl = `${playlist_prefix}${playlistId}`;
      for (let i = 0; i < parsedOpenaiResponse.length; i++) {
        // youtube에 노래 검색
        const youtubeSearchResponse = await axios.get(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&part=id&maxResults=1&q=${parsedOpenaiResponse[i].song}%7C${parsedOpenaiResponse[i].artist}&type=video&videoCategoryId=10&key=${GOOGLE_API_KEY}`,
        );

        videoId = youtubeSearchResponse.data.items[0].id.videoId; // insertitem할때 필요한 값

        console.log('3. videoId : ' + videoId);
        const playListItemsResponse = await axios.post(
          `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${GOOGLE_API_KEY}`,
          {
            snippet: {
              playlistId,
              resourceId: {
                kind: 'youtube#video',
                videoId,
              },
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        console.log('4. playListItemsResponse : ' + playListItemsResponse);
        setLoading(false);
        setPlaylistUrl(playlistUrl);
        setPrompt('');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <S.Wrapper>
      <S.Header>어떤 노래를 듣고 싶으세요?</S.Header>

      <S.Body>
        <S.Input>
          <S.TitleInput
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            placeholder="코딩할 때 듣기 좋은 노래"
          ></S.TitleInput>
          <S.CountInput
            onChange={(e) => {
              setCount(e.target.valueAsNumber);
            }}
            type="number"
            min={1}
          ></S.CountInput>
        </S.Input>
        <S.PlayButton
          onClick={handleSubmit}
          disabled={loading || prompt.length === 0}
        >
          {loading === true ? (
            <S.Loading></S.Loading>
          ) : (
            <S.playImg src={playBtn}></S.playImg>
          )}
        </S.PlayButton>
      </S.Body>

      {loading === false && playlistUrl.length > 0 ? (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 107,
          }}
          onClick={() => {
            // openNewWindow(playlistUrl);
            ipcRenderer.sendMessage('showYouTubeMusicWindow', playlistUrl);
          }}
        >
          만들었어요
        </div>
      ) : null}
    </S.Wrapper>
  );
}

export default Music;
