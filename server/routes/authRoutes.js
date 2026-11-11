import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../data/store.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'projectpartner_super_secret_jwt_key_2026_academic_prod';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const sanitizeUser = (user) => {
  const { passwordHash, ...safeUser } = user;
  
  // Calculate projects worked on or guided
  if (user.role === 'student') {
    const studentTeams = (store.teams || []).filter(t => t.members.some(m => m.studentId === user.id));
    const studentIndep = (store.independentProjects || []).filter(ip => ip.currentMembers.some(m => m.studentId === user.id));
    const certs = (store.certificates || []).filter(c => c.studentId === user.id);
    
    return {
      ...safeUser,
      projectsWorked: studentTeams.map(t => ({
        projectId: t.projectId,
        title: t.projectTitle,
        role: t.members.find(m => m.studentId === user.id)?.role || 'Team Member',
        mentorName: t.mentorName
      })),
      independentProjects: studentIndep.map(ip => ({ id: ip.id, title: ip.title, role: 'Co-Founder' })),
      certificates: certs
    };
  } else if (user.role === 'mentor') {
    const mentoredProjects = (store.projects || []).filter(p => p.mentorId === user.id || p.coMentors?.some(cm => cm.mentorId === user.id));
    const ratings = (store.feedback || []).filter(f => f.toUserId === user.id);
    const avg = ratings.length > 0 ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1) : 5.0;

    return {
      ...safeUser,
      projectsGuided: mentoredProjects.map(p => ({
        id: p.id,
        title: p.title,
        domain: p.domain,
        isCompleted: p.isCompleted || p.status === 'completed',
        teamSize: p.currentTeamSize || 0
      })),
      ratingAvg: Number(avg),
      ratingsCount: ratings.length
    };
  }

  return safeUser;
};

// @route   POST /api/auth/register
// @desc    Register a new Student or Mentor with CV upload & Year/Designation
router.post('/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      role, 
      fullName, 
      college, 
      department,
      resumeName,
      resumeUrl,
      yearOfStudy,
      designation
    } = req.body;

    if (!email || !password || !role || !fullName) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: email, password, role, and full name.'
      });
    }

    if (role === 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin accounts cannot be registered publicly.'
      });
    }

    const existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'An account with this email address already exists. Please sign in instead.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `u_${role}_${Date.now()}`,
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      fullName: fullName.trim(),
      college: college || 'National Institute of Technology',
      department: department || 'Engineering',
      createdAt: new Date().toISOString(),
      ...(role === 'student' ? {
        yearOfStudy: yearOfStudy || '3rd Year',
        skills: Array.isArray(req.body.skills) ? req.body.skills : ['Python', 'React'],
        interests: Array.isArray(req.body.interests) ? req.body.interests : ['AI', 'Web'],
        bio: req.body.bio || 'Motivated student builder ready for project collaboration.',
        resumeName: resumeName || 'Student_CV.pdf',
        resumeUrl: resumeUrl || 'data:application/pdf;base64,JVBERi0xLjQKJUZBS0VfUkVTVU1FX05FVw==',
        streakDays: 1,
        hoursSpent: 2,
        badges: ['🔥 1-Day Streak', '🚀 Project Pioneer'],
        githubUrl: req.body.githubUrl || '',
        linkedinUrl: req.body.linkedinUrl || ''
      } : {
        designation: designation || 'Associate Professor',
        experienceYears: Number(req.body.experienceYears) || 6,
        expertise: Array.isArray(req.body.expertise) ? req.body.expertise : ['Computer Science'],
        bio: req.body.bio || 'Guiding student software and research capstones.',
        badges: ['🌟 Faculty Guide', '💡 Mentor Pioneer']
      })
    };

    store.users.push(newUser);

    const token = generateToken(newUser.id);

    res.status(201).json({
      status: 'success',
      token,
      user: sanitizeUser(newUser),
      message: 'Account created successfully! Your CV is now ready for applications.'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Registration failed due to server error.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return token
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both email and password.'
      });
    }

    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials: No account found with this email.'
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        status: 'error',
        message: `Role mismatch: This email is registered as a ${user.role}, but you selected ${role}.`
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials: Incorrect password.'
      });
    }

    // Auto update streak on login if student
    if (user.role === 'student') {
      user.streakDays = (user.streakDays || 1) + 1;
      if (!user.badges.some(b => b.includes('Streak'))) {
        user.badges.push(`🔥 ${user.streakDays}-Day Streak`);
      } else {
        user.badges = user.badges.map(b => b.includes('Streak') ? `🔥 ${user.streakDays}-Day Streak` : b);
      }
    }

    const token = generateToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      user: sanitizeUser(user),
      message: `Welcome back, ${user.fullName}!`
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Login failed due to server error.'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get currently logged in user profile with project history & badges
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    user: sanitizeUser(req.user)
  });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile, CV resume upload, portfolio links & year/designation
router.put('/profile', protect, (req, res) => {
  try {
    const user = store.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }

    const { 
      resumeName, 
      resumeUrl, 
      skills, 
      bio, 
      githubUrl, 
      linkedinUrl, 
      college, 
      department,
      yearOfStudy,
      designation
    } = req.body;

    if (resumeName !== undefined) user.resumeName = resumeName;
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
    if (skills !== undefined && Array.isArray(skills)) user.skills = skills;
    if (bio !== undefined) user.bio = bio;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (college !== undefined) user.college = college;
    if (department !== undefined) user.department = department;
    if (yearOfStudy !== undefined) user.yearOfStudy = yearOfStudy;
    if (designation !== undefined) user.designation = designation;

    res.status(200).json({
      status: 'success',
      user: sanitizeUser(user),
      message: 'Profile & credentials updated successfully!'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/auth/log-time
// @desc    Log daily work session hours & update streak (Point 12)
router.post('/log-time', protect, (req, res) => {
  try {
    const { hours = 2, notes = 'Daily project sprint development' } = req.body;
    const user = store.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found.' });

    user.hoursSpent = (user.hoursSpent || 0) + Number(hours);
    user.streakDays = (user.streakDays || 1) + 1;

    // Award badge if hours >= 50
    if (user.hoursSpent >= 50 && !user.badges.includes('⚡ 50+ Hours Contributed')) {
      user.badges.push('⚡ 50+ Hours Contributed');
    }

    res.status(200).json({
      status: 'success',
      hoursSpent: user.hoursSpent,
      streakDays: user.streakDays,
      badges: user.badges,
      message: `Logged ${hours} work hours! Keep up the daily streak 🔥`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   DELETE /api/auth/account
// @desc    Delete user account for both Students and Mentors (Point 11)
router.delete('/account', protect, (req, res) => {
  try {
    const userId = req.user.id;
    const idx = store.users.findIndex(u => u.id === userId);

    if (idx === -1) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }

    // Remove user
    store.users.splice(idx, 1);

    // Clean up applications
    store.applications = store.applications.filter(a => a.studentId !== userId);

    // Clean up teams membership
    store.teams.forEach(t => {
      t.members = t.members.filter(m => m.studentId !== userId);
    });

    res.status(200).json({
      status: 'success',
      message: 'Your ProjectPartner account and active records have been deleted.'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
