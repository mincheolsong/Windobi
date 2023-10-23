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

function MyApp() {
  const navigate = useNavigate();
  const { ipcRenderer } = window.electron;
  ipcRenderer.on('sub', (path) => {
    navigate(`/${path}`);
  });

  return (
    <Routes>
      <Route path="/" element={<Character />} />
      <Route path="/closed" element={null} />
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
