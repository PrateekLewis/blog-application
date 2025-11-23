import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getProfile } from '../utils/api';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleFlip = () => {
    setError('');
    setSuccess('');
    setIsLogin(!isLogin);
  };

  // Login handlers
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(loginData);
      const tempUserData = {
        email: loginData.email,
        token: response.access_token,
      };
      localStorage.setItem('user', JSON.stringify(tempUserData));

      const profile = await getProfile();
      const userData = {
        email: profile.email,
        name: profile.name,
        id: profile.id,
        token: response.access_token,
      };
      
      onLogin(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Register handlers
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });
      setSuccess('Account created! Switching to login...');
      setTimeout(() => {
        handleFlip();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#667eea',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  };

  const paperStyles = {
    p: 4,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    bgcolor: 'rgba(26, 31, 58, 0.9)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
  };

  return (
    <Box className="auth-container">
      <Container maxWidth="sm" className="auth-card-container">
        <Box className="auth-perspective">
          <Box className={`auth-flip-container ${!isLogin ? 'flipped' : ''}`}>
            {/* FRONT SIDE - LOGIN */}
            <Paper 
              elevation={0} 
              sx={{
                ...paperStyles,
                position: 'relative',
              }}
            >
              <Typography variant="h4" className="auth-title">
                Welcome Back
              </Typography>
              <Typography variant="body2" className="auth-subtitle">
                Sign in to continue your blogging journey
              </Typography>

              {error && (
                <Alert severity="error" className="auth-alert-error">
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleLoginSubmit} className="auth-form">
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  margin="normal"
                  variant="outlined"
                  disabled={loading}
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  margin="normal"
                  variant="outlined"
                  disabled={loading}
                  sx={textFieldStyles}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>

                <Box className="auth-link-text">
                  <Typography variant="body2" component="span" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Don't have an account?{' '}
                    <Button
                      onClick={handleFlip}
                      disabled={loading}
                      className="auth-link-button"
                    >
                      Create one
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* BACK SIDE - REGISTER */}
            <Paper 
              elevation={0} 
              sx={{
                ...paperStyles,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transform: 'rotateY(180deg)',
              }}
            >
              <Typography variant="h4" className="auth-title">
                Create Account
              </Typography>
              <Typography variant="body2" className="auth-subtitle">
                Start your blogging journey today
              </Typography>

              {error && (
                <Alert severity="error" className="auth-alert-error">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" className="auth-alert-success">
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleRegisterSubmit} className="auth-form">
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  margin="normal"
                  variant="outlined"
                  disabled={loading}
                  size="small"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  margin="normal"
                  variant="outlined"
                  disabled={loading}
                  size="small"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  margin="normal"
                  variant="outlined"
                  disabled={loading}
                  size="small"
                  sx={textFieldStyles}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  margin="normal"
                  variant="outlined"
                  disabled={loading}
                  size="small"
                  sx={textFieldStyles}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                </Button>

                <Box className="auth-link-text">
                  <Typography variant="body2" component="span" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Already have an account?{' '}
                    <Button
                      onClick={handleFlip}
                      disabled={loading}
                      className="auth-link-button"
                    >
                      Sign in
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Auth;
