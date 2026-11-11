import express from 'express';
import { store } from '../data/store.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Admin platform analytics and management overview
router.get('/stats', protect, restrictTo('admin'), (req, res) => {
  try {
    const students = store.users.filter(u => u.role === 'student');
    const mentors = store.users.filter(u => u.role === 'mentor');
    const projects = store.projects;
    const applications = store.applications;
    const teams = store.teams;

    res.status(200).json({
      status: 'success',
      stats: {
        totalStudents: students.length,
        totalMentors: mentors.length,
        totalProjects: projects.length,
        totalApplications: applications.length,
        totalTeams: teams.length,
        pendingApplications: applications.filter(a => a.status === 'pending').length,
        acceptedApplications: applications.filter(a => a.status === 'accepted').length
      },
      users: store.users.map(({ passwordHash, ...u }) => u),
      projects
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   DELETE /api/admin/projects/:id
// @desc    Admin moderate/remove project
router.delete('/projects/:id', protect, restrictTo('admin'), (req, res) => {
  try {
    const idx = store.projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ status: 'error', message: 'Project not found.' });
    }

    store.projects.splice(idx, 1);
    res.status(200).json({ status: 'success', message: 'Project removed by administrator.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
