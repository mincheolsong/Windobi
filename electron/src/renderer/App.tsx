import { useState } from 'react';

import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import './App.css';
import {
  AddCharacter,
  Alarm,
  ChangeCharacter,
  Character,
  ChatGPT,
  Closed,
  YoutubeClosed,
  CreateChart,
  CreatedChart,
  DeleteCharacter,
  JobTime,
  MailContent,
  MyEmail,
  Notification,
  RegistEmail,
  Setting,
} from './pages';

import SubWindow from './layout/SubWindow';
import GlobalFont from './global';
import MenuModal from './components/character/MenuModal';
import TMail from './components/notification/TMail';
import SubWindowBack from './layout/SubWindowBack';
import Weather from './pages/Weather';
import Test from './pages/Test';
import GoogleOAuth from './pages/GoogleOAuth';
import Music from './pages/Music';
import YoutubeMusic from './pages/YoutubeMusic';
import EtcWindow from './layout/EtcWindow';

function MyApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ipcRenderer } = window.electron;
  const [accessToken, setAccessToken] = useState('');
  ipcRenderer.on('mailReceiving', (mail: TMail) => {
    // console.log("mainRenderer Mail 수신", mail);
    // 메일 수신 알림 주기
    ipcRenderer.sendMessage('sub', 'alarm');
  });

  ipcRenderer.on('sub', (path) => {
    console.log(path, '가 왔어요');
    navigate(`/${path}`);
  });

  return (
    <>
      <GlobalFont />
      <Routes>
        <Route
          path="/callback"
          element={
            <SubWindow title="리다이렉트">
              <Test />
            </SubWindow>
          }
        />
        <Route path="/" element={<Character />} />
        <Route path="/closed" element={<Closed />} />
        <Route path="/youtubeClosed" element={<YoutubeClosed />} />
        <Route
          path="/jobtime"
          element={
            <SubWindow title="사용시간">
              <JobTime />
            </SubWindow>
          }
        />
        <Route
          path="/notification"
          element={
            <SubWindow title="메일 알림">
              <Notification />
            </SubWindow>
          }
        />
        <Route
          path="/setting"
          element={
            <SubWindow title="설정">
              <Setting />
            </SubWindow>
          }
        />

        <Route
          path="/mailContent"
          element={
            <SubWindowBack title="메일">
              <MailContent />
            </SubWindowBack>
          }
        />
        <Route
          path="/changecharacter"
          element={
            <SubWindowBack title="캐릭터 변경">
              <ChangeCharacter />
            </SubWindowBack>
          }
        />

        <Route
          path="/addcharacter"
          element={
            <SubWindowBack title="캐릭터 추가">
              <AddCharacter />
            </SubWindowBack>
          }
        />

        <Route
          path="/googleOAuth"
          element={
            <SubWindow title="Google OAuth">
              <Music />
            </SubWindow>
          }
        />

        <Route
          path="/music"
          element={
            <SubWindow title="음악 추천">
              <Music />
            </SubWindow>
          }
        />

        <Route
          path="/youtubeMusic"
          element={
            <EtcWindow title="플레이리스트">
              <YoutubeMusic />
            </EtcWindow>
          }
        />

        <Route
          path="/deletecharacter"
          element={
            <SubWindowBack title="캐릭터 삭제">
              <DeleteCharacter />
            </SubWindowBack>
          }
        />
        <Route
          path="/chatGPT"
          element={
            <SubWindow title="한별이">
              <ChatGPT />
            </SubWindow>
          }
        />
        <Route path="/menu" element={<MenuModal />} />
        <Route
          path="/email"
          element={
            <SubWindow title="나의 이메일">
              <MyEmail />
            </SubWindow>
          }
        />
        <Route
          path="/registemail"
          element={
            <SubWindow title="이메일 등록">
              <RegistEmail />
            </SubWindow>
          }
        />
        <Route
          path="/alarm"
          element={
            <SubWindow title="알림">
              <Alarm />
            </SubWindow>
          }
        />
        <Route
          path="/weather"
          element={
            <SubWindow title="날씨">
              <Weather />
            </SubWindow>
          }
        />
        <Route path="/createchart" element={<CreateChart />} />
        <Route path="/createdchart" element={<CreatedChart />} />
      </Routes>
    </>
  );
}
export default function App() {
  return (
    <Router>
      <MyApp />
    </Router>
  );
}
