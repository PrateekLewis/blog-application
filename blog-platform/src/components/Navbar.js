import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <AppBar position="static" elevation={0} className="navbar-appbar">
      <Toolbar>
        <ArticleIcon className="navbar-icon" />
        <Typography
          variant="h6"
          component="div"
          className="navbar-brand"
          onClick={() => navigate('/')}
        >
          BlogPlatform
        </Typography>
        
        {isAuthenticated ? (
          <Box className="navbar-nav">
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
              className="navbar-button"
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/dashboard')}
              className="navbar-button"
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/profile')}
              className="navbar-button"
            >
              Profile
            </Button>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              className="navbar-button navbar-button-logout"
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box className="navbar-nav">
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
              className="navbar-button"
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              className="navbar-button"
            >
              Login
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/register')}
              className="navbar-button navbar-button-register"
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
