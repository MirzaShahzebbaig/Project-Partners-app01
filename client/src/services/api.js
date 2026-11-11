// API Service helper with Bearer token authentication

const getHeaders = () => {
  const token = localStorage.getItem('projectpartner_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (email, password, role) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    return res.json();
  },

  register: async (payload) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch('/api/auth/me', { headers: getHeaders() });
    return res.json();
  },

  // Projects
  getProjects: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.domain && params.domain !== 'all') query.append('domain', params.domain);
    if (params.mentorId) query.append('mentorId', params.mentorId);
    if (params.studentSkills) query.append('studentSkills', JSON.stringify(params.studentSkills));

    const res = await fetch(`/api/projects?${query.toString()}`);
    return res.json();
  },

  getProject: async (id) => {
    const res = await fetch(`/api/projects/${id}`);
    return res.json();
  },

  createProject: async (projectData) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    });
    return res.json();
  },

  deleteProject: async (id) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  updateProfile: async (profileData) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  // Dual-Tab Team Chat
  getChatMessages: async (projectId, channel = 'mentor') => {
    const res = await fetch(`/api/chat/${projectId}?channel=${channel}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  sendChatMessage: async (projectId, text, channel = 'mentor') => {
    const res = await fetch(`/api/chat/${projectId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, channel })
    });
    return res.json();
  },

  // Applications
  applyForProject: async (projectId, coverNote) => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ projectId, coverNote })
    });
    return res.json();
  },

  getStudentApplications: async () => {
    const res = await fetch('/api/applications/student', { headers: getHeaders() });
    return res.json();
  },

  getMentorApplications: async () => {
    const res = await fetch('/api/applications/mentor', { headers: getHeaders() });
    return res.json();
  },

  updateApplicationStatus: async (applicationId, status, remarks) => {
    const res = await fetch(`/api/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, remarks })
    });
    return res.json();
  },

  deleteApplication: async (id) => {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  getAdvisoryInvitations: async () => {
    const res = await fetch('/api/projects/independent/advisory-invitations', { headers: getHeaders() });
    return res.json();
  },

  respondToAdvisoryInvitation: async (projectId, decision, remarks = '') => {
    const res = await fetch(`/api/projects/independent/${projectId}/advisory-decision`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ decision, remarks })
    });
    return res.json();
  },

  assignWorkToStudent: async (projectId, studentId, task) => {
    const res = await fetch(`/api/projects/independent/${projectId}/assign-work`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ studentId, task })
    });
    return res.json();
  },

  // Teams
  getMyTeams: async () => {
    const res = await fetch('/api/teams/my', { headers: getHeaders() });
    return res.json();
  },

  // Milestones
  addMilestone: async (milestoneData) => {
    const res = await fetch('/api/milestones', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(milestoneData)
    });
    return res.json();
  },

  toggleMilestone: async (id) => {
    const res = await fetch(`/api/milestones/${id}/toggle`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return res.json();
  },

  // Admin
  getAdminStats: async () => {
    const res = await fetch('/api/admin/stats', { headers: getHeaders() });
    return res.json();
  },

  // Project Lifecycle & Checklists
  finishProject: async (id, data = {}) => {
    const res = await fetch(`/api/projects/${id}/finish`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  addChecklistItem: async (projectId, itemData) => {
    const res = await fetch(`/api/projects/${projectId}/checklist`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(itemData)
    });
    return res.json();
  },

  toggleChecklistItem: async (projectId, itemId) => {
    const res = await fetch(`/api/projects/${projectId}/checklist/${itemId}/toggle`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return res.json();
  },

  assignChecklistItem: async (projectId, itemId, assignData) => {
    const res = await fetch(`/api/projects/${projectId}/checklist/${itemId}/assign`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(assignData)
    });
    return res.json();
  },

  addCoMentor: async (projectId, coMentorId) => {
    const res = await fetch(`/api/projects/${projectId}/co-mentor`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ coMentorId })
    });
    return res.json();
  },

  getAllMentors: async () => {
    const res = await fetch('/api/projects/mentors/all', { headers: getHeaders() });
    return res.json();
  },

  // Independent Student Projects (Teaming up without mentors)
  getIndependentProjects: async () => {
    const res = await fetch('/api/projects/independent/all', { headers: getHeaders() });
    return res.json();
  },

  createIndependentProject: async (data) => {
    const res = await fetch('/api/projects/independent', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  joinIndependentProject: async (id, data = {}) => {
    const res = await fetch(`/api/projects/independent/${id}/join`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  inviteMentorToIndependent: async (id, data) => {
    const res = await fetch(`/api/projects/independent/${id}/invite-mentor`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Student Community Hub (Campus Idea Lounge)
  getCommunityPosts: async () => {
    const res = await fetch('/api/community', { headers: getHeaders() });
    return res.json();
  },

  createCommunityPost: async (data) => {
    const res = await fetch('/api/community', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  upvoteCommunityPost: async (id) => {
    const res = await fetch(`/api/community/${id}/upvote`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  commentCommunityPost: async (id, text) => {
    const res = await fetch(`/api/community/${id}/comment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
    return res.json();
  },

  // Feedback, Ratings, Certificates, Reports
  submitFeedback: async (data) => {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getUserReviews: async (userId) => {
    const res = await fetch(`/api/feedback/user/${userId}`);
    return res.json();
  },

  getMyCertificates: async () => {
    const res = await fetch('/api/feedback/certificates/me', { headers: getHeaders() });
    return res.json();
  },

  submitReport: async (data) => {
    const res = await fetch('/api/feedback/report', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getReports: async () => {
    const res = await fetch('/api/feedback/reports', { headers: getHeaders() });
    return res.json();
  },

  // Daily Streak & Time Spent Tracker
  logWorkTime: async (hours, notes, projectId) => {
    const res = await fetch('/api/auth/log-time', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ hours, notes, projectId })
    });
    return res.json();
  },

  // Account Management
  deleteAccount: async () => {
    const res = await fetch('/api/auth/account', {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  }
};
