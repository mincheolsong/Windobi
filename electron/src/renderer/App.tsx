import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
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

function MyApp() {
  const navigate = useNavigate();
  const { ipcRenderer } = window.electron;
  const [mails, setMails] = useState<Array<any>>([]);

  ipcRenderer.on('mailReceiving', (mail: TMail) => {
    // 메일이 수신 된 경우
    console.log('received:', mail);
    // let match = mails.filter((m)=>m.seq == mail.seq);
    // const temp = mails;
    // temp.push(mail)
    // console.log(mails === temp);
    // if(match.length == 0){
    //   setMails(temp);
    // }
    let match = mails.filter((m) => m.seq == mail.seq);
    if (match.length == 0) {
      setMails((prevMails) => [...prevMails, mail]);
      window.electron.ipcRenderer.sendMessage('mailSending', {mails});
    }
  });

  ipcRenderer.on('mailRequest', ()=>{
    window.electron.ipcRenderer.sendMessage('mailSending', {mails});
  })
  useEffect(() => {
    console.log('MAILS:', mails);
  }, [mails]);

  ipcRenderer.on('sub', (path) => {
    navigate(`/${path}`);
  });


  return (
    <>
      <GlobalFont></GlobalFont>
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
              <Notification mails={mails} setMails={setMails} />
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
        <Route path="/menu" element={<MenuModal />} />
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
