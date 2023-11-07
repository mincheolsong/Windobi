import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import {
  AddCharacter,
  Alarm,
  ChangeCharacter,
  Character,
  ChatGPT,
  Closed,
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

function MyApp() {
  const navigate = useNavigate();
  const { ipcRenderer } = window.electron;

  ipcRenderer.on('mailReceiving', (mail: TMail) => {
    // console.log("mainRenderer Mail 수신", mail);
    // 메일 수신 알림 주기
    console.log('서브 수신 완료');
    ipcRenderer.sendMessage('sub', 'alarm');
  });

  ipcRenderer.on('sub', (path) => {
    navigate(`/${path}`);
  });

  return (
    <>
      <GlobalFont />
      <Routes>
        <Route path="/" element={<Character />} />
        <Route path="/closed" element={<Closed />} />
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
            <SubWindow title="캐릭터 변경">
              <ChangeCharacter />
            </SubWindow>
          }
        />

        <Route
          path="/addcharacter"
          element={
            <SubWindow title="캐릭터 추가">
              <AddCharacter />
            </SubWindow>
          }
        />
        <Route
          path="/deletecharacter"
          element={
            <SubWindow title="캐릭터 삭제">
              <DeleteCharacter />
            </SubWindow>
          }
        />
        <Route
          path="/chatGPT"
          element={
            <SubWindow title="ChatGPT">
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
