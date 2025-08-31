// src/api/lab-files.js
// API for interacting with the Lab Files table
import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}/api/lab-files`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('developerToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const labFilesAPI = {
  getAll: async () => {
    try {
      const res = await axios.get(API_BASE, { headers: getAuthHeaders() });
      return res.data;
    } catch (error) {
      console.error('Error fetching lab files:', error);
      throw error;
    }
  },

  getByLabId: async (labId) => {
    try {
      const res = await axios.get(`${API_BASE}/lab/${labId}`, { headers: getAuthHeaders() });
      return res.data;
    } catch (error) {
      console.error('Error fetching lab files by lab ID:', error);
      throw error;
    }
  },

  upload: async (fileData) => {
    try {
      const res = await axios.post(`${API_BASE}/upload`, fileData, { headers: getAuthHeaders() });
      return res.data;
    } catch (error) {
      console.error('Error uploading lab file:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
      return res.data;
    } catch (error) {
      console.error('Error deleting lab file:', error);
      throw error;
    }
  }
};

export default labFilesAPI;
