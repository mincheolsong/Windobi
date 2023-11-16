import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import { useEffect } from 'react';
import {
  AddCharacter,
  Alarm,
  ChangeCharacter,
  Character,
  ChatGPT,
  Closed,
  CreateChart,
  CreatedChart,
  DeleteCharacter,
  GoogleOAuth,
  JobTime,
  MailContent,
  MenuModal,
  Music,
  MyEmail,
  Notification,
  RegistEmail,
  Setting,
  Test,
  Weather,
  YoutubeClosed,
  YoutubeMusic,
} from './pages';

import SubWindow from './layout/SubWindow';
import GlobalFont from './global';
import TMail from './components/notification/TMail';
import SubWindowBack from './layout/SubWindowBack';
import EtcWindow from './layout/EtcWindow';

function MyApp() {
  const navigate = useNavigate();
  const { ipcRenderer } = window.electron;
  ipcRenderer.on('mailReceiving', (mail: TMail) => {
    ipcRenderer.sendMessage('sub', 'alarm');
  });

  ipcRenderer.on('sub', (path) => {
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
              <GoogleOAuth />
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
            <EtcWindow title="재생목록">
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
            <SubWindow title="지피티">
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
            <SubWindowBack title="이메일 등록">
              <RegistEmail />
            </SubWindowBack>
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
        <Route path="/report" element={<CreateChart />} />
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
