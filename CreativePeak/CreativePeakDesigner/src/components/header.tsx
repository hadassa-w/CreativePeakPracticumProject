import * as React from "react";
import {
  AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Button, Typography, Popover,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link, useNavigate } from "react-router-dom";
import Cartoon_logo from "../images/Cartoon_logoE.png";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FolderIcon from '@mui/icons-material/Folder';
import CategoryIcon from '@mui/icons-material/Category';
// import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 240;

interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  action?: () => void;
}

export default function Header({ isLoggedIn, setIsLoggedIn }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const name = localStorage.getItem("userName") || "?";

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleLogOut = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/");
  };

  const loggedInNavItems: NavItem[] = [
    // { name: "Home", path: "/welcome", icon: <HomeIcon /> },
    { name: "Designer details", path: "/designerDetails", icon: <PersonIcon /> },
    { name: "Projects", path: "/projects", icon: <FolderIcon /> },
    { name: "Categories", path: "/categories", icon: <CategoryIcon /> },
    { name: "Log Out", path: "/", icon: <ExitToAppIcon />, action: handleLogOut },
  ];

  const loggedOutNavItems: NavItem[] = [
    { name: "Log In", path: "/login", icon: <LoginIcon /> },
    { name: "Sign Up", path: "/register", icon: <PersonAddIcon /> },
  ];

  const navItems = isLoggedIn ? loggedInNavItems : loggedOutNavItems;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "profile-popover" : undefined;

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
              onClick={action}
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
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          component="nav"
          sx={{ backgroundColor: "#ffffff", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)" }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" }, color: "#333" }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                src={Cartoon_logo}
                alt="logo"
                sx={{ height: 70, cursor: "pointer" }}
                onClick={handleLogOut}
              />
            </Box>

            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", flexGrow: 1, justifyContent: "center" }}>
              {navItems.map(({ name, path, icon, action }) => (
                <Button
                  key={path}
                  component={Link}
                  to={path}
                  onClick={action}
                  sx={{
                    padding:"10px 20px",
                    borderRadius:"20px",
                    display: "flex",
                    alignItems: "center",
                    color: "#673AB7",
                    fontWeight: "bold",
                    textTransform: "none",
                    mx: 2,
                    transition: "0.3s",
                    "&:hover": {
                      color: "#512DA8",
                      backgroundColor: "rgba(103, 58, 183, 0.1)",
                    },
                  }}
                >
                  {icon}
                  <Typography sx={{ ml: 1 }}>{name}</Typography>
                </Button>
              ))}
            </Box>

            <Box
              sx={{
                fontFamily: "revert",
                fontSize: "25px",
                borderRadius: "50%",
                backgroundColor: "white",
                width: "45px",
                height: "45px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "solid 3px #673AB7",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.35)",
                },
              }}
              onClick={handleClick}
            >
              <Typography sx={{ color: "black", fontSize: "20px" }}>{name.charAt(0)}</Typography>
            </Box>
          </Toolbar>
        </AppBar>

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

      {/* ✅ פופאובר מתוקן שלא עובר aria-hidden */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        disableEnforceFocus
        container={document.body}
      >
        <Box sx={{ padding: 2, width: 200, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#673AB7" }}>{name}</Typography>
          {name !== "?" && (
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, textTransform: "none" }}
              onClick={() => {
                handleClose();
                navigate("/profile");
              }}
            >
              <ManageAccountsIcon sx={{ mr: 1 }} /> My profile
            </Button>
          )}
        </Box>
      </Popover>
    </>
  );
}
