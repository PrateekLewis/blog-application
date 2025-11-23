const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get token from localStorage
const getToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Something went wrong');
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Auth APIs
export const registerUser = async (userData) => {
  return apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
    skipAuth: true,
  });
};

export const loginUser = async (credentials) => {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipAuth: true,
  });
};

export const getProfile = async () => {
  return apiRequest('/profile', {
    method: 'GET',
  });
};

export const updateProfile = async (profileData) => {
  return apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

// Post APIs
export const createPost = async (postData) => {
  return apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
};

export const getPosts = async () => {
  return apiRequest('/posts', {
    method: 'GET',
  });
};

export const getPost = async (postId) => {
  return apiRequest(`/posts/${postId}`, {
    method: 'GET',
  });
};

export const updatePost = async (postId, postData) => {
  return apiRequest(`/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  });
};

export const deletePost = async (postId) => {
  return apiRequest(`/posts/${postId}`, {
    method: 'DELETE',
  });
};
