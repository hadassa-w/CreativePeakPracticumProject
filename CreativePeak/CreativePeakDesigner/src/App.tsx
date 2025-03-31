import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import { Box } from "@mui/material";
import Home from "./components/home";
import Welcome from "./components/welcome";
import LogIn from "./components/logIn";
import Register from "./components/register";
import AddProject from "./components/addProject";
import DesignerDetailsForm from "./components/profile";
import ImageGallery from "./components/allProjects";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("token") !== null;
  });

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Box component="main" sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logIn" element={<LogIn setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/addProject" element={<AddProject />} />
          <Route path="/allProjects" element={<ImageGallery />} />
          <Route path="/profile" element={<DesignerDetailsForm />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
