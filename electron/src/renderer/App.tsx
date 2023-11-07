import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import Character from './pages/Character';
import JobTime from './pages/JobTime';
import SubWindow from './layout/SubWindow';
import Notification from './pages/Notification';
import GlobalFont from './global';
import MenuModal from './components/character/MenuModal';
import Closed from './pages/Closed';
import Setting from './pages/Setting';
import TMail from './components/notification/TMail';
import MailContent from './pages/MailContent';
import ChangeCharacter from './pages/ChangeCharacter';
import ChatGPT from './pages/ChatGPT';
import AddCharacter from './pages/AddCharacter';
import MyEmail from './pages/MyEmail';
import RegistEmail from './pages/RegistEmail';

function MyApp() {
  const navigate = useNavigate();
  const { ipcRenderer } = window.electron;

  ipcRenderer.on('mailReceiving', (mail: TMail) => {
    // console.log("mainRenderer Mail 수신", mail);
    // 메일 수신 알림 주기
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
            <SubWindow title="메일">
              <MailContent />
              </SubWindow>
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
