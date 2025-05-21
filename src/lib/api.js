// API Helper Functions

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProjects = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/projects`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProject = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await axios.post(`${API_URL}/projects`, projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const response = await axios.put(`${API_URL}/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};