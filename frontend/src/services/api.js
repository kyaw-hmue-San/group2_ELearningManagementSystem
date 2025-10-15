import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const apiService = {
  // System status
  getStatus: () => api.get('/status'),
  getDashboard: () => api.get('/dashboard'),

  // Users
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  getInstructors: () => api.get('/users/instructors'),
  getStudents: () => api.get('/users/students'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Courses
  getCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  getPublishedCourses: () => api.get('/courses/published'),
  searchCourses: (title) => api.get(`/courses/search?title=${title}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  publishCourse: (id) => api.put(`/courses/${id}/publish`),
  activateCourse: (id) => api.put(`/courses/${id}/activate`),
};

export default api;
