import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './signup.js'
import Navbar from './components/Navbar.js';
import Login from './login.js';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
               <Navbar/>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

          
          </Routes>
        </header>
      </div>
    </Router>

  );
}

export default App;
