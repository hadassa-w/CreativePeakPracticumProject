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
import ProtectedPath from "./components/protectedPath";

function App() {
  const protectedRoutes = [
    { path: "/welcome", component: Welcome },
    { path: "/addProject", component: AddProject },
    { path: "/addCategory", component: AddCategoryForm },
    { path: "/projects", component: ImageGallery },
    { path: "/categories", component: CategoriesList },
    { path: "/designerDetails", component: DesignerDetailsForm },
    { path: "/profile", component: EditUserForm },
  ];

  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Box component="main" sx={{ p: 3 }}>
        <Routes>
          {/* ציבוריים */}
          <Route path="/" element={<Home />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/register" element={<Register />} />

          {/* מוגנים */}
          {protectedRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedPath>
                  <Component />
                </ProtectedPath>
              }
            />
          ))}
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
