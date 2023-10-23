import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './App.css';

function Character() {
  const navigate = useNavigate();

  const { ipcRenderer } = window.electron;
  ipcRenderer.on('sub', () => {
    navigate('/sub');
  });

  return <div className="test">hello</div>;
}

function Sub() {
  return <div className="sub">is sub</div>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Character />} />
        <Route path="/sub" element={null} />
      </Routes>
    </Router>
  );
}
