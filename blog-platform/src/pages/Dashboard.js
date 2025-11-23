import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
  Fade,
  Grow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import { getPosts, createPost, updatePost, deletePost } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [dialogData, setDialogData] = useState({
    title: '',
    content: '',
    category: 'Technology',
  });

  const categories = ['All', 'Technology', 'Programming', 'Lifestyle', 'Travel'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (post = null) => {
    if (post) {
      setEditingPost(post);
      setDialogData({
        title: post.title,
        content: post.content,
        category: post.category,
      });
    } else {
      setEditingPost(null);
      setDialogData({
        title: '',
        content: '',
        category: 'Technology',
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPost(null);
    setDialogData({
      title: '',
      content: '',
      category: 'Technology',
    });
    setError('');
  };

  const handleSavePost = async () => {
    if (!dialogData.title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!dialogData.content.trim()) {
      setError('Please enter content');
      return;
    }

    try {
      setError('');
      if (editingPost) {
        await updatePost(editingPost.id, dialogData);
      } else {
        await createPost(dialogData);
      }
      
      handleCloseDialog();
      fetchPosts();
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        fetchPosts();
      } catch (err) {
        setError(err.message || 'Failed to delete post');
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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

  if (loading) {
    return (
      <Box className="dashboard-loading">
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  return (
    <Box className="dashboard-container">
      <Container maxWidth="lg">
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box className="dashboard-header">
            <Box className="dashboard-header-content">
              <Avatar className="dashboard-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h3" className="dashboard-title">
                  Welcome back, {user?.name || 'User'}!
                </Typography>
                <Typography variant="body1" className="dashboard-subtitle">
                  Manage and create your amazing blog posts
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        {error && (
          <Alert severity="error" className="dashboard-alert" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Search and Filter Section */}
        <Paper elevation={0} className="dashboard-search-bar">
          <Box className="dashboard-search-content">
            <TextField
              label="Search posts..."
              variant="outlined"
              size="medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dashboard-search-input"
              sx={{...textFieldStyles, flexGrow: 1, minWidth: 250}}
            />
            
            <Box className="dashboard-categories">
              {categories.map(cat => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={filterCategory === cat ? 'dashboard-category-chip-active' : 'dashboard-category-chip'}
                />
              ))}
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="dashboard-new-post-button"
            >
              New Post
            </Button>
          </Box>
        </Paper>

        {/* Posts Grid */}
        <Grid container spacing={3}>
          {filteredPosts.map((post, index) => (
            <Grid item xs={12} md={6} lg={4} key={post.id}>
              <Grow in timeout={400 + index * 100}>
                <Card
                  elevation={0}
                  className="dashboard-post-card"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <CardContent className="dashboard-post-content">
                    <Box className="dashboard-post-header">
                      <Chip
                        label={post.category}
                        size="small"
                        className="dashboard-post-category"
                      />
                      <Typography variant="caption" className="dashboard-post-date">
                        {new Date(post.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" className="dashboard-post-title">
                      {post.title}
                    </Typography>
                    
                    <Typography variant="body2" className="dashboard-post-description">
                      {post.content}
                    </Typography>
                  </CardContent>
                  
                  <CardActions className="dashboard-post-actions">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(post);
                      }}
                      className="dashboard-edit-button"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post.id);
                      }}
                      className="dashboard-delete-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {filteredPosts.length === 0 && (
          <Box className="dashboard-empty">
            <ArticleIcon className="dashboard-empty-icon" />
            <Typography variant="h5" className="dashboard-empty-title">
              No posts found
            </Typography>
            <Typography variant="body2" className="dashboard-empty-subtitle">
              {searchTerm || filterCategory !== 'All' 
                ? 'Try adjusting your filters' 
                : 'Create your first post to get started!'}
            </Typography>
          </Box>
        )}

        {/* Create/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            className: 'dashboard-dialog',
          }}
        >
          <DialogTitle className="dashboard-dialog-title">
            <Typography variant="h5" className="dashboard-dialog-heading">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={dialogData.title}
              onChange={(e) => setDialogData({ ...dialogData, title: e.target.value })}
              margin="normal"
              variant="outlined"
              sx={textFieldStyles}
            />
            
            <TextField
              fullWidth
              label="Content"
              value={dialogData.content}
              onChange={(e) => setDialogData({ ...dialogData, content: e.target.value })}
              margin="normal"
              variant="outlined"
              multiline
              rows={6}
              sx={textFieldStyles}
            />
            
            <TextField
              fullWidth
              select
              label="Category"
              value={dialogData.category}
              onChange={(e) => setDialogData({ ...dialogData, category: e.target.value })}
              margin="normal"
              variant="outlined"
              SelectProps={{
                native: true,
              }}
              sx={{
                ...textFieldStyles,
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            >
              {categories.filter(cat => cat !== 'All').map(cat => (
                <option key={cat} value={cat} style={{ backgroundColor: '#1a1f3a', color: 'white' }}>
                  {cat}
                </option>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions className="dashboard-dialog-actions">
            <Button onClick={handleCloseDialog} className="dashboard-dialog-cancel">
              Cancel
            </Button>
            <Button
              onClick={handleSavePost}
              variant="contained"
              className="dashboard-dialog-submit"
            >
              {editingPost ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;
