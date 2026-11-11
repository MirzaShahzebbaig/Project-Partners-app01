import express from 'express';
import { store } from '../data/store.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/milestones/:projectId
// @desc    Get milestones for a project
router.get('/:projectId', (req, res) => {
  try {
    const list = store.milestones
      .filter(m => m.projectId === req.params.projectId)
      .sort((a, b) => a.order - b.order);

    res.status(200).json({ status: 'success', milestones: list });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/milestones
// @desc    Add milestone (Mentor only)
router.post('/', protect, restrictTo('mentor'), (req, res) => {
  try {
    const { projectId, title, description, dueDate } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ status: 'error', message: 'Project ID and title are required.' });
    }

    const existing = store.milestones.filter(m => m.projectId === projectId);
    const newMilestone = {
      id: `m_${Date.now()}`,
      projectId,
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate || new Date(Date.now() + 3600000 * 24 * 14).toISOString().split('T')[0],
      completed: false,
      order: existing.length + 1
    };

    store.milestones.push(newMilestone);

    res.status(201).json({
      status: 'success',
      milestone: newMilestone,
      message: 'Milestone created successfully!'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   PUT /api/milestones/:id/toggle
// @desc    Toggle milestone completion
router.put('/:id/toggle', protect, (req, res) => {
  try {
    const milestone = store.milestones.find(m => m.id === req.params.id);
    if (!milestone) {
      return res.status(404).json({ status: 'error', message: 'Milestone not found.' });
    }

    milestone.completed = !milestone.completed;

    res.status(200).json({
      status: 'success',
      milestone,
      message: `Milestone marked as ${milestone.completed ? 'completed' : 'in progress'}.`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
