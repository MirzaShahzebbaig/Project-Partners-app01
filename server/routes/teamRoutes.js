import express from 'express';
import { store } from '../data/store.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/teams/my
// @desc    Get all teams for the logged-in student or mentor
router.get('/my', protect, (req, res) => {
  try {
    let myTeams = [];

    if (req.user.role === 'student') {
      // Auto-sync accepted applications to teams
      const acceptedApps = (store.applications || []).filter(
        a => a.studentId === req.user.id && a.status === 'accepted'
      );

      acceptedApps.forEach(app => {
        let team = store.teams.find(t => t.projectId === app.projectId);
        const proj = store.projects.find(p => p.id === app.projectId);
        if (!team && proj) {
          team = {
            id: `team_${proj.id}`,
            projectId: proj.id,
            projectTitle: proj.title,
            mentorId: proj.mentorId,
            mentorName: proj.mentorName,
            members: [],
            createdAt: new Date().toISOString()
          };
          store.teams.push(team);
        }
        if (team && !team.members.some(m => m.studentId === req.user.id)) {
          team.members.push({
            studentId: req.user.id,
            name: req.user.fullName,
            email: req.user.email,
            dept: `${req.user.department || 'Engineering'}, ${req.user.yearOfStudy || 'Student'}`,
            role: 'Team Collaborator',
            currentTask: 'Deliverable sprint execution',
            isActive: true,
            hoursLogged: 24,
            joinedAt: new Date().toISOString()
          });
        }
      });

      myTeams = store.teams.filter(t => t.members.some(m => m.studentId === req.user.id));

      // Also include student's active independent projects as collaborative teams
      const myIndep = (store.independentProjects || []).filter(
        ip => (ip.currentMembers || []).some(m => m.studentId === req.user.id)
      );

      myIndep.forEach(ip => {
        const advisor = (ip.invitedMentors || []).find(im => im.status === 'accepted');
        myTeams.push({
          id: `team_${ip.id}`,
          projectId: ip.id,
          projectTitle: ip.title,
          mentorId: advisor ? advisor.mentorId : null,
          mentorName: advisor ? `${advisor.mentorName} (Faculty Advisor)` : 'Student-Led Team',
          isIndependent: true,
          problemStatement: ip.problemStatement,
          domain: ip.domain || 'Full-Stack Web',
          members: ip.currentMembers.map(m => ({
            ...m,
            isActive: true,
            hoursLogged: 20
          })),
          createdAt: ip.createdAt
        });
      });
    } else if (req.user.role === 'mentor') {
      myTeams = store.teams.filter(t => t.mentorId === req.user.id);
    } else if (req.user.role === 'admin') {
      myTeams = [...store.teams];
    }

    // Enrich teams with project details, checklist, and milestones
    const enriched = myTeams.map(team => {
      const proj = store.projects.find(p => p.id === team.projectId);
      const checklist = proj?.checklist || [];
      const milestones = store.milestones.filter(m => m.projectId === team.projectId);
      const totalItems = checklist.length > 0 ? checklist.length : milestones.length;
      const completedCount = checklist.length > 0
        ? checklist.filter(c => c.completed).length
        : milestones.filter(m => m.completed).length;
      const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

      return {
        ...team,
        domain: proj ? proj.domain : (team.domain || 'General'),
        checklist,
        milestones,
        progressPercent,
        isCompleted: proj ? proj.isCompleted : false
      };
    });

    res.status(200).json({
      status: 'success',
      count: enriched.length,
      teams: enriched
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
