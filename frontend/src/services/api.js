import axios from "axios";

// --- BASE URL ---
const API_URL = "http://localhost:5001/api";

// --- IN-MEMORY TOKEN (sync with AuthContext) ---
let authToken = localStorage.getItem("token");

// --- AXIOS INSTANCE ---
const api = axios.create({
  baseURL: import.meta.env.MODE === "development"?API_URL:"/api"
});

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearAuthToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// --- TOKEN HELPERS ---
export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
  authToken = token;
};

export const clearAuthToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  authToken = null;
};

// --- AUTH APIs ---
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

// --- DASHBOARD APIs ---
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
};

// --- CANDIDATE APIs ---
export const candidateAPI = {
  getAll: (params) => api.get("/candidates", { params }),
  create: (formData) =>
    api.post("/candidates", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) => api.put(`/candidates/${id}`, data),
  delete: (id) => api.delete(`/candidates/${id}`),
  moveToEmployee: (id, data) =>
    api.post(`/candidates/move-to-employee/:${id}`, data),
};

// --- EMPLOYEE APIs ---
export const employeeAPI = {
  getAll: (params) => api.get("/employees", { params }),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getActiveEmployees: () => api.get("/attendance/active-employees"),
};

// --- ATTENDANCE APIs ---
export const attendanceAPI = {
  getAll: (params) => api.get("/attendance", { params }),
  create: (data) => api.post("/attendance", data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  getActiveEmployees: () => api.get("/attendance/active-employees"),
};

// --- LEAVE APIs ---
export const leaveAPI = {
  getAll: (params) => api.get("/leaves", { params }),
  create: (formData) =>
    api.post("/leaves/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) => api.put(`/leaves/${id}`, data),
  getApproved: () => api.get("/leaves/approved"),
};

// --- DOWNLOAD FILE ---
export const downloadFile = (filename) => {
  window.open(`${API_URL}/uploads/${filename}`, "_blank");
};

export default api;
