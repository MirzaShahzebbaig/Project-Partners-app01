import express from 'express';
import { store, calculateSkillMatch } from '../data/store.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/projects
// @desc    Fetch all projects with filters, live checklist progress, and skill match
router.get('/', (req, res) => {
  try {
    const { search, domain, skill, mentorId, studentSkills } = req.query;
    let list = [...store.projects];

    if (mentorId) {
      list = list.filter(p => p.mentorId === mentorId || p.coMentors?.some(cm => cm.mentorId === mentorId));
    }

    if (domain && domain !== 'all') {
      list = list.filter(p => p.domain.toLowerCase() === domain.toLowerCase());
    }

    if (skill) {
      list = list.filter(p => p.requiredSkills.some(s => s.toLowerCase() === skill.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.problemStatement.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.mentorName.toLowerCase().includes(q) ||
        p.requiredSkills.some(s => s.toLowerCase().includes(q))
      );
    }

    let parsedStudentSkills = [];
    if (studentSkills) {
      try {
        parsedStudentSkills = Array.isArray(studentSkills) ? studentSkills : JSON.parse(studentSkills);
      } catch (e) {
        parsedStudentSkills = studentSkills.split(',').map(s => s.trim());
      }
    }

    // Enrich projects with team members, capacity, checklist progress %, and match score
    const enriched = list.map(project => {
      const team = store.teams.find(t => t.projectId === project.id);
      const teamCount = team ? team.members.length : 0;
      const apps = store.applications.filter(a => a.projectId === project.id);
      const isFull = teamCount >= project.teamSizeRequired;

      const checklist = project.checklist || [];
      const completedTasks = checklist.filter(c => c.completed).length;
      const progressPercent = checklist.length > 0 ? Math.round((completedTasks / checklist.length) * 100) : 0;

      const matchScore = parsedStudentSkills.length > 0 
        ? calculateSkillMatch(parsedStudentSkills, project.requiredSkills) 
        : 85;

      return {
        ...project,
        currentTeamSize: teamCount,
        isFull: isFull || project.isCompleted,
        status: project.isCompleted ? 'completed' : isFull ? 'full' : project.status,
        applicationCount: apps.length,
        progressPercent,
        completedTasks,
        totalTasks: checklist.length,
        matchScore
      };
    });

    res.status(200).json({
      status: 'success',
      count: enriched.length,
      projects: enriched
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/projects
// @desc    Publish a new project opportunity (Mentors only)
router.post('/', protect, restrictTo('mentor'), (req, res) => {
  try {
    const { 
      title, 
      problemStatement, 
      domain, 
      requiredSkills, 
      teamSizeRequired, 
      durationWeeks, 
      deadline,
      stipendAmount
    } = req.body;

    if (!title || !problemStatement || !domain || !requiredSkills) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide project title, problem statement, domain, and required skills.'
      });
    }

    const newProject = {
      id: `proj_${Date.now()}`,
      mentorId: req.user.id,
      mentorName: req.user.fullName,
      mentorDept: req.user.department,
      coMentors: [],
      title: title.trim(),
      problemStatement: problemStatement.trim(),
      domain: domain.trim(),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map(s => s.trim()),
      teamSizeRequired: Number(teamSizeRequired) || 4,
      durationWeeks: Number(durationWeeks) || 12,
      deadline: deadline || new Date(Date.now() + 3600000 * 24 * 30).toISOString().split('T')[0],
      stipendAmount: stipendAmount || 'Performance Stipend & Certificate',
      status: 'open',
      isCompleted: false,
      completedAt: null,
      checklist: [
        { id: `chk_${Date.now()}_1`, title: 'Project Kickoff & Architecture Blueprint', description: 'Review system requirements and repository setup.', assignedTo: null, assignedToName: 'Unassigned', completed: false, completedAt: null },
        { id: `chk_${Date.now()}_2`, title: 'Core Feature Sprint & API Delivery', description: 'Build and document core modules.', assignedTo: null, assignedToName: 'Unassigned', completed: false, completedAt: null },
        { id: `chk_${Date.now()}_3`, title: 'Final Testing, Verification & Defense Demo', description: 'Complete integration tests and viva preparation.', assignedTo: null, assignedToName: 'Unassigned', completed: false, completedAt: null }
      ],
      createdAt: new Date().toISOString()
    };

    store.projects.unshift(newProject);

    res.status(201).json({
      status: 'success',
      project: newProject,
      message: 'Project opportunity published successfully!'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   PUT /api/projects/:id/finish
// @desc    End project - Visible ONLY to the mentor who owns the project (Points 2, 4, 10)
router.put('/:id/finish', protect, restrictTo('mentor'), (req, res) => {
  try {
    const project = store.projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ status: 'error', message: 'Project not found.' });
    }

    // Only the project mentor or co-mentor can finish/end the project
    const isOwner = project.mentorId === req.user.id || project.coMentors?.some(cm => cm.mentorId === req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        status: 'error',
        message: 'Permission denied: Only the guiding faculty mentor can end and finalize this project.'
      });
    }

    project.isCompleted = true;
    project.status = 'completed';
    project.completedAt = new Date().toISOString();

    // Mark all checklist items as completed if not already
    project.checklist = (project.checklist || []).map(item => ({
      ...item,
      completed: true,
      completedAt: item.completedAt || new Date().toISOString()
    }));

    // Auto-generate certificates for all accepted team members
    const team = store.teams.find(t => t.projectId === project.id);
    const generatedCerts = [];

    if (team && team.members) {
      team.members.forEach(member => {
        const certId = `PP-CERT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const cert = {
          id: `cert_${Date.now()}_${member.studentId}`,
          certId,
          studentId: member.studentId,
          studentName: member.name,
          projectId: project.id,
          projectTitle: project.title,
          mentorName: project.mentorName,
          mentorDesignation: req.user.designation || 'Faculty Mentor',
          institution: req.user.college || 'National Institute of Technology',
          grade: 'Distinction (A+)',
          issueDate: new Date().toISOString().split('T')[0],
          stipendDisbursed: project.stipendAmount || 'Academic Honors Certificate',
          verificationUrl: `https://projectpartner.college.edu/verify/${certId}`
        };
        store.certificates.push(cert);
        generatedCerts.push(cert);

        // Add certificate badge to student
        const studentUser = store.users.find(u => u.id === member.studentId);
        if (studentUser && !studentUser.badges.includes('📜 Certified Scholar')) {
          studentUser.badges.push('📜 Certified Scholar');
        }
      });
    }

    res.status(200).json({
      status: 'success',
      project,
      certificates: generatedCerts,
      message: `Project "${project.title}" marked as COMPLETED! Completion certificates generated for all teammates.`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/projects/:id/checklist
// @desc    Add a checklist item (Mentor or Student Project Head)
router.post('/:id/checklist', protect, (req, res) => {
  try {
    const { title, description, assignedTo, assignedToName } = req.body;
    const project = store.projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ status: 'error', message: 'Project not found.' });

    if (!title || !title.trim()) {
      return res.status(400).json({ status: 'error', message: 'Checklist title is required.' });
    }

    if (!project.checklist) project.checklist = [];

    const newItem = {
      id: `chk_${Date.now()}`,
      title: title.trim(),
      description: description ? description.trim() : '',
      assignedTo: assignedTo || null,
      assignedToName: assignedToName || 'Unassigned',
      completed: false,
      completedAt: null
    };

    project.checklist.push(newItem);

    res.status(201).json({
      status: 'success',
      checklist: project.checklist,
      newItem,
      message: 'Task checklist item added!'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   PUT /api/projects/:id/checklist/:itemId/toggle
// @desc    Tick / Untick progress checklist item (Point 3, 10)
router.put('/:id/checklist/:itemId/toggle', protect, (req, res) => {
  try {
    const project = store.projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ status: 'error', message: 'Project not found.' });

    const item = (project.checklist || []).find(c => c.id === req.params.itemId);
    if (!item) return res.status(404).json({ status: 'error', message: 'Checklist item not found.' });

    item.completed = !item.completed;
    item.completedAt = item.completed ? new Date().toISOString() : null;

    const total = project.checklist.length;
    const completed = project.checklist.filter(c => c.completed).length;
    const progressPercent = Math.round((completed / total) * 100);

    // If 100% progress reached, flag for completion
    const is100Percent = progressPercent === 100;

    res.status(200).json({
      status: 'success',
      item,
      checklist: project.checklist,
      progressPercent,
      is100Percent,
      message: `Task ${item.completed ? 'completed (ticked) ✓' : 'reopened'}. Progress: ${progressPercent}%`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   PUT /api/projects/:id/checklist/:itemId/assign
// @desc    Designate work to a specific student teammate (Point 6)
router.put('/:id/checklist/:itemId/assign', protect, (req, res) => {
  try {
    const { studentId, studentName } = req.body;
    const project = store.projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ status: 'error', message: 'Project not found.' });

    const item = (project.checklist || []).find(c => c.id === req.params.itemId);
    if (!item) return res.status(404).json({ status: 'error', message: 'Checklist item not found.' });

    item.assignedTo = studentId;
    item.assignedToName = studentName;

    // Update student's active current task in team roster
    const team = store.teams.find(t => t.projectId === project.id);
    if (team) {
      const member = team.members.find(m => m.studentId === studentId);
      if (member) member.currentTask = item.title;
    }

    res.status(200).json({
      status: 'success',
      item,
      message: `Work designated: "${item.title}" assigned to ${studentName}.`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/projects/:id/co-mentor
// @desc    Add a collaborative co-mentor to the project (Point 5, 6)
router.post('/:id/co-mentor', protect, restrictTo('mentor'), (req, res) => {
  try {
    const { coMentorId } = req.body;
    const project = store.projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ status: 'error', message: 'Project not found.' });

    const coMentorUser = store.users.find(u => u.id === coMentorId && u.role === 'mentor');
    if (!coMentorUser) {
      return res.status(404).json({ status: 'error', message: 'Selected mentor not found.' });
    }

    if (!project.coMentors) project.coMentors = [];

    if (!project.coMentors.some(cm => cm.mentorId === coMentorId)) {
      project.coMentors.push({
        mentorId: coMentorUser.id,
        mentorName: coMentorUser.fullName,
        mentorDept: coMentorUser.department
      });
    }

    // Add co-mentor announcement message
    store.messages.push({
      id: `msg_${Date.now()}`,
      projectId: project.id,
      channel: 'co_mentor',
      senderId: req.user.id,
      senderName: req.user.fullName,
      senderRole: 'mentor',
      text: `Hello ${coMentorUser.fullName}! Welcome to the co-mentored project "${project.title}". We can use this private channel to align on student tasks.`,
      createdAt: new Date().toISOString()
    });

    res.status(200).json({
      status: 'success',
      coMentors: project.coMentors,
      message: `Prof. ${coMentorUser.fullName} added as Co-Mentor!`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   GET /api/projects/mentors
// @desc    Get list of mentors for co-mentoring or student invitation
router.get('/mentors/all', (req, res) => {
  try {
    const mentors = store.users
      .filter(u => u.role === 'mentor')
      .map(m => ({
        id: m.id,
        fullName: m.fullName,
        department: m.department,
        designation: m.designation,
        college: m.college,
        expertise: m.expertise || [],
        ratingAvg: m.ratingAvg || 4.9
      }));

    res.status(200).json({ status: 'success', mentors });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Mentor deletes their project
router.delete('/:id', protect, restrictTo('mentor', 'admin'), (req, res) => {
  try {
    const idx = store.projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ status: 'error', message: 'Project not found.' });
    }

    const project = store.projects[idx];
    if (req.user.role === 'mentor' && project.mentorId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Permission denied: You can only delete projects you have published.'
      });
    }

    store.projects.splice(idx, 1);
    store.applications = store.applications.filter(a => a.projectId !== req.params.id);
    store.teams = store.teams.filter(t => t.projectId !== req.params.id);
    store.messages = (store.messages || []).filter(m => m.projectId !== req.params.id);

    res.status(200).json({
      status: 'success',
      message: `Project "${project.title}" deleted.`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// =========================================================================
// STUDENT-LED INDEPENDENT PROJECTS HUB (Point 5)
// =========================================================================

// @route   GET /api/projects/independent
// @desc    Get all student-led independent projects
router.get('/independent/all', (req, res) => {
  try {
    const list = store.independentProjects || [];
    res.status(200).json({
      status: 'success',
      count: list.length,
      projects: list
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/projects/independent
// @desc    Student creates an independent project to team up with peers
router.post('/independent', protect, restrictTo('student'), (req, res) => {
  try {
    const { title, problemStatement, domain, requiredSkills, teamSize } = req.body;

    if (!title || !problemStatement || !requiredSkills) {
      return res.status(400).json({ status: 'error', message: 'Title, problem statement, and skills are required.' });
    }

    const newIndep = {
      id: `indep_${Date.now()}`,
      creatorId: req.user.id,
      creatorName: req.user.fullName,
      creatorDept: `${req.user.department}, ${req.user.yearOfStudy || 'Student'}`,
      title: title.trim(),
      problemStatement: problemStatement.trim(),
      domain: domain || 'Full-Stack Web',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map(s => s.trim()),
      teamSize: Number(teamSize) || 3,
      currentMembers: [
        {
          studentId: req.user.id,
          name: req.user.fullName,
          dept: `${req.user.department}, ${req.user.yearOfStudy}`,
          role: 'Project Head & Founder',
          currentTask: 'Project Initialization'
        }
      ],
      invitedMentors: [],
      status: 'open',
      createdAt: new Date().toISOString()
    };

    if (!store.independentProjects) store.independentProjects = [];
    store.independentProjects.unshift(newIndep);

    res.status(201).json({
      status: 'success',
      project: newIndep,
      message: 'Independent student project created! Other students can now team up with you.'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/projects/independent/:id/join
// @desc    Another student teams up and joins an independent project
router.post('/independent/:id/join', protect, restrictTo('student'), (req, res) => {
  try {
    const project = (store.independentProjects || []).find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ status: 'error', message: 'Project not found.' });

    if (project.currentMembers.length >= project.teamSize) {
      return res.status(400).json({ status: 'error', message: 'This student project team is already full!' });
    }

    if (project.currentMembers.some(m => m.studentId === req.user.id)) {
      return res.status(400).json({ status: 'error', message: 'You are already a teammate in this project.' });
    }

    project.currentMembers.push({
      studentId: req.user.id,
      name: req.user.fullName,
      dept: `${req.user.department}, ${req.user.yearOfStudy}`,
      role: 'Team Collaborator',
      currentTask: 'Sprint Planning'
    });

    res.status(200).json({
      status: 'success',
      project,
      message: `You have joined "${project.title}"! Time to collaborate.`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/projects/independent/:id/invite-mentor
// @desc    Students invite a faculty mentor to advise their independent project (Point 5)
router.post('/independent/:id/invite-mentor', protect, restrictTo('student'), (req, res) => {
  try {
    const { mentorId, inviteMessage } = req.body;
    const project = (store.independentProjects || []).find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ status: 'error', message: 'Project not found.' });

    const mentor = store.users.find(u => u.id === mentorId && u.role === 'mentor');
    if (!mentor) return res.status(404).json({ status: 'error', message: 'Faculty mentor not found.' });

    if (!project.invitedMentors) project.invitedMentors = [];

    // Check if already invited
    const existing = project.invitedMentors.find(im => im.mentorId === mentor.id);
    if (existing) {
      existing.status = 'pending';
      existing.remarks = inviteMessage || 'Student team requested your guidance.';
      existing.invitedAt = new Date().toISOString();
    } else {
      project.invitedMentors.push({
        mentorId: mentor.id,
        mentorName: mentor.fullName,
        mentorDept: mentor.department,
        mentorDesignation: mentor.designation || 'Faculty Mentor',
        status: 'pending', // Pending mentor acceptance
        remarks: inviteMessage || 'Students have invited you to advise this project.',
        invitedAt: new Date().toISOString()
      });
    }

    res.status(200).json({
      status: 'success',
      project,
      message: `Invitation sent! Prof. ${mentor.fullName} has received your advisory request.`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   GET /api/projects/independent/advisory-invitations
// @desc    Mentor retrieves advisory invitations from student-led projects
router.get('/independent/advisory-invitations', protect, restrictTo('mentor'), (req, res) => {
  try {
    const indepList = store.independentProjects || [];
    const myInvitations = [];

    indepList.forEach(proj => {
      const invite = (proj.invitedMentors || []).find(im => im.mentorId === req.user.id);
      if (invite) {
        myInvitations.push({
          projectId: proj.id,
          projectTitle: proj.title,
          problemStatement: proj.problemStatement,
          domain: proj.domain,
          creatorName: proj.creatorName,
          creatorDept: proj.creatorDept,
          requiredSkills: proj.requiredSkills,
          currentMembers: proj.currentMembers,
          inviteStatus: invite.status, // 'pending' | 'accepted' | 'rejected'
          remarks: invite.remarks,
          invitedAt: invite.invitedAt
        });
      }
    });

    res.status(200).json({
      status: 'success',
      count: myInvitations.length,
      invitations: myInvitations
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   PUT /api/projects/independent/:id/advisory-decision
// @desc    Mentor accepts or rejects the advisory role
router.put('/independent/:id/advisory-decision', protect, restrictTo('mentor'), (req, res) => {
  try {
    const { decision, remarks } = req.body; // 'accepted' | 'rejected'
    if (!['accepted', 'rejected'].includes(decision)) {
      return res.status(400).json({ status: 'error', message: 'Decision must be accepted or rejected.' });
    }

    const project = (store.independentProjects || []).find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ status: 'error', message: 'Project not found.' });

    const invite = (project.invitedMentors || []).find(im => im.mentorId === req.user.id);
    if (!invite) {
      return res.status(404).json({ status: 'error', message: 'No advisory invitation found for you on this project.' });
    }

    invite.status = decision;
    if (remarks) invite.remarks = remarks;
    invite.decidedAt = new Date().toISOString();

    res.status(200).json({
      status: 'success',
      decision,
      project,
      message: `You have ${decision} the advisory invitation for "${project.title}".`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   POST /api/projects/independent/:id/assign-work
// @desc    Mentor or lead assigns work/task to a student member
router.post('/independent/:id/assign-work', protect, (req, res) => {
  try {
    const { studentId, task } = req.body;
    if (!studentId || !task) {
      return res.status(400).json({ status: 'error', message: 'Student and task are required.' });
    }

    const project = (store.independentProjects || []).find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ status: 'error', message: 'Project not found.' });

    const member = (project.currentMembers || []).find(m => m.studentId === studentId);
    if (!member) return res.status(404).json({ status: 'error', message: 'Student is not in this project.' });

    member.currentTask = task.trim();

    res.status(200).json({
      status: 'success',
      member,
      message: `Work designated: "${task}" assigned to ${member.name}.`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
