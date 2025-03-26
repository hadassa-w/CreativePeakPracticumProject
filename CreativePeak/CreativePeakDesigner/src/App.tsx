import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from './components/home';
import Welcome from './components/welcome';
import LogIn from './components/logIn';
import Register from './components/register';

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
      <Header setIsLoggedIn={setIsLoggedIn} /> {/* הצגת הקומפוננטה המתאימה */}
      <Box component="main" sx={{ p: 3 }}>
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/welcome' element={<Welcome />} />
          <Route path="/logIn" element={<LogIn setIsLoggedIn={setIsLoggedIn} />} /> 
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
        {/* 
          <Route path="/home" element={<Home />} />
          <Route path="/myRecipes" element={<MyRecipes />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/addRecipes" element={<AddRecipes />} />
          <Route path="/" element={<Page />} /> 
          */}
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
