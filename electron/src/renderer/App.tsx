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
import MenuModal from './components/character/MenuModal';
import Closed from './pages/Closed';
import Setting from './pages/Setting';

function MyApp() {
  const navigate = useNavigate();
  const { ipcRenderer } = window.electron;
  ipcRenderer.on('sub', (path) => {
    navigate(`/${path}`);
  });

  return (
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
        path="/setting"
        element={
          <SubWindow title="설정">
            <Setting />
          </SubWindow>
        }
      />
      <Route path="/menu" element={<MenuModal />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <MyApp />
    </Router>
  );
}
