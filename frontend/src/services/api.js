import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  REQUEST INTERCEPTOR - Add token to ALL requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage. getItem('token');
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error. response?.status, error.config?.url);
    
    if (error.response) {
      console.error('Error data:', error.response.data);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        console.log(' Unauthorized - Clearing token and redirecting to login');
        localStorage.removeItem('token');
        
        // Only redirect if not already on login page
        if (! window.location.pathname.includes('/login')) {
          useNavigate('/login');
        }
      }
    } else if (error.request) {
      console.error(' No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);


// AUTH APIs

export const authAPI = {
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },
};

// USER APIs
export const userAPI = {
  getProfile: () => {
    return api.get('/users/profile');
  },
  
  updateProfile: (userData) => {
    return api.put('/users/profile', userData);
  },
  
  changePassword: (passwordData) => {
    return api.put('/users/change-password', passwordData);
  },
  
  getAllUsers: () => {
    return api.get('/users');
  },
  
  toggleAdmin: (userId) => {
    return api.put(`/users/${userId}/toggle-admin`);
  },
  
  deleteUser: (userId) => {
    return api.delete(`/users/${userId}`);
  },
};

// BOOK APIs
export const bookAPI = {
  getAllBooks: () => {
    return api.get('/books');
  },
  
  getMyBooks: () => {
    return api.get('/books/my-books');
  },
  
  getBookById: (id) => {
    return api.get(`/books/${id}`);
  },
  
  createBook:  (bookData) => {
    return api.post('/books', bookData);
  },
  
  updateBook: (id, bookData) => {
    return api.put(`/books/${id}`, bookData);
  },
  
  deleteBook: (id) => {
    return api.delete(`/books/${id}`);
  },
};

// Backward compatibility
export const booksAPI = bookAPI;

// AI APIs
export const aiAPI = {
  query: (queryText) => {
    return api.post('/ai/query', { query: queryText });
  },
  
  getExamples: () => {
    return api.get('/ai/examples');
  },
};

export default api;
