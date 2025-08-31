// src/api/lab.js
// API for interacting with the Lab table
import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}/api/lab`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('developerToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const labAPI = {
  getAll: async () => {
    const res = await axios.get(API_BASE, { headers: getAuthHeaders() });
    return res.data;
  },
  getById: async (id) => {
    const res = await axios.get(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  },
  create: async (data) => {
    const res = await axios.post(API_BASE, data, { headers: getAuthHeaders() });
    return res.data;
  },
  update: async (id, data) => {
    const res = await axios.put(`${API_BASE}/${id}`, data, { headers: getAuthHeaders() });
    return res.data;
  },
  delete: async (id) => {
    const res = await axios.delete(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  }
};

export default labAPI;
