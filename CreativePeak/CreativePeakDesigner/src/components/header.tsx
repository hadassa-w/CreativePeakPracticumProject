import * as React from 'react';
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // אייקון יציאה
import { Link, useNavigate } from 'react-router-dom';
import Cartoon_logo from '../images/Cartoon_logoE.png';

const drawerWidth = 240;
const navItems = [{ name: 'Log Out', path: '/', icon: <ExitToAppIcon /> }];

interface HeaderProps {
   setIsLoggedIn: (isLoggedIn: boolean) => void;
}

function Header({ setIsLoggedIn }: HeaderProps) {
   const [mobileOpen, setMobileOpen] = React.useState(false);
   const navigate = useNavigate();

   const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
   const handleLogOut = () => {
      setIsLoggedIn(false);
      navigate('/');
   };

   const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', py: 2 }}>
         <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: '#673AB7' }}>
            Menu
         </Typography>
         <Divider />
         <List>
            {navItems.map(({ name, path, icon }) => (
               <ListItem key={name} disablePadding>
                  <ListItemButton component={Link} to={path} onClick={handleLogOut}
                     sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'black', py: 1.5, '&:hover': { backgroundColor: '#f5f5f5' } }}>
                     {icon} <ListItemText primary={name} sx={{ ml: 1 }} />
                  </ListItemButton>
               </ListItem>
            ))}
         </List>
      </Box>
   );

   return (
      <Box sx={{ display: 'flex' }}>
         <CssBaseline />
         <AppBar component="nav" sx={{ backgroundColor: '#ffffff', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
               {/* אייקון תפריט לנייד */}
               <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: 'none' }, color: '#333' }}>
                  <MenuIcon />
               </IconButton>

               {/* לוגו */}
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="img" src={Cartoon_logo} alt="logo" sx={{ height: 70, maxHeight: '100%', cursor: 'pointer' }} onClick={handleLogOut} />
               </Box>

               {/* ניווט ממורכז עם אייקונים */}
               <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                  {navItems.map(({ name, path, icon }) => (
                     <Button key={path} component={Link} to={path} onClick={handleLogOut}
                        sx={{
                           display: 'flex', alignItems: 'center', color: '#673AB7', fontWeight: 'bold',
                           textTransform: 'none', mx: 2, transition: '0.3s',
                           '&:hover': { color: '#512DA8', backgroundColor: 'rgba(103, 58, 183, 0.1)' }
                        }}>
                        {icon} <Typography sx={{ ml: 1 }}>{name}</Typography>
                     </Button>
                  ))}
               </Box>
            </Toolbar>
         </AppBar>

         {/* תפריט צדדי */}
         <nav>
            <Drawer
               variant="temporary"
               open={mobileOpen}
               onClose={handleDrawerToggle}
               ModalProps={{ keepMounted: true }}
               sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': { width: drawerWidth, boxShadow: '4px 0px 10px rgba(0,0,0,0.1)' },
               }}
            >
               {drawer}
            </Drawer>
         </nav>
      </Box>
   );
}

export default Header;
