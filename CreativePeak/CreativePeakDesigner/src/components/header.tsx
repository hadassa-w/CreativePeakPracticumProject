import * as React from "react";
import {
  AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText,
  Toolbar, Button, Typography, Popover, Avatar, Tooltip, Badge, Container
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cartoon_logo from "../images/Cartoon_logo English.png";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FolderIcon from '@mui/icons-material/Folder';
import CategoryIcon from '@mui/icons-material/Category';
import { useAuth } from "../contexts/authContext";
import { motion } from "framer-motion";
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 280;

interface NavItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  action?: () => void;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, logout, userName } = useAuth();
  const name = userName || "?";

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  const loggedInNavItems: NavItem[] = [
    { name: "Home", path: "/welcome", icon: <HomeIcon /> },
    { name: "Designer details", path: "/designerDetails", icon: <PersonIcon /> },
    { name: "Projects", path: "/projects", icon: <FolderIcon /> },
    { name: "Categories", path: "/categories", icon: <CategoryIcon /> },
    { name: "Log Out", path: "/", icon: <ExitToAppIcon />, action: handleLogOut },
  ];

  const loggedOutNavItems: NavItem[] = [
    { name: "Home", path: "/", icon: <HomeIcon /> },
    { name: "Log In", path: "/logIn", icon: <LoginIcon /> },
    { name: "Sign Up", path: "/register", icon: <PersonAddIcon /> },
  ];

  const navItems = isLoggedIn ? loggedInNavItems : loggedOutNavItems;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const id = open ? "profile-popover" : undefined;

  // Check if current path matches item path
  const isActive = (path: string) => location.pathname === path;

  const drawer = (
    <Box sx={{ textAlign: "center", height: "100%" }}>
      <Box sx={{ py: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          component="img"
          src={Cartoon_logo}
          alt="logo"
          sx={{ height: 60, mb: 2 }}
        />
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#673AB7" }}>
          Menu
        </Typography>
      </Box>
      <Divider sx={{ mx: 2 }} />

      {isLoggedIn && (
        <Box sx={{ py: 2, px: 3, display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: "#673AB7",
              width: 40,
              height: 40,
              border: "2px solid #fff",
              boxShadow: "0 2px 10px rgba(103, 58, 183, 0.3)"
            }}
          >
            {name.charAt(0)}
          </Avatar>
          <Box sx={{ ml: 2, textAlign: "left" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>Welcome,</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{name}</Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ mx: 2, mb: 2 }} />

      <List sx={{ px: 2 }}>
        {navItems.map(({ name, path, icon, action }) => (
          <ListItem key={name} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={path}
              onClick={action ? () => {
                action();
                setMobileOpen(false);
              } : () => setMobileOpen(false)}
              sx={{
                borderRadius: "12px",
                backgroundColor: isActive(path) ? "rgba(103, 58, 183, 0.1)" : "transparent",
                color: isActive(path) ? "#673AB7" : "text.secondary",
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(103, 58, 183, 0.08)",
                  color: "#673AB7"
                },
                }}
            >
              <Box sx={{
                mr: 2,
                color: isActive(path) ? "#673AB7" : "text.secondary",
                display: "flex",
                alignItems: "center"
              }}>
                {icon}
              </Box>
              <ListItemText
                primary={name}
                primaryTypographyProps={{
                  fontWeight: isActive(path) ? "bold" : "regular"
                }}
              />
              {isActive(path) && (
                <Box sx={{
                  width: 4,
                  height: 20,
                  borderRadius: 4,
                  bgcolor: "#673AB7",
                  ml: 1
                }} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 3, mt: "auto" }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          © {new Date().getFullYear()} Design
        </Typography>
      </Box>
    </Box >
  );

  const MotionBox = motion(Link);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          component="nav"
          elevation={0}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    display: { sm: "none" },
                    color: "#673AB7",
                    mr: 1,
                    '&:hover': {
                      backgroundColor: "rgba(103, 58, 183, 0.08)"
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>

                <MotionBox
                  to="/"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    component="img"
                    src={Cartoon_logo}
                    alt="logo"
                    onClick={() => { logout(); navigate("/") }}
                    sx={{
                      height: { xs: 50, sm: 60 },
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                  />
                </MotionBox>
              </Box>

              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                  ml: 4,
                  mr: 2
                }}
              >
                {navItems.map(({ name, path, icon, action }) => {
                  const active = isActive(path);
                  return (
                    <Tooltip key={path} title={name} arrow placement="bottom">
                      <Button
                        component={Link}
                        to={path}
                        onClick={action}
                        sx={{
                          padding: "8px 16px",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          color: active ? "#673AB7" : "#555",
                          fontWeight: active ? "bold" : "medium",
                          textTransform: "none",
                          mx: 1,
                          position: "relative",
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            color: "#673AB7",
                            backgroundColor: "rgba(103, 58, 183, 0.08)",
                          },
                          "&::after": active ? {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "50%",
                            height: "3px",
                            backgroundColor: "#673AB7",
                            borderRadius: "3px 3px 0 0"
                          } : {}
                        }}
                      >
                        <Box sx={{ mr: 1, opacity: active ? 1 : 0.7 }}>{icon}</Box>
                        <Typography sx={{
                          fontWeight: active ? 600 : 500,
                          fontSize: "0.95rem"
                        }}>
                          {name}
                        </Typography>
                      </Button>
                    </Tooltip>
                  );
                })}
              </Box>

              <Tooltip title={isLoggedIn ? "Account" : "Sign in"}>
                <Badge
                  overlap="circular"
                  color="success"
                  invisible={!isLoggedIn}
                >
                  <Avatar
                    onClick={handleClick}
                    sx={{
                      cursor: "pointer",
                      bgcolor: isLoggedIn ? "#673AB7" : "transparent",
                      color: isLoggedIn ? "white" : "#673AB7",
                      width: 42,
                      height: 42,
                      border: isLoggedIn ? "none" : "2px solid #673AB7",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(103, 58, 183, 0.3)",
                        transform: "translateY(-2px)"
                      },
                    }}
                  >
                    {isLoggedIn ? name.charAt(0) : <LoginIcon />}
                  </Avatar>
                </Badge>
              </Tooltip>
            </Toolbar>
          </Container>
        </AppBar>

        <nav>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                borderRadius: "0 16px 16px 0",
                boxShadow: "4px 0px 15px rgba(0,0,0,0.1)"
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>

        <Box component="main" sx={{ width: '100%' }}>
          <Toolbar /> {/* Spacer */}
        </Box>
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 5,
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            mt: 1
          }
        }}
      >
        <Box sx={{ width: 260 }}>
          {isLoggedIn ? (
            <>
              <Box sx={{
                padding: 3,
                background: "linear-gradient(135deg, #673AB7 0%, #9c27b0 100%)",
                color: "white",
                display: "flex",
                alignItems: "center"
              }}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "white",
                    color: "#673AB7",
                    border: "2px solid white"
                  }}
                >
                  {name.charAt(0)}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Designer</Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{
                    mb: 1.5,
                    borderRadius: "10px",
                    textTransform: "none",
                    py: 1
                  }}
                  onClick={() => {
                    handleClose();
                    navigate("/profile");
                  }}
                  startIcon={<ManageAccountsIcon />}
                >
                  My Profile
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    py: 1,
                    "&:hover": {
                      borderColor: "red",
                    }
                  }}
                  onClick={() => {
                    handleClose();
                    handleLogOut();
                  }}
                  startIcon={<ExitToAppIcon />}
                >
                  Log Out
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" sx={{ mb: 2, color: "#673AB7" }}>Welcome</Typography>
              <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
                Sign in to access all features
              </Typography>

              <Button
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  mb: 1.5,
                  borderRadius: "10px",
                  textTransform: "none",
                  py: 1
                }}
                onClick={() => {
                  handleClose();
                  navigate("/login");
                }}
                startIcon={<LoginIcon />}
              >
                Log In
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  py: 1,
                  "&:hover": {
                    borderColor: "purple",
                  }
                }}
                onClick={() => {
                  handleClose();
                  navigate("/register");
                }}
                startIcon={<PersonAddIcon />}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
}

