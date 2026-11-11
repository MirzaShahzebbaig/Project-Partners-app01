import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  PlusCircle, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FolderGit2, 
  Sparkles, 
  Check, 
  X, 
  Send, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Tag,
  ShieldCheck,
  FileText,
  Trash2,
  MessageSquare,
  Lock,
  Award,
  DollarSign,
  UserCheck,
  Star,
  Activity,
  UserPlus,
  Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import TeamChat from '../../components/TeamChat';

export default function MentorDashboard() {
  const { user, logout } = useAuth();

  // Active Tab: 'applicants' | 'projects' | 'teams' | 'profile'
  const [activeTab, setActiveTab] = useState('applicants');

  // Applications
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Projects
  const [myProjects, setMyProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // All Mentors for Co-Mentor collaboration
  const [allMentors, setAllMentors] = useState([]);

  // Teams
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Publish Project Modal State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newDomain, setNewDomain] = useState('AI & Robotics');
  const [newSkills, setNewSkills] = useState(['Python', 'PyTorch']);
  const [skillInput, setSkillInput] = useState('');
  const [newTeamSize, setNewTeamSize] = useState(4);
  const [newDuration, setNewDuration] = useState(12);
  const [newDeadline, setNewDeadline] = useState('2026-12-30');
  const [newStipend, setNewStipend] = useState('₹6,000 / Month (Research Grant)');
  const [publishing, setPublishing] = useState(false);
  const [publishMsg, setPublishMsg] = useState('');

  // Finish Project / End Project Modal State
  const [projectToFinish, setProjectToFinish] = useState(null);
  const [finishStipend, setFinishStipend] = useState('₹18,000 Total Research Grant');
  const [finishGrade, setFinishGrade] = useState('Distinction (A+)');
  const [finishing, setFinishing] = useState(false);
  const [finishSuccess, setFinishSuccess] = useState('');

  // Add Checklist Item State
  const [checklistProject, setChecklistProject] = useState(null);
  const [checklistItemTitle, setChecklistItemTitle] = useState('');
  const [checklistItemDesc, setChecklistItemDesc] = useState('');
  const [checklistAssignee, setChecklistAssignee] = useState('');

  // Add Milestone Modal State
  const [selectedTeamForMilestone, setSelectedTeamForMilestone] = useState(null);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneDue, setMilestoneDue] = useState('2026-12-15');
  const [addingMilestone, setAddingMilestone] = useState(false);

  // Invite Co-Mentor Modal State
  const [coMentorProject, setCoMentorProject] = useState(null);
  const [selectedCoMentorId, setSelectedCoMentorId] = useState('');
  const [coMentorSuccess, setCoMentorSuccess] = useState('');

  // Rate Student Modal State
  const [studentToRate, setStudentToRate] = useState(null);
  const [rateScore, setRateScore] = useState(5);
  const [rateReview, setRateReview] = useState('');
  const [rateSuccess, setRateSuccess] = useState('');

  // Advisory Invitations from Student-Led Projects
  const [advisoryInvitations, setAdvisoryInvitations] = useState([]);
  const [assignTaskInputs, setAssignTaskInputs] = useState({});

  // Load Mentor Applications
  const loadApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await api.getMentorApplications();
      if (res.status === 'success') {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  // Load Advisory Invitations
  const loadAdvisoryInvitations = async () => {
    try {
      const res = await api.getAdvisoryInvitations();
      if (res.status === 'success') {
        setAdvisoryInvitations(res.invitations);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Load Mentor Projects
  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await api.getProjects({ mentorId: user?.id });
      if (res.status === 'success') {
        setMyProjects(res.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Load Teams
  const loadTeams = async () => {
    setLoadingTeams(true);
    try {
      const res = await api.getMyTeams();
      if (res.status === 'success') {
        setTeams(res.teams);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTeams(false);
    }
  };

  // Load Available Mentors for Collaboration
  const loadMentors = async () => {
    try {
      const res = await api.getAllMentors();
      if (res.status === 'success') {
        setAllMentors(res.mentors.filter(m => m.id !== user?.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadApplications();
    loadAdvisoryInvitations();
    loadProjects();
    loadTeams();
    loadMentors();
  }, []);

  // Handle Mentor Accept / Reject of Advisory Invitation
  const handleAdvisoryDecision = async (projectId, decision) => {
    const remarks = prompt(
      `Enter remarks for ${decision === 'accepted' ? 'accepting' : 'declining'} this advisory invitation:`,
      decision === 'accepted' ? 'Pleased to advise your student-led project team!' : 'Unable to advise at this time.'
    );
    if (remarks === null) return;
    try {
      const res = await api.respondToAdvisoryInvitation(projectId, decision, remarks);
      if (res.status === 'success') {
        alert(res.message);
        loadAdvisoryInvitations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Mentor Assigning Work to Student in Advisory Project
  const handleAssignWorkToStudent = async (projectId, studentId) => {
    const task = assignTaskInputs[`${projectId}_${studentId}`];
    if (!task || !task.trim()) {
      alert('Please enter a task description before assigning.');
      return;
    }
    try {
      const res = await api.assignWorkToStudent(projectId, studentId, task.trim());
      if (res.status === 'success') {
        alert(res.message);
        setAssignTaskInputs(prev => ({ ...prev, [`${projectId}_${studentId}`]: '' }));
        loadAdvisoryInvitations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Application Accept or Reject
  const handleReviewApplication = async (appId, status) => {
    try {
      const res = await api.updateApplicationStatus(appId, status, `Reviewed and ${status} by faculty mentor.`);
      if (res.status === 'success') {
        loadApplications();
        loadTeams();
        loadProjects();
      } else {
        alert(res.message || 'Error updating status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Project Handler
  const handleDeleteProject = async (projId) => {
    if (!window.confirm('Are you sure you want to delete this project? All associated team and checklist records will be archived.')) return;
    try {
      const res = await api.deleteProject(projId);
      if (res.status === 'success') {
        loadProjects();
        loadTeams();
        loadApplications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Publish Project Handler
  const handlePublishProject = async (e) => {
    e.preventDefault();
    setPublishing(true);
    setPublishMsg('');

    try {
      const res = await api.createProject({
        title: newTitle,
        problemStatement: newProblem,
        domain: newDomain,
        requiredSkills: newSkills,
        teamSizeRequired: Number(newTeamSize),
        durationWeeks: Number(newDuration),
        deadline: newDeadline,
        stipendAmount: newStipend
      });

      if (res.status === 'success') {
        setPublishMsg('Project opportunity published successfully!');
        setTimeout(() => {
          setShowPublishModal(false);
          setPublishMsg('');
          setNewTitle('');
          setNewProblem('');
          loadProjects();
          setActiveTab('projects');
        }, 1200);
      }
    } catch (err) {
      setPublishMsg('Failed to publish project.');
    } finally {
      setPublishing(false);
    }
  };

  // Toggle Checklist Item
  const handleToggleChecklist = async (projectId, itemId) => {
    try {
      const res = await api.toggleChecklistItem(projectId, itemId);
      if (res.status === 'success') {
        loadProjects();
        loadTeams();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Checklist Item
  const handleAddChecklistSubmit = async (e) => {
    e.preventDefault();
    if (!checklistProject || !checklistItemTitle) return;

    try {
      const selectedMember = checklistProject.currentTeam?.find(m => m.studentId === checklistAssignee);
      const res = await api.addChecklistItem(checklistProject.id, {
        title: checklistItemTitle,
        description: checklistItemDesc,
        assignedTo: checklistAssignee || null,
        assignedToName: selectedMember ? selectedMember.name : (checklistAssignee ? checklistAssignee : 'Unassigned')
      });

      if (res.status === 'success') {
        setChecklistItemTitle('');
        setChecklistItemDesc('');
        setChecklistAssignee('');
        setChecklistProject(null);
        loadProjects();
        loadTeams();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Finish / End Project Handler (Issues certificates & closes project)
  const handleFinishProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectToFinish) return;

    setFinishing(true);
    try {
      const res = await api.finishProject(projectToFinish.id, {
        stipendAmount: finishStipend,
        distinctionGrade: finishGrade
      });

      if (res.status === 'success') {
        setFinishSuccess(`Project successfully completed! ${res.certificatesIssued || 'Verified'} completion certificates issued to all student teammates.`);
        setTimeout(() => {
          setProjectToFinish(null);
          setFinishSuccess('');
          loadProjects();
          loadTeams();
        }, 2000);
      } else {
        alert(res.message || 'Failed to complete project.');
      }
    } catch (err) {
      alert('Error finalizing project.');
    } finally {
      setFinishing(false);
    }
  };

  // Invite Co-Mentor Handler
  const handleInviteCoMentorSubmit = async (e) => {
    e.preventDefault();
    if (!coMentorProject || !selectedCoMentorId) return;

    try {
      const res = await api.addCoMentor(coMentorProject.id, selectedCoMentorId);
      if (res.status === 'success') {
        setCoMentorSuccess('Co-mentor invited to collaborate! Collaborative workspace enabled.');
        setTimeout(() => {
          setCoMentorProject(null);
          setSelectedCoMentorId('');
          setCoMentorSuccess('');
          loadProjects();
          loadTeams();
        }, 1500);
      } else {
        alert(res.message || 'Failed to add co-mentor.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Rate Student Submit
  const handleRateStudentSubmit = async (e) => {
    e.preventDefault();
    if (!studentToRate) return;

    try {
      const res = await api.submitFeedback({
        projectId: studentToRate.projectId,
        toUserId: studentToRate.studentId,
        rating: rateScore,
        reviewText: rateReview
      });

      if (res.status === 'success') {
        setRateSuccess('Performance evaluation and rating recorded for student portfolio!');
        setTimeout(() => {
          setStudentToRate(null);
          setRateReview('');
          setRateSuccess('');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Milestone Handler
  const handleAddMilestoneSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeamForMilestone) return;

    setAddingMilestone(true);
    try {
      const res = await api.addMilestone({
        projectId: selectedTeamForMilestone.projectId,
        title: milestoneTitle,
        description: milestoneDesc,
        dueDate: milestoneDue
      });

      if (res.status === 'success') {
        setSelectedTeamForMilestone(null);
        setMilestoneTitle('');
        setMilestoneDesc('');
        loadTeams();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingMilestone(false);
    }
  };

  const handleToggleMilestone = async (id) => {
    try {
      await api.toggleMilestone(id);
      loadTeams();
    } catch (err) {
      console.error(err);
    }
  };

  const addRequiredSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !newSkills.includes(skillInput.trim())) {
      setNewSkills([...newSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: Are you sure you want to permanently delete your mentor account? All your profile information and active projects will be removed.')) {
      try {
        const res = await api.deleteAccount();
        if (res.status === 'success') {
          alert('Account deleted successfully.');
          logout();
          window.location.href = '/';
        }
      } catch (err) {
        alert('Failed to delete account.');
      }
    }
  };

  const pendingAppsCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      
      {/* =========================================================================
          BANNER: MENTOR STUDIO IDENTITY
          ========================================================================= */}
      <div className="glass-panel" style={{
        padding: '2rem',
        borderRadius: '1.25rem',
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(79, 70, 229, 0.15) 100%)',
        border: '1px solid rgba(124, 58, 237, 0.3)',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '3.75rem',
            height: '3.75rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)'
          }}>
            <Briefcase size={28} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                {user?.fullName || 'Faculty Mentor'}
              </h1>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                {user?.designation || 'Faculty Lead'}
              </span>
              <span className="badge badge-indigo" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={12} fill="#fbbf24" color="#fbbf24" /> {user?.ratingAvg || 4.9} ({user?.ratingsCount || 12} reviews)
              </span>
            </div>
            <p style={{ color: '#c7d2fe', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              {user?.department || 'Computer Science & Engineering'} • {user?.college || 'National Institute of Technology'}
            </p>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
              {(user?.badges || ['🌟 Top Mentor', '💡 Code Architect', '🤝 Co-Mentor Collaborator']).map(b => (
                <span key={b} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => setShowPublishModal(true)}
            className="btn btn-primary"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)', boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)' }}
          >
            <PlusCircle size={18} /> Publish New Project
          </button>
        </div>
      </div>

      {/* =========================================================================
          NAVIGATION TABS
          ========================================================================= */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '2rem',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        <button
          onClick={() => setActiveTab('applicants')}
          className={`tab-btn ${activeTab === 'applicants' ? 'active' : ''}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'applicants' ? '3px solid #7c3aed' : '3px solid transparent',
            color: activeTab === 'applicants' ? '#c084fc' : '#94a3b8',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Users size={18} />
          Applicant & Advisory Desk
          {(pendingAppsCount + advisoryInvitations.filter(i => i.inviteStatus === 'pending').length) > 0 && (
            <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.75rem', borderRadius: '9999px', padding: '0.1rem 0.5rem', fontWeight: '800' }}>
              {pendingAppsCount + advisoryInvitations.filter(i => i.inviteStatus === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'projects' ? '3px solid #7c3aed' : '3px solid transparent',
            color: activeTab === 'projects' ? '#c084fc' : '#94a3b8',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FolderGit2 size={18} />
          My Projects & Checklists ({myProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'teams' ? '3px solid #7c3aed' : '3px solid transparent',
            color: activeTab === 'teams' ? '#c084fc' : '#94a3b8',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Users size={18} />
          Teams, Work Activity & Collaboration
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'profile' ? '3px solid #7c3aed' : '3px solid transparent',
            color: activeTab === 'profile' ? '#c084fc' : '#94a3b8',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Award size={18} />
          Profile & Portfolio
        </button>
      </div>

      {/* =========================================================================
          TAB 1: APPLICANT REVIEW DESK
          ========================================================================= */}
      {activeTab === 'applicants' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Student Applications For Your Projects</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Review candidates, inspect CVs, and hand-pick students for limited project slots.
              </p>
            </div>
            <button onClick={loadApplications} className="btn btn-secondary btn-sm">Refresh List</button>
          </div>

          {loadingApps ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading student applications...</div>
          ) : applications.length === 0 ? (
            <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', color: '#94a3b8' }}>
              <Users size={36} color="#64748b" style={{ margin: '0 auto 1rem' }} />
              <h3>No student applications received yet.</h3>
              <p style={{ marginTop: '0.5rem' }}>Published projects appear in the student discovery portal automatically!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {applications.map(app => {
                const targetProj = myProjects.find(p => p.id === app.projectId);
                const isProjectFull = targetProj && targetProj.currentTeamSize >= targetProj.teamSizeRequired;

                return (
                  <div key={app.id} className="glass-card" style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.25rem',
                    borderLeft: app.status === 'accepted' ? '4px solid #10b981' : app.status === 'rejected' ? '4px solid #ef4444' : '4px solid #f59e0b'
                  }}>
                    <div style={{ flex: '1 1 350px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <span className={`badge ${app.status === 'accepted' ? 'badge-emerald' : app.status === 'rejected' ? 'badge-rose' : 'badge-amber'}`}>
                          {app.status.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                        {app.studentName}
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.65rem' }}>
                        {app.studentDept} • {app.studentEmail}
                      </p>

                      <div style={{ fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '0.65rem' }}>
                        Applying for: <strong>{app.projectTitle}</strong>
                      </div>

                      {/* Technical Skills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                        {app.studentSkills?.map(s => (
                          <span key={s} className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>{s}</span>
                        ))}
                      </div>

                      {/* Verified Student CV Preview (Requirement 1) */}
                      {app.resumeName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', padding: '0.4rem 0.75rem', backgroundColor: '#090d16', borderRadius: '0.4rem', border: '1px solid rgba(99, 102, 241, 0.2)', width: 'fit-content' }}>
                          <FileText size={15} color="#818cf8" />
                          <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Forwarded CV: <strong>{app.resumeName}</strong></span>
                          <button 
                            type="button" 
                            onClick={() => alert(`Student CV: ${app.resumeName}\nCandidate Profile: ${app.studentName} (${app.studentDept})\nSkills: ${app.studentSkills?.join(', ')}\n\nThis verified resume was attached during student registration.`)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}
                          >
                            Preview CV
                          </button>
                        </div>
                      )}

                      {/* Cover Note */}
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1', backgroundColor: 'rgba(0,0,0,0.25)', padding: '0.6rem 0.85rem', borderRadius: '0.4rem', borderLeft: '3px solid #7c3aed' }}>
                        <strong>Cover Note:</strong> "{app.coverNote}"
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                      <span className="match-score-pill match-high" style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
                        <Sparkles size={14} />
                        {app.matchScore || 85}% Skill Match
                      </span>

                      {app.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {isProjectFull ? (
                            <span className="badge badge-rose" style={{ padding: '0.45rem 0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                              🚫 Team Full ({targetProj.currentTeamSize}/{targetProj.teamSizeRequired})
                            </span>
                          ) : (
                            <button
                              onClick={() => handleReviewApplication(app.id, 'accepted')}
                              className="btn btn-primary btn-sm"
                              style={{ backgroundColor: '#10b981', border: 'none', padding: '0.45rem 0.9rem' }}
                            >
                              <Check size={15} /> Accept to Team
                            </button>
                          )}

                          <button
                            onClick={() => handleReviewApplication(app.id, 'rejected')}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.45rem 0.8rem', color: '#fca5a5' }}
                          >
                            <X size={15} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: app.status === 'accepted' ? '#34d399' : '#f87171', fontWeight: '600' }}>
                          {app.status === 'accepted' ? '✓ Added to Project Team' : 'Decision Finalized'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Student Independent Project Advisory Invitations Section */}
          <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} color="#c084fc" />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>
                    Student Independent Project Advisory Invitations ({advisoryInvitations.length})
                  </h3>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                  Independent student teams requesting your faculty expertise to advise their projects. You can accept/reject and assign work to teammates.
                </p>
              </div>
              <button onClick={loadAdvisoryInvitations} className="btn btn-secondary btn-sm">Refresh Invitations</button>
            </div>

            {advisoryInvitations.length === 0 ? (
              <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                <Award size={32} color="#64748b" style={{ margin: '0 auto 0.75rem' }} />
                <h4>No pending advisory invitations from student teams right now.</h4>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>When students invite you to advise their independent projects, they will appear here with accept/reject and task assignment controls.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {advisoryInvitations.map(inv => (
                  <div key={inv.projectId} className="glass-card" style={{
                    padding: '1.75rem',
                    borderLeft: inv.inviteStatus === 'accepted' ? '4px solid #10b981' : inv.inviteStatus === 'rejected' ? '4px solid #ef4444' : '4px solid #818cf8'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span className="badge badge-purple">{inv.domain}</span>
                          <span className={`badge ${inv.inviteStatus === 'accepted' ? 'badge-emerald' : inv.inviteStatus === 'rejected' ? 'badge-rose' : 'badge-indigo'}`}>
                            {inv.inviteStatus === 'accepted' ? '✓ You Are Advising This Team' : inv.inviteStatus === 'rejected' ? 'Declined' : 'Pending Your Decision'}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{inv.projectTitle}</h4>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                          Created by: <strong style={{ color: '#c7d2fe' }}>{inv.creatorName}</strong> ({inv.creatorDept})
                        </p>
                      </div>

                      {/* Accept / Reject Buttons */}
                      {inv.inviteStatus === 'pending' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleAdvisoryDecision(inv.projectId, 'accepted')}
                            className="btn btn-primary btn-sm"
                            style={{ backgroundColor: '#10b981', border: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <Check size={14} /> Accept to Advise
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdvisoryDecision(inv.projectId, 'rejected')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <X size={14} /> Decline
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.85rem', color: inv.inviteStatus === 'accepted' ? '#34d399' : '#f87171', fontWeight: '700' }}>
                          {inv.inviteStatus === 'accepted' ? '✓ Active Faculty Advisor' : 'Invitation Declined'}
                        </div>
                      )}
                    </div>

                    <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                      {inv.problemStatement}
                    </p>

                    {/* Student Members and Work Assignment */}
                    <div style={{ backgroundColor: '#090d16', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                        Student Team Members & Task Designation:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {inv.currentMembers?.map(m => (
                          <div key={m.studentId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', padding: '0.6rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.4rem' }}>
                            <div>
                              <span style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>{m.name}</span>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.5rem' }}>({m.role || 'Member'})</span>
                              <div style={{ fontSize: '0.8rem', color: '#a78bfa', marginTop: '0.15rem' }}>
                                <strong>Current Assigned Task:</strong> {m.currentTask || 'General sprint contribution'}
                              </div>
                            </div>

                            {inv.inviteStatus === 'accepted' && (
                              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  placeholder="Assign new task / deliverable..."
                                  value={assignTaskInputs[`${inv.projectId}_${m.studentId}`] || ''}
                                  onChange={(e) => setAssignTaskInputs({ ...assignTaskInputs, [`${inv.projectId}_${m.studentId}`]: e.target.value })}
                                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAssignWorkToStudent(inv.projectId, m.studentId); } }}
                                  style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.35rem', color: '#fff', outline: 'none', width: '230px' }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAssignWorkToStudent(inv.projectId, m.studentId)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                                >
                                  Assign Work
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MY PROJECTS & INTERACTIVE CHECKLISTS (Requirements 2, 3, 4, 10)
          ========================================================================= */}
      {activeTab === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Your Published Project Opportunities & Checklists</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Track milestone progress, assign tasks to students, and click <strong>Finish Project</strong> to close entries & issue certificates.
              </p>
            </div>
            <button 
              onClick={() => setShowPublishModal(true)}
              className="btn btn-primary btn-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' }}
            >
              <PlusCircle size={16} /> Publish New Project
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {myProjects.map(proj => {
              const checklist = proj.checklist || [];
              const completedCount = checklist.filter(c => c.completed).length;
              const progressPct = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;
              const is100Percent = checklist.length > 0 && progressPct === 100;

              return (
                <div key={proj.id} className="glass-card" style={{ padding: '2rem', border: proj.isCompleted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
                  
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-purple">{proj.domain}</span>
                        {proj.isCompleted ? (
                          <span className="badge badge-emerald">✓ COMPLETED</span>
                        ) : proj.currentTeamSize >= proj.teamSizeRequired ? (
                          <span className="badge badge-rose">🚫 TEAM FULL ({proj.currentTeamSize}/{proj.teamSizeRequired})</span>
                        ) : (
                          <span className="badge badge-indigo">ACCEPTING CANDIDATES ({proj.currentTeamSize || 0}/{proj.teamSizeRequired})</span>
                        )}
                        {proj.coMentors?.length > 0 && (
                          <span className="badge badge-purple" style={{ backgroundColor: 'rgba(124, 58, 237, 0.25)', border: '1px solid rgba(124, 58, 237, 0.4)' }}>
                            🤝 Co-Mentored with {proj.coMentors.map(c => c.mentorName).join(', ')}
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{proj.title}</h3>
                      <p style={{ color: '#cbd5e1', fontSize: '0.875rem', marginTop: '0.4rem', lineHeight: '1.6', maxWidth: '850px' }}>
                        {proj.problemStatement}
                      </p>
                    </div>

                    {/* Action Buttons for Mentor */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Invite Co-Mentor */}
                      <button
                        onClick={() => setCoMentorProject(proj)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}
                      >
                        <UserPlus size={14} /> Invite Co-Mentor
                      </button>

                      {/* Requirement 2 & 4: END PROJECT / FINISH PROJECT (Mentor Only) */}
                      {!proj.isCompleted ? (
                        <button
                          onClick={() => setProjectToFinish(proj)}
                          className="btn btn-primary btn-sm"
                          style={{
                            background: is100Percent 
                              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                              : 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                            fontWeight: '700',
                            padding: '0.5rem 1rem',
                            boxShadow: is100Percent ? '0 0 15px rgba(16, 185, 129, 0.5)' : 'none'
                          }}
                        >
                          <CheckCircle2 size={16} /> End / Finish Project
                        </button>
                      ) : (
                        <span className="badge badge-emerald" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                          ✓ Project Finalized & Certificates Issued
                        </span>
                      )}

                      {/* Delete Project */}
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#fca5a5', padding: '0.45rem 0.75rem', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        title="Delete project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 100% Progress Alert Banner (Requirement 10) */}
                  {is100Percent && !proj.isCompleted && (
                    <div style={{ padding: '0.85rem 1.25rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '0.65rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Sparkles size={20} color="#34d399" />
                        <div>
                          <div style={{ fontWeight: '800', color: '#6ee7b7' }}>🎉 100% Deliverable Progress Completed!</div>
                          <div style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>All milestone tasks have been ticked. Click "End / Finish Project" to generate student certificates and finalize research.</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setProjectToFinish(proj)}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: '#10b981', border: 'none' }}
                      >
                        Issue Certificates Now
                      </button>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1.5rem', backgroundColor: '#090d16', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: '700', color: '#cbd5e1' }}>
                        Interactive Deliverables Checklist Progress:
                      </span>
                      <span style={{ fontWeight: '800', color: progressPct === 100 ? '#34d399' : '#a78bfa' }}>
                        {progressPct}% ({completedCount} of {checklist.length} items ticked)
                      </span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${progressPct}%`,
                        height: '100%',
                        background: progressPct === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #a855f7)',
                        borderRadius: '9999px',
                        transition: 'width 0.4s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Interactive Checklist Items (Requirements 3 & 4) */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase' }}>
                        Project Checklist & Work Assignments:
                      </h4>
                      <button
                        onClick={() => setChecklistProject(proj)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                      >
                        + Add Checklist Task
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {checklist.length === 0 ? (
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                          No checklist items defined yet. Click "+ Add Checklist Task" to create one.
                        </div>
                      ) : (
                        checklist.map(item => (
                          <div key={item.id} style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            backgroundColor: item.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                            border: `1px solid ${item.completed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            flexWrap: 'wrap'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <button
                                type="button"
                                onClick={() => handleToggleChecklist(proj.id, item.id)}
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '4px',
                                  border: item.completed ? 'none' : '2px solid #64748b',
                                  backgroundColor: item.completed ? '#10b981' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                {item.completed && <Check size={14} color="#ffffff" />}
                              </button>
                              <div>
                                <span style={{ fontSize: '0.9rem', fontWeight: '700', textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? '#94a3b8' : '#fff' }}>
                                  {item.title}
                                </span>
                                {item.description && (
                                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.15rem' }}>{item.description}</p>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe' }}>
                                Assigned: <strong>{item.assignedToName || 'Unassigned'}</strong>
                              </span>
                              {item.completed && (
                                <span style={{ fontSize: '0.75rem', color: '#34d399' }}>✓ Completed</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Details Pill Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', fontSize: '0.8rem', color: '#94a3b8', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>Stipend: <strong style={{ color: '#34d399' }}>{proj.stipendAmount || 'Academic Honors'}</strong></span>
                    <span>Deadline: <strong>{proj.deadline}</strong></span>
                    <span>Duration: <strong>{proj.durationWeeks} Weeks</strong></span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: TEAMS, WORK ACTIVITY & CO-MENTOR CHAT (Requirements 5, 6)
          ========================================================================= */}
      {activeTab === 'teams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Active Project Teams & Work Activity</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Monitor active student roles, current tasks, collaborate with co-mentors, and rate students.
              </p>
            </div>
            <button onClick={loadTeams} className="btn btn-secondary btn-sm">Refresh Teams</button>
          </div>

          {teams.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
              <Users size={36} color="#64748b" style={{ margin: '0 auto 1rem' }} />
              <h3>No teams assembled yet.</h3>
              <p style={{ marginTop: '0.5rem' }}>Accepting student applications automatically forms project teams!</p>
            </div>
          ) : (
            teams.map(team => (
              <div key={team.id} className="glass-card" style={{ padding: '2rem' }}>
                
                {/* Team Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span className="badge badge-purple">{team.domain || 'Engineering'}</span>
                      {team.coMentorName && (
                        <span className="badge badge-indigo">Co-Mentor: {team.coMentorName}</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{team.projectTitle}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      {team.members?.length || 0} Students Assembled • Formed {new Date(team.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setSelectedTeamForMilestone(team)}
                      className="btn btn-primary btn-sm"
                      style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' }}
                    >
                      + Assign Milestone
                    </button>
                  </div>
                </div>

                {/* Team Members Work Activity Card Grid (Requirement 6) */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Team Activity, Work Designation & Student Ratings:
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {team.members?.map((m, idx) => (
                      <div key={idx} style={{ padding: '1rem', borderRadius: '0.65rem', backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '800' }}>
                              {m.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>{m.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.dept}</div>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '9999px', backgroundColor: m.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)', color: m.isActive ? '#34d399' : '#94a3b8' }}>
                            {m.isActive ? '🟢 Active' : 'Offline'}
                          </span>
                        </div>

                        {/* Designated Role & Current Task */}
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                          <strong>Role:</strong> <span style={{ color: '#a78bfa' }}>{m.role || 'Teammate'}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.75rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.6rem', borderRadius: '0.35rem' }}>
                          <strong>Current Task:</strong> {m.currentTask || 'Working on assigned deliverables'}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            ⏳ Logged: <strong>{m.hoursLogged || 0} hrs</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => setStudentToRate({ studentId: m.studentId, studentName: m.name, projectId: team.projectId })}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                          >
                            <Star size={12} fill="#fbbf24" color="#fbbf24" /> Rate Student
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Milestones */}
                {team.milestones?.length > 0 && (
                  <div style={{ marginBottom: '1.75rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Milestones ({team.progressPercent || 0}% Complete):
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {team.milestones.map(m => (
                        <div key={m.id} style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '0.5rem',
                          backgroundColor: m.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(30, 41, 59, 0.4)',
                          border: `1px solid ${m.completed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleMilestone(m.id)}
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '4px',
                                border: m.completed ? 'none' : '2px solid #64748b',
                                backgroundColor: m.completed ? '#10b981' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              {m.completed && <Check size={14} color="#ffffff" />}
                            </button>
                            <div>
                              <span style={{ fontSize: '0.9rem', fontWeight: '700', textDecoration: m.completed ? 'line-through' : 'none' }}>
                                {m.title}
                              </span>
                              {m.description && <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{m.description}</p>}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Due: {m.dueDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team Chat with Co-Mentor & Peer Channels */}
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <MessageSquare size={18} color="#c084fc" />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>Collaboration & Guidance Chat</h4>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Guidance channel for whole group, plus dedicated <strong>Co-Mentor Space</strong> for faculty coordination.
                      </p>
                    </div>
                  </div>
                  <TeamChat 
                    projectId={team.projectId} 
                    projectTitle={team.projectTitle} 
                    mentorName={user?.fullName || team.mentorName} 
                  />
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: MENTOR PROFILE & PORTFOLIO (Requirements 5, 8, 11)
          ========================================================================= */}
      {activeTab === 'profile' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Faculty Mentor Profile</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Your verified academic credentials and research portfolio</p>
              </div>
              <span className="badge badge-purple" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                {user?.designation || 'Associate Professor'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#090d16', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>College / University</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginTop: '0.2rem' }}>{user?.college || 'National Institute of Technology'}</div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#090d16', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Department</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginTop: '0.2rem' }}>{user?.department || 'Computer Science & Engg.'}</div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#090d16', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Experience</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginTop: '0.2rem' }}>{user?.experienceYears || 10} Years Academic Lead</div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#090d16', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Student Feedback Score</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fbbf24', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Star size={16} fill="#fbbf24" /> {user?.ratingAvg || 4.9} / 5.0 ({user?.ratingsCount || 12} reviews)
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.75rem' }}>Achievement Badges Earned</h3>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {(user?.badges || ['🌟 Top Mentor', '💡 Code Architect', '🤝 Co-Mentor Collaborator', '🏆 Grant Winner']).map(b => (
                  <span key={b} style={{ padding: '0.4rem 0.85rem', borderRadius: '9999px', backgroundColor: 'rgba(124, 58, 237, 0.2)', border: '1px solid rgba(124, 58, 237, 0.4)', color: '#c084fc', fontWeight: '700', fontSize: '0.85rem' }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects Guided Section (Requirement 5) */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.75rem' }}>
                Projects Guided & Mentored ({myProjects.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {myProjects.map(p => (
                  <div key={p.id} style={{ padding: '0.85rem 1rem', backgroundColor: '#090d16', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Domain: {p.domain} • Duration: {p.durationWeeks} Weeks</div>
                    </div>
                    <span className={`badge ${p.isCompleted ? 'badge-emerald' : 'badge-purple'}`}>
                      {p.isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Independent Projects Advised Section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.75rem' }}>
                Independent Student Projects Advised ({advisoryInvitations.filter(a => a.inviteStatus === 'accepted').length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {advisoryInvitations.filter(a => a.inviteStatus === 'accepted').length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    No student independent projects currently advised. Check "Applicant & Advisory Desk" to accept requests.
                  </div>
                ) : (
                  advisoryInvitations.filter(a => a.inviteStatus === 'accepted').map(a => (
                    <div key={a.projectId} style={{ padding: '0.85rem 1rem', backgroundColor: '#090d16', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>{a.projectTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Student Lead: {a.creatorName} ({a.creatorDept})</div>
                      </div>
                      <span className="badge badge-emerald">✓ Active Advisor</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Danger Zone: Delete Account (Requirement 11) */}
            <div style={{ borderTop: '1px solid rgba(239, 68, 68, 0.2)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f87171' }}>Delete Mentor Account</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Permanently remove your faculty account and all project records.</p>
              </div>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="btn btn-secondary btn-sm"
                style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              >
                <Trash2 size={15} /> Delete Account
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: FINISH / END PROJECT (Requirements 2, 4, 10)
          ========================================================================= */}
      {projectToFinish && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '0.35rem' }}>MENTOR CEREMONIAL ACTION</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Finalize & End Project</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>For: {projectToFinish.title}</p>
              </div>
              <button onClick={() => setProjectToFinish(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {finishSuccess && (
              <div style={{ padding: '0.85rem', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', fontSize: '0.85rem' }}>
                {finishSuccess}
              </div>
            )}

            <form onSubmit={handleFinishProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', backgroundColor: 'rgba(124, 58, 237, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(124, 58, 237, 0.25)', fontSize: '0.85rem', color: '#cbd5e1' }}>
                Clicking confirm will mark this project as <strong>Completed</strong>, permanently close applications, and generate verified academic completion certificates for all student teammates.
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Student Distinction Grade Awarded
                </label>
                <select
                  value={finishGrade}
                  onChange={(e) => setFinishGrade(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value="Distinction (A+)">Distinction (A+)</option>
                  <option value="First Class with Distinction">First Class with Distinction</option>
                  <option value="Excellence in Research">Excellence in Research</option>
                  <option value="Commendable Practical Engineering">Commendable Practical Engineering</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Stipend Disbursed (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹18,000 Total Research Grant or Unpaid Academic Capstone"
                  value={finishStipend}
                  onChange={(e) => setFinishStipend(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setProjectToFinish(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" disabled={finishing} className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  {finishing ? 'Finalizing...' : 'Confirm & Issue Certificates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD CHECKLIST ITEM (Requirement 3 & 4)
          ========================================================================= */}
      {checklistProject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '0.35rem' }}>CHECKLIST TASK</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Add Checklist Deliverable</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>For: {checklistProject.title}</p>
              </div>
              <button onClick={() => setChecklistProject(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddChecklistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. YOLOv8 Model Training on aerial dataset"
                  value={checklistItemTitle}
                  onChange={(e) => setChecklistItemTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Task Details / Specification</label>
                <textarea
                  rows="2"
                  placeholder="Instructions or acceptance criteria for students..."
                  value={checklistItemDesc}
                  onChange={(e) => setChecklistItemDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Designate Work to Student (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Aditya Verma or leave blank for team"
                  value={checklistAssignee}
                  onChange={(e) => setChecklistAssignee(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setChecklistProject(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' }}>
                  Save Checklist Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: INVITE CO-MENTOR (Requirement 5 & 6)
          ========================================================================= */}
      {coMentorProject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '0.35rem' }}>FACULTY COLLABORATION</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Invite Co-Mentor</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>For: {coMentorProject.title}</p>
              </div>
              <button onClick={() => setCoMentorProject(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {coMentorSuccess && (
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', fontSize: '0.85rem' }}>
                {coMentorSuccess}
              </div>
            )}

            <form onSubmit={handleInviteCoMentorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Select Faculty Co-Mentor
                </label>
                <select
                  required
                  value={selectedCoMentorId}
                  onChange={(e) => setSelectedCoMentorId(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value="">-- Choose Professor / Mentor --</option>
                  {allMentors.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.department || 'Faculty'} - {m.designation || 'Mentor'})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setCoMentorProject(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' }}>
                  Send Collaboration Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: RATE STUDENT TEAMMATE (Requirement 9)
          ========================================================================= */}
      {studentToRate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-indigo" style={{ marginBottom: '0.35rem' }}>PERFORMANCE EVALUATION</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Rate Student: {studentToRate.studentName}</h3>
              </div>
              <button onClick={() => setStudentToRate(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {rateSuccess && (
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', fontSize: '0.85rem' }}>
                {rateSuccess}
              </div>
            )}

            <form onSubmit={handleRateStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Rating (1 to 5 Stars)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRateScore(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      <Star size={28} fill={star <= rateScore ? '#fbbf24' : 'none'} color={star <= rateScore ? '#fbbf24' : '#64748b'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Written Evaluation / Recommendation
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Aditya demonstrated exceptional tenacity in hardware assembly, ROS 2 messaging, and model quantization..."
                  value={rateReview}
                  onChange={(e) => setRateReview(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setStudentToRate(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' }}>
                  Submit Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PUBLISH PROJECT OPPORTUNITY
          ========================================================================= */}
      {showPublishModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '0.35rem' }}>MENTOR STUDIO</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Publish Project Opportunity</h3>
              </div>
              <button onClick={() => setShowPublishModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {publishMsg && (
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', fontSize: '0.85rem' }}>
                {publishMsg}
              </div>
            )}

            <form onSubmit={handlePublishProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real-Time Telemetry Analytics Platform"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Problem Statement & What Students Will Build</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the research objective or practical engineering problem..."
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Domain Category</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  >
                    <option value="AI & Robotics">AI & Robotics</option>
                    <option value="Full-Stack Web">Full-Stack Web</option>
                    <option value="IoT & Cloud">IoT & Cloud</option>
                    <option value="Cybersecurity & Blockchain">Cybersecurity & Blockchain</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Team Size Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={newTeamSize}
                    onChange={(e) => setNewTeamSize(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Required Skills Tagger */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Required Technical Skills (Used for student matching)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Type skill & press Enter (e.g. Python, Docker, React)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRequiredSkill(e); } }}
                    style={{ flex: 1, padding: '0.65rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                  />
                  <button type="button" onClick={addRequiredSkill} className="btn btn-secondary btn-sm">Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {newSkills.map(s => (
                    <span key={s} className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      {s}
                      <button type="button" onClick={() => setNewSkills(newSkills.filter(x => x !== s))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Duration (Weeks)</label>
                  <input
                    type="number"
                    min="4"
                    max="52"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Stipend / Grant</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹6,000 / Month (Research Grant)"
                    value={newStipend}
                    onChange={(e) => setNewStipend(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Application Deadline</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setShowPublishModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" disabled={publishing} className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' }}>
                  {publishing ? 'Publishing...' : 'Publish to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ASSIGN MILESTONE
          ========================================================================= */}
      {selectedTeamForMilestone && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '0.35rem' }}>MILESTONE SPRINT</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Assign New Milestone</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>For: {selectedTeamForMilestone.projectTitle}</p>
              </div>
              <button onClick={() => setSelectedTeamForMilestone(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMilestoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Milestone Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Architecture Prototype"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Deliverable Description</label>
                <textarea
                  rows="2"
                  placeholder="Expected outcome, code artifacts, or report..."
                  value={milestoneDesc}
                  onChange={(e) => setMilestoneDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Due Date</label>
                <input
                  type="date"
                  required
                  value={milestoneDue}
                  onChange={(e) => setMilestoneDue(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSelectedTeamForMilestone(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" disabled={addingMilestone} className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' }}>
                  {addingMilestone ? 'Adding...' : 'Add Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
