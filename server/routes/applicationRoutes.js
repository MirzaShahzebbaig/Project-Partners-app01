import express from 'express';
import { store, calculateSkillMatch } from '../data/store.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/applications
// @desc    Student applies for a project (Guards against duplicate applications)
router.post('/', protect, restrictTo('student'), (req, res) => {
  try {
    const { projectId, coverNote } = req.body;

    if (!projectId) {
      return res.status(400).json({ status: 'error', message: 'Project ID is required.' });
    }

    const project = store.projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ status: 'error', message: 'Project not found.' });
    }

    // Check if Team is already full
    const existingTeam = store.teams.find(t => t.projectId === projectId);
    const currentTeamSize = existingTeam ? existingTeam.members.length : 0;
    if (currentTeamSize >= project.teamSizeRequired) {
      return res.status(400).json({
        status: 'error',
        message: `Team is Full: This project has already reached its maximum capacity of ${project.teamSizeRequired} students. New applications are closed.`
      });
    }

    // Duplicate Application Check
    const existingApp = store.applications.find(
      a => a.projectId === projectId && a.studentId === req.user.id
    );

    if (existingApp) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already applied for this project. Check "My Applications" for status.'
      });
    }

    // Compute student's skill match for this project
    const matchScore = calculateSkillMatch(req.user.skills || [], project.requiredSkills);

    const newApplication = {
      id: `app_${Date.now()}`,
      projectId: project.id,
      projectTitle: project.title,
      studentId: req.user.id,
      studentName: req.user.fullName,
      studentEmail: req.user.email,
      studentDept: `${req.user.department || 'Engineering'}, ${req.user.yearOfStudy || 'Student'}`,
      studentSkills: req.user.skills || [],
      matchScore,
      coverNote: coverNote ? coverNote.trim() : 'I am interested in contributing to this project.',
      resumeName: req.user.resumeName || 'Student_CV.pdf',
      resumeUrl: req.user.resumeUrl || '',
      status: 'pending',
      appliedAt: new Date().toISOString()
    };

    store.applications.unshift(newApplication);

    res.status(201).json({
      status: 'success',
      application: newApplication,
      message: 'Application submitted successfully! The mentor has been notified.'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   GET /api/applications/student
// @desc    Get all applications submitted by logged-in student
router.get('/student', protect, restrictTo('student'), (req, res) => {
  try {
    const myApps = store.applications.filter(a => a.studentId === req.user.id);
    
    // Enrich with project details
    const enriched = myApps.map(app => {
      const proj = store.projects.find(p => p.id === app.projectId);
      return {
        ...app,
        project: proj || { title: app.projectTitle, mentorName: 'Mentor' }
      };
    });

    res.status(200).json({
      status: 'success',
      count: enriched.length,
      applications: enriched
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   GET /api/applications/mentor
// @desc    Get all applications for logged-in mentor's projects
router.get('/mentor', protect, restrictTo('mentor'), (req, res) => {
  try {
    const myProjects = store.projects.filter(p => p.mentorId === req.user.id);
    const myProjectIds = myProjects.map(p => p.id);
    const rawApps = store.applications.filter(a => myProjectIds.includes(a.projectId));

    // Enrich applications with project info, live match score, and student CV
    const enriched = rawApps.map(app => {
      const proj = myProjects.find(p => p.id === app.projectId);
      const student = store.users.find(u => u.id === app.studentId);
      const skills = student?.skills || app.studentSkills || [];
      const score = app.matchScore || (proj ? calculateSkillMatch(skills, proj.requiredSkills) : 85);

      return {
        ...app,
        projectTitle: proj ? proj.title : app.projectTitle || 'Project Opportunity',
        projectDomain: proj ? proj.domain : 'General',
        studentSkills: skills,
        resumeName: student?.resumeName || app.resumeName || 'Student_CV.pdf',
        resumeUrl: student?.resumeUrl || app.resumeUrl || '',
        matchScore: score
      };
    });

    // Sort by matchScore descending (Smart Skill-Ranked Inbox!)
    enriched.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    res.status(200).json({
      status: 'success',
      count: enriched.length,
      applications: enriched
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Mentor accepts or rejects an application (Auto team formation on acceptance)
router.put('/:id/status', protect, restrictTo('mentor'), (req, res) => {
  try {
    const { status, remarks } = req.body; // 'accepted' | 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Status must be accepted or rejected.' });
    }

    const application = store.applications.find(a => a.id === req.params.id);
    if (!application) {
      return res.status(404).json({ status: 'error', message: 'Application not found.' });
    }

    const project = store.projects.find(p => p.id === application.projectId);
    if (!project || project.mentorId !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'You can only review applications for your own projects.' });
    }

    application.status = status;
    application.reviewedAt = new Date().toISOString();
    if (remarks) application.remarks = remarks;

    // Automatic Team Formation on Acceptance
    if (status === 'accepted') {
      let team = store.teams.find(t => t.projectId === project.id);
      
      if (!team) {
        team = {
          id: `team_${project.id}`,
          projectId: project.id,
          projectTitle: project.title,
          mentorId: req.user.id,
          mentorName: req.user.fullName,
          members: [],
          createdAt: new Date().toISOString()
        };
        store.teams.push(team);
      }

      // Check if team is already full
      if (team.members.length >= project.teamSizeRequired) {
        return res.status(400).json({
          status: 'error',
          message: `Cannot accept candidate: Project team has reached its capacity limit of ${project.teamSizeRequired} students.`
        });
      }

      // Check if student already in team
      const alreadyInTeam = team.members.some(m => m.studentId === application.studentId);
      if (!alreadyInTeam) {
        team.members.push({
          studentId: application.studentId,
          name: application.studentName,
          email: application.studentEmail,
          dept: application.studentDept,
          role: 'Team Collaborator',
          joinedAt: new Date().toISOString()
        });
      }
    }

    res.status(200).json({
      status: 'success',
      application,
      message: `Application marked as ${status}. ${status === 'accepted' ? 'Student added to project team!' : ''}`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Student removes/archives an application from My Applications once done
router.delete('/:id', protect, (req, res) => {
  try {
    const appIndex = store.applications.findIndex(a => a.id === req.params.id);
    if (appIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Application not found.' });
    }

    const application = store.applications[appIndex];
    if (application.studentId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'You can only remove your own applications.' });
    }

    store.applications.splice(appIndex, 1);
    res.status(200).json({ status: 'success', message: 'Application removed from your list.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
