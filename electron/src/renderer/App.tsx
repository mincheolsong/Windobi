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
import Notification from './pages/Notification'
import GlobalFont from './global';
function Test() {
  return <div className="sub">sub</div>;
}

function MyApp() {
  const navigate = useNavigate();
  const { ipcRenderer } = window.electron;
  ipcRenderer.on('sub', (path) => {
    navigate(`/${path}`);
  });

  return (
    <>
    <GlobalFont></GlobalFont>
    <Routes>
      <Route path="/" element={<Character />} />
      <Route
        path="/closed"
        element={
          <SubWindow>
            <Test />
          </SubWindow>
        }
      />
      <Route
        path="/jobtime"
        element={
          <SubWindow>
            <JobTime />
          </SubWindow>
        }
      />
      <Route
        path="/notification"
        element={
          <SubWindow>
            <Notification />
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
