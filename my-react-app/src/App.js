import './App.css';
import HomePage from './pages/HomePage';
import CreateIme from './pages/CreateIme';
import Navbar from './components/Navbar';
import './pages/HomePage.css';
import './pages/CreateIme.css';
import './components/Navbar.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-ime" element={<CreateIme />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
