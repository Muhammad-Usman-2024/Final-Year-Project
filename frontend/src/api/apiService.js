import api from './axios';

// --- AUTH MODULE APIs ---
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
};

// --- PROFILE MODULE APIs ---
export const profileService = {
  getProfile: (id) => api.get(`/profile/${id}`),
  updateProfile: (data) => api.put('/profile/update', data),
  updateMedicalHistory: (data) => api.put('/profile/medical-history', data),
  getDonorEligibility: (id) => api.get(`/profile/donor/eligibility/${id}`),
};

// --- DONATION MODULE APIs ---
export const donationService = {
  getStats: () => api.get('/donation/stats'),
  getSlots: (hospitalId, date) => api.get('/donation/available-slots', { params: { hospitalId, date } }),
  bookAppointment: (data) => api.post('/donation/schedule', data),
  getHistory: (donorId) => api.get(`/donation/history/${donorId}`),
  updateStatus: (id, data) => api.put(`/donation/update-status/${id}`, data),
};

// --- INVENTORY MODULE APIs ---
export const inventoryService = {
  getStock: () => api.get('/inventory/stock'),
  addStock: (data) => api.post('/inventory/add', data),
  getRequests: () => api.get('/inventory/requests'),
  requestBlood: (data) => api.post('/inventory/request', data),
  approveRequest: (id) => api.put(`/inventory/request/${id}/approve`),
  fulfillRequest: (id) => api.put(`/inventory/request/${id}/fulfill`),
  getExpiryAlerts: () => api.get('/inventory/expiry-alerts'),
};

// --- SEARCH & MATCHING APIs ---
export const searchService = {
  searchDonors: (bloodGroup, city) => api.get(`/search/donors?bloodGroup=${bloodGroup}&city=${city}`),
  getCompatibleGroups: (group) => api.get(`/search/compatible/${group}`),
  getNearbyBanks: (bloodGroup, city) => api.get(`/search/nearby-banks?bloodGroup=${bloodGroup}&city=${city}`),
  getHospitals: () => api.get('/search/hospitals'),
  broadcastUrgent: (data) => api.post('/search/broadcast', data),
};

// --- NOTIFICATIONS MODULE APIs ---
export const notificationService = {
  getAll: (page = 1, filter = 'all') => api.get(`/notifications?page=${page}&filter=${filter}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/mark-all-read'),
  deleteOne: (id) => api.delete(`/notifications/${id}`),
  clearAll: () => api.delete('/notifications/clear-all'),
  seed: () => api.post('/notifications/seed-test'),
};

// --- DOCTOR MODULE APIs ---
export const doctorService = {
  getPatients: () => api.get('/doctor/patients'),
  addNote: (patientId, data) => api.post(`/doctor/note/${patientId}`, data),
  getNotes: (patientId) => api.get(`/doctor/note/${patientId}`),
  issuePrescription: (patientId, data) => api.post(`/doctor/prescription/${patientId}`, data),
  getPrescriptions: (patientId) => api.get(`/doctor/prescription/${patientId}`),
  updatePlan: (patientId, data) => api.put(`/doctor/plan/${patientId}`, data),
  createReferral: (patientId, data) => api.post(`/doctor/referral/${patientId}`, data),
  getReferrals: (patientId) => api.get(`/doctor/referral/${patientId}`),
  uploadLab: (patientId, data) => api.post(`/doctor/lab/${patientId}`, data),
};

// --- WELLNESS MODULE APIs ---
export const wellnessService = {
  getVerse: () => api.get('/wellness/verse-of-day'),
  submitMood: (data) => api.post('/wellness/mood', data),
  getMoodHistory: (userId) => api.get(`/wellness/mood/${userId}`),
  getForumPosts: () => api.get('/wellness/forum/posts'),
  createPost: (data) => api.post('/wellness/forum/post', data),
  seedWellness: () => api.post('/wellness/seed'),
};

// --- ADMIN MODULE APIs ---
export const adminService = {
  getOverview: () => api.get('/admin/overview'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/user/${id}/role`, { role }),
  toggleUserStatus: (id) => api.put(`/admin/user/${id}/status`),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  sendBroadcast: (data) => api.post('/admin/broadcast', data),
};

// --- CROSS-CHANNEL NOTIFICATIONS APIs ---
export const notifyService = {
  updatePrefs: (userId, data) => api.put(`/notify/preferences/${userId}`, data),
  scheduleAlert: (data) => api.post('/notify/schedule', data),
  broadcastUrgent: (data) => api.post('/notify/broadcast-urgent', data),
  respond: (id, action) => api.put(`/notify/respond/${id}`, { action }),
};

// --- APPOINTMENT & SCHEDULING APIs ---
export const appointmentService = {
  getSlots: (hospitalId, date) => api.get(`/appointments/slots/${hospitalId}`, { params: { date } }),
  book: (data) => api.post('/appointments/book', data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  getMyBookings: () => api.get('/appointments/my'),
  manageSlots: (data) => api.post('/appointments/slots/manage', data),
};

// --- REPORTS & ANALYTICS APIs ---
export const reportService = {
  getDonations: () => api.get('/reports/donations'),
  getPatients: () => api.get('/reports/patients'),
  getInventory: () => api.get('/reports/inventory'),
  getHospitals: () => api.get('/reports/hospitals'),
};
