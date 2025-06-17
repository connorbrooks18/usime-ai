import './App.css';
import HomePage from './pages/HomePage';
import CreateIme from './pages/CreateIme';
import DocumentUpload from './pages/DocumentUpload';
import Navbar from './components/Navbar';
import './pages/HomePage.css';
import './pages/CreateIme.css';
import './pages/DocumentUpload.css';
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
          <Route path="/document-upload" element={<DocumentUpload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
