import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { getProfile, updateProfile } from '../utils/api';
import './Profile.css';

const Profile = ({ user, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getProfile();
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        bio: profileData.bio || '',
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatedData = await updateProfile({
        name: formData.name,
        bio: formData.bio,
      });
      
      onUpdateProfile(updatedData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
    '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: 'rgba(255, 255, 255, 0.5)',
    },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px #1a1f3a inset !important',
      WebkitTextFillColor: 'white !important',
      caretColor: 'white',
    },
  };

  if (loading) {
    return (
      <Box className="profile-loading">
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  return (
    <Box className="profile-container">
      <Container maxWidth="md">
        <Fade in timeout={600}>
          <Paper elevation={0} className="profile-card">
            <Box className="profile-header">
              <Avatar className="profile-avatar">
                <PersonIcon className="profile-avatar-icon" />
              </Avatar>
              <Box>
                <Typography variant="h4" className="profile-title">
                  Profile
                </Typography>
                <Typography variant="body2" className="profile-subtitle">
                  Manage your account information
                </Typography>
              </Box>
            </Box>

            {success && (
              <Alert severity="success" className="profile-alert-success">
                {success}
              </Alert>
            )}

            {error && (
              <Alert severity="error" className="profile-alert-error">
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} className="profile-form">
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={saving}
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled
                sx={textFieldStyles}
              />

              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                placeholder="Tell us about yourself..."
                disabled={saving}
                sx={textFieldStyles}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                className="profile-submit-button"
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Profile;
