
// This file contains API endpoint definitions for authentication
// These would be implemented on a Node.js backend

import axios from 'axios';
import { User } from '@/types';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

export const authAPI = {
  // Login user
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/auth/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      // If unauthorized, clear token
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
      return null;
    }
  },

  // Register user (for admin use)
  registerUser: async (userData: Omit<User, 'id'>) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
};
