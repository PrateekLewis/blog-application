import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Paper,
  Fade,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import { getPost } from '../utils/api';
import './BlogPost.css';

const BlogPost = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getPost(id);
      setPost(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="blogpost-loading">
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="blogpost-error">
        <Alert severity="error" className="blogpost-error-alert">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="blogpost-container">
      <Container maxWidth="md">
        {/* Back Button */}
        <Fade in timeout={400}>
          <Box className="blogpost-back-container">
            <IconButton
              onClick={() => navigate('/dashboard')}
              className="blogpost-back-button"
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>
        </Fade>

        {/* Post Content */}
        <Fade in timeout={600}>
          <Paper elevation={0} className="blogpost-content">
            {/* Category Chip */}
            <Box className="blogpost-category-container">
              <Chip
                label={post.category}
                className="blogpost-category-chip"
              />
            </Box>

            {/* Title */}
            <Typography variant="h2" className="blogpost-title">
              {post.title}
            </Typography>

            {/* Meta Information */}
            <Box className="blogpost-meta">
              <Box className="blogpost-meta-item">
                <PersonIcon className="blogpost-meta-icon" />
                <Typography variant="body2" className="blogpost-meta-text">
                  {post.author_name}
                </Typography>
              </Box>

              <Box className="blogpost-meta-item">
                <CalendarTodayIcon className="blogpost-meta-icon" />
                <Typography variant="body2" className="blogpost-meta-text">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Content */}
            <Typography variant="body1" className="blogpost-body">
              {post.content}
            </Typography>

            {/* Bottom Decoration */}
            <Box className="blogpost-footer">
              <Typography variant="caption" className="blogpost-author">
                Written by {post.author_name}
              </Typography>
              
              <Box className="blogpost-decoration" />
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default BlogPost;
