import express from 'express';
import { store } from '../data/store.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to check user membership in team
const verifyTeamAccess = (user, projectId, channel) => {
  const team = store.teams.find(t => t.projectId === projectId);
  if (!team) {
    return { allowed: false, message: 'Team has not been formed for this project yet.' };
  }

  const isStudentMember = team.members.some(m => m.studentId === user.id);
  const isProjectMentor = team.mentorId === user.id;
  const isAdmin = user.role === 'admin';

  if (channel === 'peer') {
    // Only student members can access peer chat
    if (isStudentMember || isAdmin) {
      return { allowed: true, team };
    }
    return { allowed: false, message: 'The peer discussion channel is exclusively reserved for student team members.' };
  }

  if (channel === 'mentor') {
    // Both student members and the mentor can access guidance chat
    if (isStudentMember || isProjectMentor || isAdmin) {
      return { allowed: true, team };
    }
    return { allowed: false, message: 'You are not an authorized member or mentor of this project team.' };
  }

  if (channel === 'co_mentor') {
    // Lead mentor and co-mentors can access
    const project = store.projects.find(p => p.id === projectId);
    const isLeadMentor = (project && project.mentorId === user.id) || team.mentorId === user.id;
    const isCoMentor = project && project.coMentors && project.coMentors.some(cm => cm.mentorId === user.id);
    if (isLeadMentor || isCoMentor || isAdmin) {
      return { allowed: true, team };
    }
    return { allowed: false, message: 'The Co-Mentor channel is exclusively reserved for faculty collaborators.' };
  }

  return { allowed: false, message: 'Invalid chat channel.' };
};

// @route   GET /api/chat/:projectId
// @desc    Get messages for a channel ('peer' or 'mentor')
router.get('/:projectId', protect, (req, res) => {
  try {
    const { projectId } = req.params;
    const channel = req.query.channel || 'mentor';

    const access = verifyTeamAccess(req.user, projectId, channel);
    if (!access.allowed) {
      return res.status(403).json({ status: 'error', message: access.message });
    }

    if (!store.messages) store.messages = [];

    const messages = store.messages
      .filter(m => m.projectId === projectId && m.channel === channel)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.status(200).json({
      status: 'success',
      channel,
      projectId,
      count: messages.length,
      messages
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/chat/:projectId
// @desc    Post a new chat message to a channel
router.post('/:projectId', protect, (req, res) => {
  try {
    const { projectId } = req.params;
    const { text, channel = 'mentor' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ status: 'error', message: 'Message text cannot be empty.' });
    }

    const access = verifyTeamAccess(req.user, projectId, channel);
    if (!access.allowed) {
      return res.status(403).json({ status: 'error', message: access.message });
    }

    if (!store.messages) store.messages = [];

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId,
      channel,
      senderId: req.user.id,
      senderName: req.user.fullName,
      senderRole: req.user.role,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    store.messages.push(newMessage);

    res.status(201).json({
      status: 'success',
      message: newMessage
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
