import express from 'express';
import { store } from '../data/store.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/community
// @desc    Get all community ideas and discussions
router.get('/', (req, res) => {
  try {
    if (!store.communityPosts) store.communityPosts = [];
    const posts = [...store.communityPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ status: 'success', count: posts.length, posts });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/community
// @desc    Publish a new project idea or discussion in the campus lounge
router.post('/', protect, (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ status: 'error', message: 'Title and content are required.' });
    }

    if (!store.communityPosts) store.communityPosts = [];

    const newPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorId: req.user.id,
      authorName: req.user.fullName,
      authorRole: req.user.role,
      authorDept: req.user.department || (req.user.yearOfStudy ? `${req.user.department || 'General'}, ${req.user.yearOfStudy}` : 'Campus Member'),
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Discussion']),
      upvotes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };

    store.communityPosts.unshift(newPost);
    res.status(201).json({ status: 'success', message: 'Post published to campus community lounge!', post: newPost });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/community/:id/upvote
// @desc    Upvote a community post
router.post('/:id/upvote', protect, (req, res) => {
  try {
    const { id } = req.params;
    const post = store.communityPosts?.find(p => p.id === id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found.' });
    }

    post.upvotes = (post.upvotes || 0) + 1;
    res.status(200).json({ status: 'success', upvotes: post.upvotes });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/community/:id/comment
// @desc    Comment on an idea post
router.post('/:id/comment', protect, (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ status: 'error', message: 'Comment text cannot be empty.' });
    }

    const post = store.communityPosts?.find(p => p.id === id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found.' });
    }

    if (!post.comments) post.comments = [];

    const newComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorId: req.user.id,
      authorName: req.user.fullName,
      authorRole: req.user.role,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);
    res.status(201).json({ status: 'success', comment: newComment });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
