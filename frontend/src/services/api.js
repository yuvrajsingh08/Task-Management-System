import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  getCurrentUser: () => api.get('/me'),
};

// Task APIs
export const taskAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id) => api.get(`/task/${id}`),
  create: (data) => api.post('/task', data),
  update: (id, data) => api.put(`/task/${id}`, data),
  delete: (id) => api.delete(`/task/${id}`),
  getByEmployee: (employeeId) => api.get(`/tasks/employee/${employeeId}`),
  getByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  getStats: () => api.get('/tasks/stats'),
};

// Project APIs
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/project/${id}`),
  create: (data) => api.post('/project', data),
  update: (id, data) => api.put(`/project/${id}`, data),
  delete: (id) => api.delete(`/project/${id}`),
  getStats: () => api.get('/projects/stats'),
};

// Employee APIs
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employee/${id}`),
  create: (data) => api.post('/employee', data),
  update: (id, data) => api.put(`/employee/${id}`, data),
  delete: (id) => api.delete(`/employee/${id}`),
  getStats: () => api.get('/employees/stats'),
};

// Attendance APIs
export const attendanceAPI = {
  getAll: () => api.get('/attendances'),
  getByEmployee: (employeeId) => api.get(`/attendances/employee/${employeeId}`),
  getByDay: (day) => api.get(`/attendances/day/${day}`),
  mark: (data) => api.post('/attendance', data),
};

// Timesheet APIs
export const timesheetAPI = {
  getAll: () => api.get('/timesheets'),
  getById: (id) => api.get(`/timesheet/${id}`),
  create: (data) => api.post('/timesheet', data),
  update: (id, data) => api.put(`/timesheet/${id}`, data),
  delete: (id) => api.delete(`/timesheet/${id}`),
  getByEmployee: (employeeId) => api.get(`/timesheets/employee/${employeeId}`),
  getStats: () => api.get('/timesheets/stats'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export default api;

