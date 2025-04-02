import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
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
import AddCategoryForm from "./components/addCategory";
import CategoriesList from "./components/allCategories";

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
          <Route path="/addCategory" element={<AddCategoryForm />} />
          <Route path="/allCategories" element={<CategoriesList />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
