import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './App.css';

function Character() {
  return <div className="test">hello</div>;
}

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
      <Route path="/closed" element={<Test />} />
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
