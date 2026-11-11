import express from 'express';
import { store } from '../data/store.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/feedback
// @desc    Submit feedback/rating for a mentor or student teammate
router.post('/', protect, (req, res) => {
  try {
    const { projectId, toUserId, rating, reviewText } = req.body;

    if (!toUserId || !rating) {
      return res.status(400).json({ status: 'error', message: 'Target user and rating (1-5) are required.' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ status: 'error', message: 'Rating must be between 1 and 5 stars.' });
    }

    const targetUser = store.users.find(u => u.id === toUserId);
    if (!targetUser) {
      return res.status(404).json({ status: 'error', message: 'Target user not found.' });
    }

    const project = store.projects.find(p => p.id === projectId);

    if (!store.feedback) store.feedback = [];

    const feedbackEntry = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId: projectId || null,
      projectTitle: project ? project.title : 'Independent Collaboration',
      fromUserId: req.user.id,
      fromUserName: req.user.fullName,
      fromRole: req.user.role,
      toUserId,
      toUserName: targetUser.fullName,
      toRole: targetUser.role,
      rating: numRating,
      reviewText: reviewText ? reviewText.trim() : '',
      createdAt: new Date().toISOString()
    };

    store.feedback.unshift(feedbackEntry);

    // Update target user's average rating
    const userFeedbacks = store.feedback.filter(f => f.toUserId === toUserId);
    const totalRating = userFeedbacks.reduce((sum, f) => sum + f.rating, 0);
    targetUser.ratingAvg = Math.round((totalRating / userFeedbacks.length) * 10) / 10;
    targetUser.ratingsCount = userFeedbacks.length;

    // Check if mentor deserves "🌟 Top Mentor" badge
    if (targetUser.role === 'mentor' && targetUser.ratingAvg >= 4.5 && targetUser.ratingsCount >= 3) {
      if (!targetUser.badges) targetUser.badges = [];
      if (!targetUser.badges.includes('🌟 Top Mentor')) {
        targetUser.badges.push('🌟 Top Mentor');
      }
    }

    res.status(201).json({
      status: 'success',
      message: 'Feedback submitted successfully!',
      feedback: feedbackEntry,
      newAverage: targetUser.ratingAvg
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   GET /api/feedback/user/:userId
// @desc    Get reviews received by a user
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    if (!store.feedback) store.feedback = [];
    const userReviews = store.feedback.filter(f => f.toUserId === userId);
    res.status(200).json({ status: 'success', count: userReviews.length, reviews: userReviews });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   GET /api/feedback/certificates/me
// @desc    Get certificates awarded to the currently logged in student
router.get('/certificates/me', protect, (req, res) => {
  try {
    if (!store.certificates) store.certificates = [];
    const myCertificates = store.certificates.filter(c => c.studentId === req.user.id);
    res.status(200).json({ status: 'success', certificates: myCertificates });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/feedback/report
// @desc    Submit peer report for teammate misconduct or inactivity
router.post('/report', protect, (req, res) => {
  try {
    const { reportedUserId, projectId, reason, details } = req.body;
    if (!reportedUserId || !reason) {
      return res.status(400).json({ status: 'error', message: 'Reported teammate and reason are required.' });
    }

    const reportedUser = store.users.find(u => u.id === reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({ status: 'error', message: 'Reported user not found.' });
    }

    if (!store.reports) store.reports = [];

    const reportEntry = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      reporterId: req.user.id,
      reporterName: req.user.fullName,
      reportedUserId,
      reportedUserName: reportedUser.fullName,
      projectId: projectId || null,
      reason: reason.trim(),
      details: details ? details.trim() : '',
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };

    store.reports.unshift(reportEntry);

    res.status(201).json({
      status: 'success',
      message: 'Confidential peer report submitted. College admin and mentor will review it.',
      report: reportEntry
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   GET /api/feedback/reports
// @desc    Get all reports (admin or mentor viewing project reports)
router.get('/reports', protect, (req, res) => {
  try {
    if (!store.reports) store.reports = [];
    res.status(200).json({ status: 'success', count: store.reports.length, reports: store.reports });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
