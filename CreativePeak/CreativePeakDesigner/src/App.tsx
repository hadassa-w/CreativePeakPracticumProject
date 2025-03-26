import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from './components/home';
import Welcome from './components/welcome';
import LogIn from './components/logIn';
import Register from './components/register';
import AddImage from './components/AddImage';
import AllImages from './components/allImages';
import Profile from './components/profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  return (
    <Router>

<Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />    
  <Box component="main" sx={{ p: 3 }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/logIn" element={<LogIn setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/welcome' element={<Welcome />} />
          <Route path='/addImage' element={<AddImage />} />
          <Route path='/allImages' element={<AllImages />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
