// API Base URL - Update this to match your Laravel backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      data = { message: text || 'Unexpected response from server' };
    }

    if (!response.ok) {
      const message = (data && (data.message || data.error)) || `HTTP ${response.status}`;
      const err = new Error(message);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Helper for FormData requests (file uploads)
const apiFormDataRequest = async (endpoint, formData) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      data = { message: text || 'Unexpected response from server' };
    }

    if (!response.ok) {
      const message = (data && (data.message || data.error)) || `HTTP ${response.status}`;
      const err = new Error(message);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: (userData) => apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  forgotPassword: (email) => apiRequest('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  resetPassword: (data) => apiRequest('/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  logout: () => apiRequest('/logout', { method: 'POST' }),
};

// CV API
export const cvAPI = {
  upload: (formData) => apiFormDataRequest('/cv/upload', formData),

  getUserCVs: (userId) => apiRequest(`/cv/user/${userId}`),

  getCV: (cvId) => apiRequest(`/cv/${cvId}`),

  delete: (cvId) => apiRequest(`/cv/${cvId}`, {
    method: 'DELETE',
  }),
};

// AI Interview API
export const interviewAPI = {
  startSession: (data) => apiRequest('/interview/start', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  submitAnswer: (sessionId, data) => apiRequest(`/interview/${sessionId}/answer`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  completeSession: (sessionId) => apiRequest(`/interview/${sessionId}/complete`, {
    method: 'POST',
  }),

  getUserSessions: (userId) => apiRequest(`/interview/user/${userId}`),

  getSession: (sessionId) => apiRequest(`/interview/${sessionId}`),
};

// Job API
export const jobAPI = {
  getAll: (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return apiRequest(`/jobs${queryString ? '?' + queryString : ''}`);
  },

  create: (jobData) => apiRequest('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }),

  getById: (jobId) => apiRequest(`/jobs/${jobId}`),

  update: (jobId, jobData) => apiRequest(`/jobs/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  }),

  delete: (jobId) => apiRequest(`/jobs/${jobId}`, {
    method: 'DELETE',
  }),

  getCompanyJobs: (userId) => apiRequest(`/jobs/company/${userId}`),

  apply: (applicationData) => apiRequest('/jobs/apply', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),

  getApplicants: (jobId) => apiRequest(`/jobs/${jobId}/applicants`),

  updateApplicationStatus: (applicationId, statusData) => apiRequest(`/applications/${applicationId}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),
};

// Rating API
export const ratingAPI = {
  create: (ratingData) => apiRequest('/ratings', {
    method: 'POST',
    body: JSON.stringify(ratingData),
  }),

  getAll: () => apiRequest('/ratings'),

  delete: (ratingId) => apiRequest(`/ratings/${ratingId}`, {
    method: 'DELETE',
  }),
};

// Profile API
export const profileAPI = {
  get: (userId) => apiRequest(`/profile/${userId}`),

  updateCandidate: (userId, data) => apiRequest(`/profile/candidate/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  updateCompany: (userId, data) => apiRequest(`/profile/company/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  uploadAvatar: (userId, formData) => apiFormDataRequest(`/profile/${userId}/avatar`, formData),

  updatePassword: (userId, data) => apiRequest(`/profile/${userId}/password`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  getStatistics: (userId) => apiRequest(`/profile/${userId}/statistics`),
};

// Candidate API
export const candidateAPI = {
  getSuggested: (userId, filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return apiRequest(`/candidates/suggested/${userId}${queryString ? '?' + queryString : ''}`);
  },

  getById: (candidateId) => apiRequest(`/candidates/${candidateId}`),

  checkProfileCompletion: (userId) => apiRequest(`/candidates/check-profile/${userId}`),
};

// Notification API
export const notificationAPI = {
  getAll: (userId) => apiRequest(`/notifications?user_id=${userId}`),
  
  getUnreadCount: (userId) => apiRequest(`/notifications/unread-count?user_id=${userId}`),
  
  markAsRead: (notificationId) => apiRequest(`/notifications/${notificationId}/read`, {
    method: 'PUT',
  }),
  
  markAllAsRead: (userId) => apiRequest('/notifications/mark-all-read', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  }),
  
  delete: (notificationId) => apiRequest(`/notifications/${notificationId}`, {
    method: 'DELETE',
  }),
};

// TTS API (Text-to-Speech)
export const ttsAPI = {
  generate: (text) => apiRequest('/tts', {
    method: 'POST',
    body: JSON.stringify({ text }),
  }),

  cleanCache: () => apiRequest('/tts/clean-cache', {
    method: 'POST',
  }),
};

export default {
  authAPI,
  cvAPI,
  interviewAPI,
  jobAPI,
  ratingAPI,
  profileAPI,
  candidateAPI,
  ttsAPI,
};
