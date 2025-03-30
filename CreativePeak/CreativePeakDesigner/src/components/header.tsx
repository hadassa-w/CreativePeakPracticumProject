import * as React from "react";
import {
   AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Button, Typography,
}
   from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // אייקון יציאה
import { Link, useNavigate } from "react-router-dom";
import Cartoon_logo from "../images/Cartoon_logoE.png";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LoginIcon from "@mui/icons-material/Login"; // אייקון כניסה
import PersonAddIcon from "@mui/icons-material/PersonAdd"; // אייקון הרשמה
import PersonIcon from "@mui/icons-material/Person"; // אייקון לפרופיל

const drawerWidth = 240;

interface HeaderProps {
   isLoggedIn: boolean;
   setIsLoggedIn: (isLoggedIn: boolean) => void;
}

// סוג לפריטי הניווט כדי להימנע משגיאות TypeScript
interface NavItem {
   name: string;
   path: string;
   icon?: React.ReactNode;
   action?: () => void;
}

function Header({ isLoggedIn, setIsLoggedIn }: HeaderProps) {
   let name = localStorage.getItem("userName") || "?"; // אם אין שם, נשתמש ב"?" כברירת מחדל

   const [mobileOpen, setMobileOpen] = React.useState(false);
   const navigate = useNavigate();

   const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
   const handleLogOut = () => {
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn"); // אופציונלי: הסרת נתוני ההתחברות
      navigate("/");
   };

   // תפריט למשתמש מחובר
   const loggedInNavItems: NavItem[] = [
      { name: "Profile", path: "/profile", icon: <PersonIcon /> }, // כפתור פרופיל
      { name: "All projects", path: "/allProjects", icon: <FolderOpenIcon /> },
      { name: "Add project", path: "/addProject", icon: <AddPhotoAlternateIcon /> },
      { name: "Log Out", path: "/", icon: <ExitToAppIcon />, action: handleLogOut },
   ];

   // תפריט למשתמש שלא מחובר
   const loggedOutNavItems: NavItem[] = [
      { name: "Log In", path: "/login", icon: <LoginIcon /> },
      { name: "Sign Up", path: "/register", icon: <PersonAddIcon /> },
   ];

   // בוחר את התפריט המתאים
   const navItems = isLoggedIn ? loggedInNavItems : loggedOutNavItems;

   // תפריט צדדי (למובייל)
   const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", py: 2 }}>
         <Typography variant="h6" sx={{ my: 2, fontWeight: "bold", color: "#673AB7" }}>
            Menu
         </Typography>
         <Divider />
         <List>
            {navItems.map(({ name, path, icon, action }) => (
               <ListItem key={name} disablePadding>
                  <ListItemButton
                     component={Link}
                     to={path}
                     onClick={action || undefined} // בדיקה האם יש action
                     sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "black",
                        py: 1.5,
                        "&:hover": { backgroundColor: "#f5f5f5" },
                     }}
                  >
                     {icon} <ListItemText primary={name} sx={{ ml: 1 }} />
                  </ListItemButton>
               </ListItem>
            ))}
         </List>
      </Box>
   );

   return (
      <Box sx={{ display: "flex" }}>
         <CssBaseline />
         <AppBar
            component="nav"
            sx={{ backgroundColor: "#ffffff", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)" }}
         >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
               {/* תפריט מובייל */}
               <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ display: { sm: "none" }, color: "#333" }}
               >
                  <MenuIcon />
               </IconButton>

               {/* לוגו */}
               <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                     component="img"
                     src={Cartoon_logo}
                     alt="logo"
                     sx={{ height: 70, maxHeight: "100%", cursor: "pointer" }}
                     onClick={() => {
                        setIsLoggedIn(false); // התנתקות המשתמש
                        localStorage.removeItem("isLoggedIn"); // אופציונלי: ניקוי נתוני התחברות
                        localStorage.removeItem("userName"); // אופציונלי: ניקוי נתוני התחברות
                        localStorage.removeItem("userId"); // אופציונלי: ניקוי נתוני התחברות
                        localStorage.removeItem("token"); // אופציונלי: ניקוי נתוני התחברות
                        navigate("/"); // ניווט לדף הבית
                     }}
                  />
               </Box>

               {/* ניווט בדסקטופ */}
               <Box
                  sx={{
                     display: { xs: "none", sm: "flex" },
                     alignItems: "center",
                     justifyContent: "center",
                     flexGrow: 1,
                  }}
               >
                  {navItems.map(({ name, path, icon, action }) => (
                     <Button
                        key={path}
                        component={Link}
                        to={path}
                        onClick={action || undefined} // בדיקה האם יש action
                        sx={{
                           display: "flex",
                           alignItems: "center",
                           color: "#673AB7",
                           fontWeight: "bold",
                           textTransform: "none",
                           mx: 2,
                           transition: "0.3s",
                           "&:hover": { color: "#512DA8", backgroundColor: "rgba(103, 58, 183, 0.1)" },
                        }}
                     >
                        {icon} <Typography sx={{ ml: 1 }}>{name}</Typography>
                     </Button>
                  ))}
               </Box>
               <Box
                  sx={{
                     fontFamily: "revert",
                     fontSize: "25px",
                     borderRadius: "50%",
                     backgroundColor: "rgb(255, 255, 255)",
                     width: "45px",
                     height: "45px",
                     position: "",
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center",
                     border: "solid 3px #673AB7",
                     minWidth: "45px", // לא קטן מזה
                     minHeight: "45px",
                     maxWidth: "45px", // לא גדול מזה
                     maxHeight: "45px",
                  }}
               >
                  <p style={{ color: "black" }}>
                     {name?.charAt(0)}
                  </p>
               </Box>
            </Toolbar>
         </AppBar>

         {/* תפריט צדדי למובייל */}
         <nav>
            <Drawer
               variant="temporary"
               open={mobileOpen}
               onClose={handleDrawerToggle}
               ModalProps={{ keepMounted: true }}
               sx={{
                  display: { xs: "block", sm: "none" },
                  "& .MuiDrawer-paper": { width: drawerWidth, boxShadow: "4px 0px 10px rgba(0,0,0,0.1)" },
               }}
            >
               {drawer}
            </Drawer>
         </nav>
      </Box>
   );
}

export default Header;
