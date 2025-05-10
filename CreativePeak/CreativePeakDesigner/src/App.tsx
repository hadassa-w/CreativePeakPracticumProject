import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import { Box } from "@mui/material";
import Home from "./components/home";
import Welcome from "./components/welcome";
import LogIn from "./components/logIn";
import Register from "./components/register";
import AddProject from "./components/addProject";
import DesignerDetailsForm from "./components/designerDetails";
import ImageGallery from "./components/projects";
import AddCategoryForm from "./components/addCategory";
import CategoriesList from "./components/categories";
import EditUserForm from "./components/user";
import ScrollToTop from "./components/scrollToTop";
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Box component="main" sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/register" element={<Register />} />

          {/* מוגנים */}
          <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
          <Route path="/addProject" element={<ProtectedRoute><AddProject /></ProtectedRoute>} />
          <Route path="/addCategory" element={<ProtectedRoute><AddCategoryForm /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ImageGallery /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><CategoriesList /></ProtectedRoute>} />
          <Route path="/designerDetails" element={<ProtectedRoute><DesignerDetailsForm /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><EditUserForm /></ProtectedRoute>} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
