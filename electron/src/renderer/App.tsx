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
          <SubWindow title="사용 시간">
            <JobTime />
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
