import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FolderGit2, 
  Send, 
  Check, 
  X, 
  Layers, 
  ChevronRight, 
  BookOpen, 
  Plus,
  Calendar,
  ExternalLink,
  Award,
  FileText,
  UploadCloud,
  MessageSquare,
  Flame,
  Star,
  Flag,
  Share2,
  ThumbsUp,
  MessageCircle,
  PlusCircle,
  Trash2,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import TeamChat from '../../components/TeamChat';

export default function StudentDashboard() {
  const { user, updateUserSkills, logout } = useAuth();
  
  // Dashboard Active Tab: 'explore' | 'applications' | 'teams' | 'independent' | 'community' | 'certificates' | 'profile'
  const [activeTab, setActiveTab] = useState('explore');

  // Projects State
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  // Applications State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Teams State
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Independent Projects State (Student-Led Teaming Up)
  const [independentProjects, setIndependentProjects] = useState([]);
  const [loadingIndep, setLoadingIndep] = useState(false);
  const [showCreateIndepModal, setShowCreateIndepModal] = useState(false);
  const [indepTitle, setIndepTitle] = useState('');
  const [indepProblem, setIndepProblem] = useState('');
  const [indepDomain, setIndepDomain] = useState('Full-Stack Web');
  const [indepSkills, setIndepSkills] = useState(['React', 'Node.js']);
  const [indepSkillInput, setIndepSkillInput] = useState('');
  const [indepTeamSize, setIndepTeamSize] = useState(3);
  const [indepRoleNeeded, setIndepRoleNeeded] = useState('Frontend & UI Developer');

  // Community Lounge State
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('Hackathon, AI/ML, Teammates');
  const [commentInputs, setCommentInputs] = useState({});

  // Certificates State
  const [myCertificates, setMyCertificates] = useState([]);
  const [viewingCertificate, setViewingCertificate] = useState(null);

  // Apply Modal State
  const [selectedProjectForApply, setSelectedProjectForApply] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyFeedback, setApplyFeedback] = useState({ type: '', text: '' });

  // Detail Modal State
  const [viewingProject, setViewingProject] = useState(null);

  // Profile Skills State
  const [skillInput, setSkillInput] = useState('');

  // CV / Resume Upload State
  const [resumeName, setResumeName] = useState(user?.resumeName || 'Rahul_Sharma_CS_Resume.pdf');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeSuccessMsg, setResumeSuccessMsg] = useState('');

  // Daily Streak & Log Time Modal State
  const [showLogTimeModal, setShowLogTimeModal] = useState(false);
  const [workHours, setWorkHours] = useState('2.5');
  const [workNotes, setWorkNotes] = useState('Implemented camera feed inference and optimized YOLO weights.');
  const [logTimeSuccess, setLogTimeSuccess] = useState('');

  // Rate Mentor Modal State
  const [mentorToRate, setMentorToRate] = useState(null);
  const [mentorRating, setMentorRating] = useState(5);
  const [mentorReviewText, setMentorReviewText] = useState('');
  const [rateSuccess, setRateSuccess] = useState('');

  // Report Peer Modal State
  const [peerToReport, setPeerToReport] = useState(null);
  const [reportReason, setReportReason] = useState('Inactivity on Assigned Tasks');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');

  // All Mentors for Independent Project Invitation
  const [allMentors, setAllMentors] = useState([]);
  const [invitingIndepProj, setInvitingIndepProj] = useState(null);
  const [selectedMentorForInvite, setSelectedMentorForInvite] = useState('');

  // Project Workspace Links & Standby Chat
  const [projectRepoUrls, setProjectRepoUrls] = useState({
    proj_1: 'https://github.com/aditya/drone-edge-ai',
    proj_2: 'https://github.com/rahul/credential-verification'
  });
  const [standbyChatProjId, setStandbyChatProjId] = useState('proj_2');

  const handleSaveRepoUrl = (projId) => {
    alert(`Repository link saved! Faculty mentor and teammates can now view your codebase submissions.`);
  };

  const handleRemoveApplication = async (appId) => {
    if (window.confirm('Remove this application from your list?')) {
      try {
        const res = await api.deleteApplication(appId);
        if (res.status === 'success') {
          loadApplications();
        } else {
          alert(res.message || 'Failed to remove application');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Fetch Projects with student's skills
  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await api.getProjects({
        search: searchQuery,
        domain: selectedDomain,
        studentSkills: user?.skills || ['Python', 'React', 'MongoDB']
      });
      if (res.status === 'success') {
        setProjects(res.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch Student Applications
  const loadApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await api.getStudentApplications();
      if (res.status === 'success') {
        setApplications(res.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  // Fetch Teams
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

  // Fetch Independent Projects
  const loadIndependentProjects = async () => {
    setLoadingIndep(true);
    try {
      const res = await api.getIndependentProjects();
      if (res.status === 'success') {
        setIndependentProjects(res.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIndep(false);
    }
  };

  // Fetch Community Posts
  const loadCommunityPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await api.getCommunityPosts();
      if (res.status === 'success') {
        setCommunityPosts(res.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Fetch My Certificates
  const loadCertificates = async () => {
    try {
      const res = await api.getMyCertificates();
      if (res.status === 'success') {
        setMyCertificates(res.certificates);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Mentors for Invites
  const loadMentors = async () => {
    try {
      const res = await api.getAllMentors();
      if (res.status === 'success') {
        setAllMentors(res.mentors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjects();
    loadApplications();
    loadTeams();
    loadIndependentProjects();
    loadCommunityPosts();
    loadCertificates();
    loadMentors();
  }, [user]);

  // Handle Toggle Checklist Item
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

  // Handle Resume Upload
  const handleResumeFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    setResumeSuccessMsg('');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      try {
        const res = await api.updateProfile({
          resumeName: file.name,
          resumeUrl: base64Data
        });
        if (res.status === 'success') {
          setResumeName(file.name);
          setResumeSuccessMsg(`CV "${file.name}" uploaded & linked to your profile!`);
          setTimeout(() => setResumeSuccessMsg(''), 4000);
        }
      } catch (err) {
        setResumeSuccessMsg('Failed to save CV.');
      } finally {
        setUploadingResume(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply to Project Handler
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedProjectForApply) return;

    setApplying(true);
    setApplyFeedback({ type: '', text: '' });

    try {
      const res = await api.applyForProject(selectedProjectForApply.id, coverNote);
      if (res.status === 'success') {
        setApplyFeedback({
          type: 'success',
          text: `Application submitted successfully! Your CV (${resumeName}) and profile have been forwarded to ${selectedProjectForApply.mentorName}.`
        });
        setTimeout(() => {
          setSelectedProjectForApply(null);
          setCoverNote('');
          loadApplications();
          loadProjects();
        }, 2200);
      } else {
        setApplyFeedback({ type: 'error', text: res.message || 'Application failed' });
      }
    } catch (err) {
      setApplyFeedback({ type: 'error', text: 'Error submitting application.' });
    } finally {
      setApplying(false);
    }
  };

  // Create Independent Student Project
  const handleCreateIndepSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createIndependentProject({
        title: indepTitle,
        problemStatement: indepProblem,
        domain: indepDomain,
        requiredSkills: indepSkills,
        teamSize: Number(indepTeamSize)
      });
      if (res.status === 'success') {
        setShowCreateIndepModal(false);
        setIndepTitle('');
        setIndepProblem('');
        loadIndependentProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Join Independent Project
  const handleJoinIndep = async (projId) => {
    try {
      const role = prompt('Enter your role in this independent project (e.g. Frontend Engineer, ML Engineer):', 'Core Contributor');
      if (!role) return;
      const res = await api.joinIndependentProject(projId, { role, task: 'Initial repository setup' });
      if (res.status === 'success') {
        alert('Joined independent student team successfully!');
        loadIndependentProjects();
      } else {
        alert(res.message || 'Could not join');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Invite Mentor to Independent Project
  const handleInviteMentorToIndepSubmit = async (e) => {
    e.preventDefault();
    if (!invitingIndepProj || !selectedMentorForInvite) return;

    try {
      const chosenMentor = allMentors.find(m => m.id === selectedMentorForInvite);
      const res = await api.inviteMentorToIndependent(invitingIndepProj.id, {
        mentorId: selectedMentorForInvite,
        mentorName: chosenMentor ? chosenMentor.fullName : 'Faculty Mentor'
      });
      if (res.status === 'success') {
        alert('Invitation sent to faculty mentor to guide your project!');
        setInvitingIndepProj(null);
        setSelectedMentorForInvite('');
        loadIndependentProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Community Post
  const handleCreatePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createCommunityPost({
        title: postTitle,
        content: postContent,
        tags: postTags.split(',').map(t => t.trim())
      });
      if (res.status === 'success') {
        setShowCreatePostModal(false);
        setPostTitle('');
        setPostContent('');
        loadCommunityPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Upvote Community Post
  const handleUpvote = async (postId) => {
    try {
      await api.upvoteCommunityPost(postId);
      loadCommunityPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Comment on Community Post
  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      await api.commentCommunityPost(postId, text);
      setCommentInputs({ ...commentInputs, [postId]: '' });
      loadCommunityPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Log Daily Work Hours & Daily Streak
  const handleLogTimeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.logWorkTime(Number(workHours), workNotes);
      if (res.status === 'success') {
        setLogTimeSuccess(`Logged ${workHours} hours! Daily work streak updated to ${res.streakDays} Days 🔥`);
        setTimeout(() => {
          setShowLogTimeModal(false);
          setLogTimeSuccess('');
          loadTeams();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Rating for Mentor
  const handleRateMentorSubmit = async (e) => {
    e.preventDefault();
    if (!mentorToRate) return;

    try {
      const res = await api.submitFeedback({
        projectId: mentorToRate.projectId,
        toUserId: mentorToRate.mentorId,
        rating: mentorRating,
        reviewText: mentorReviewText
      });
      if (res.status === 'success') {
        setRateSuccess('Mentor rating and feedback recorded!');
        setTimeout(() => {
          setMentorToRate(null);
          setMentorReviewText('');
          setRateSuccess('');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Peer Report
  const handleReportPeerSubmit = async (e) => {
    e.preventDefault();
    if (!peerToReport) return;

    try {
      const res = await api.submitReport({
        reportedUserId: peerToReport.studentId,
        projectId: peerToReport.projectId,
        reason: reportReason,
        details: reportDetails
      });
      if (res.status === 'success') {
        setReportSuccess('Confidential peer report submitted for college faculty review.');
        setTimeout(() => {
          setPeerToReport(null);
          setReportDetails('');
          setReportSuccess('');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: Are you sure you want to permanently delete your student account? All applications, portfolio records, and team assignments will be removed.')) {
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

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !(user?.skills || []).includes(skillInput.trim())) {
      const updated = [...(user?.skills || []), skillInput.trim()];
      updateUserSkills(updated);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    const updated = (user?.skills || []).filter(s => s !== skill);
    updateUserSkills(updated);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      
      {/* =========================================================================
          STUDENT PROFILE & STREAK BANNER
          ========================================================================= */}
      <div className="glass-panel" style={{
        padding: '2rem',
        borderRadius: '1.25rem',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(124, 58, 237, 0.15) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
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
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <GraduationCap size={28} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                {user?.fullName || 'Student Candidate'}
              </h1>
              <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
                {user?.yearOfStudy || '3rd Year'}
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Flame size={13} fill="#f97316" color="#f97316" /> {user?.streakDays || 5}-Day Streak 🔥
              </span>
            </div>
            <p style={{ color: '#c7d2fe', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              {user?.department || 'Computer Science & Engineering'} • {user?.college || 'National Institute of Technology'}
            </p>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
              {(user?.badges || ['🔥 5-Day Streak Master', '🚀 Project Pioneer', '📜 Certified Scholar', '⚡ Full-Stack Virtuoso']).map(b => (
                <span key={b} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowLogTimeModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'rgba(249, 115, 22, 0.4)', color: '#fdba74' }}
          >
            <Flame size={16} fill="#f97316" color="#f97316" /> Log Daily Work Hours
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className="btn btn-primary btn-sm"
          >
            <Search size={16} /> Explore Projects
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
          onClick={() => setActiveTab('explore')}
          className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'explore' ? '3px solid #4f46e5' : '3px solid transparent',
            color: activeTab === 'explore' ? '#818cf8' : '#94a3b8',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Search size={18} />
          Explore Mentor Projects ({projects.length})
        </button>

        <button
          onClick={() => setActiveTab('independent')}
          className={`tab-btn ${activeTab === 'independent' ? 'active' : ''}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'independent' ? '3px solid #4f46e5' : '3px solid transparent',
            color: activeTab === 'independent' ? '#818cf8' : '#94a3b8',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Users size={18} />
          Student Projects & Teaming Up ({independentProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`tab-btn ${activeTab === 'community' ? 'active' : ''}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'community' ? '3px solid #4f46e5' : '3px solid transparent',
            color: activeTab === 'community' ? '#818cf8' : '#94a3b8',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <MessageCircle size={18} />
          Campus Idea Lounge ({communityPosts.length})
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'teams' ? '3px solid #4f46e5' : '3px solid transparent',
            color: activeTab === 'teams' ? '#818cf8' : '#94a3b8',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FolderGit2 size={18} />
          My Teams & Checklists ({teams.length})
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'applications' ? '3px solid #4f46e5' : '3px solid transparent',
            color: activeTab === 'applications' ? '#818cf8' : '#94a3b8',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Layers size={18} />
          My Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'certificates' ? '3px solid #4f46e5' : '3px solid transparent',
            color: activeTab === 'certificates' ? '#818cf8' : '#94a3b8',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Award size={18} />
          Verified Certificates ({myCertificates.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'profile' ? '3px solid #4f46e5' : '3px solid transparent',
            color: activeTab === 'profile' ? '#818cf8' : '#94a3b8',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <GraduationCap size={18} />
          Profile & Portfolio
        </button>
      </div>

      {/* =========================================================================
          TAB 1: EXPLORE MENTOR PROJECTS
          ========================================================================= */}
      {activeTab === 'explore' && (
        <div>
          {/* Search & Domain Filter Bar */}
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: '1 1 300px', position: 'relative' }}>
                <Search size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search projects by title, keywords or tech stack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') loadProjects(); }}
                  style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.5rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ flex: '0 1 220px' }}>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value="all">All Academic Domains</option>
                  <option value="AI & Robotics">AI & Robotics</option>
                  <option value="Full-Stack Web">Full-Stack Web</option>
                  <option value="IoT & Cloud">IoT & Cloud</option>
                  <option value="Cybersecurity & Blockchain">Cybersecurity & Blockchain</option>
                </select>
              </div>

              <button onClick={loadProjects} className="btn btn-primary btn-sm">
                Apply Filter
              </button>
            </div>
          </div>

          {/* Project Cards Grid */}
          {loadingProjects ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading recommended projects...</div>
          ) : projects.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
              <FolderGit2 size={40} color="#64748b" style={{ margin: '0 auto 1rem' }} />
              <h3>No projects matched your criteria.</h3>
              <p style={{ marginTop: '0.5rem' }}>Try clearing filters or check back when mentors post new opportunities.</p>
            </div>
          ) : (
            <div className="grid-2">
              {projects.map(proj => {
                const isFull = proj.currentTeamSize >= proj.teamSizeRequired;
                const matchScore = proj.matchScore || 75;
                const matchClass = matchScore >= 75 ? 'match-high' : matchScore >= 50 ? 'match-mid' : 'match-low';

                return (
                  <div key={proj.id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: isFull ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(255,255,255,0.08)' }}>
                    <div>
                      {/* Domain, Status, & Skill Match Score */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span className="badge badge-purple">{proj.domain}</span>
                        <span className={`match-score-pill ${matchClass}`}>
                          <Sparkles size={13} />
                          {matchScore}% Skill Match
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.4rem', color: '#ffffff' }}>
                        {proj.title}
                      </h3>

                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                        Guided by: <strong style={{ color: '#cbd5e1' }}>{proj.mentorName}</strong> ({proj.mentorDept || 'Faculty'})
                        {proj.coMentors?.length > 0 && ` • Co-Mentor: ${proj.coMentors.map(c => c.mentorName).join(', ')}`}
                      </p>

                      <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {proj.problemStatement}
                      </p>

                      {/* Required Skills */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Required Skills:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {proj.requiredSkills.map(s => {
                            const studentHasSkill = (user?.skills || []).some(sk => sk.toLowerCase() === s.toLowerCase());
                            return (
                              <span key={s} className={`badge ${studentHasSkill ? 'badge-emerald' : 'badge-indigo'}`} style={{ fontSize: '0.75rem' }}>
                                {studentHasSkill ? `✓ ${s}` : s}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status & Apply Button */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        <div>Slots: <strong>{proj.currentTeamSize || 0} / {proj.teamSizeRequired} Filled</strong></div>
                        {proj.stipendAmount && <div style={{ color: '#34d399', fontSize: '0.75rem' }}>{proj.stipendAmount}</div>}
                      </div>

                      {proj.isCompleted ? (
                        <span className="badge badge-emerald">✓ Completed</span>
                      ) : isFull ? (
                        <span className="badge badge-rose">🚫 Team Full</span>
                      ) : (
                        <button
                          onClick={() => { setSelectedProjectForApply(proj); setApplyFeedback({ type: '', text: '' }); }}
                          className="btn btn-primary btn-sm"
                        >
                          Apply For Slot <ChevronRight size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: INDEPENDENT STUDENT PROJECTS HUB (Requirement 5)
          ========================================================================= */}
      {activeTab === 'independent' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Student-Led Independent Projects Hub</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Team up with fellow students on independent ideas without mentors, or invite faculty professors to advise your project!
              </p>
            </div>
            <button
              onClick={() => setShowCreateIndepModal(true)}
              className="btn btn-primary btn-sm"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
            >
              <PlusCircle size={16} /> Pitch Your Student Project
            </button>
          </div>

          <div className="grid-2">
            {independentProjects.map(proj => {
              const currentMembers = proj.currentMembers || [];
              const isMember = currentMembers.some(m => m.studentId === user?.id);
              const isFull = currentMembers.length >= proj.teamSize;

              return (
                <div key={proj.id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-indigo">{proj.domain}</span>
                      <span className="badge badge-purple">
                        {currentMembers.length} / {proj.teamSize} Teammates
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                      {proj.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                      Created by: <strong style={{ color: '#c7d2fe' }}>{proj.creatorName}</strong> ({proj.creatorDept})
                    </p>

                    <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                      {proj.problemStatement}
                    </p>

                    {/* Members List */}
                    <div style={{ marginBottom: '1rem', backgroundColor: '#090d16', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Current Team Members:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {currentMembers.map((m, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: '#fff', fontWeight: '600' }}>• {m.name} ({m.role || 'Member'})</span>
                            <span style={{ color: '#818cf8', fontSize: '0.75rem' }}>{m.currentTask || 'Active'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Invited Mentors */}
                    {proj.invitedMentors?.length > 0 && (
                      <div style={{ marginBottom: '1rem', padding: '0.5rem 0.75rem', backgroundColor: 'rgba(124, 58, 237, 0.1)', borderRadius: '0.4rem', border: '1px solid rgba(124, 58, 237, 0.25)', fontSize: '0.8rem', color: '#c084fc' }}>
                        🎓 <strong>Faculty Advisor:</strong> {proj.invitedMentors.map(im => `${im.mentorName} (${im.status})`).join(', ')}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                    <button
                      onClick={() => setInvitingIndepProj(proj)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                    >
                      🎓 Invite Mentor to Advise
                    </button>

                    {isMember ? (
                      <span className="badge badge-emerald">✓ You're in this team</span>
                    ) : isFull ? (
                      <span className="badge badge-rose">Team Full</span>
                    ) : (
                      <button
                        onClick={() => handleJoinIndep(proj.id)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}
                      >
                        Team Up & Join
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CAMPUS COMMUNITY LOUNGE (Requirement 7)
          ========================================================================= */}
      {activeTab === 'community' && (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Campus Community Lounge & Idea Feed</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Pitch project concepts, find hackathon teammates across departments, and brainstorm ideas!
              </p>
            </div>
            <button
              onClick={() => setShowCreatePostModal(true)}
              className="btn btn-primary btn-sm"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
            >
              <PlusCircle size={16} /> Pitch an Idea
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {communityPosts.map(post => (
              <div key={post.id} className="glass-card" style={{ padding: '1.75rem' }}>
                {/* Author Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: post.authorRole === 'mentor' ? '#7c3aed' : '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                      {post.authorName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '800' }}>{post.authorName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {post.authorDept || 'Campus Member'} • {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${post.authorRole === 'mentor' ? 'badge-purple' : 'badge-indigo'}`}>
                    {post.authorRole === 'mentor' ? 'Faculty Lead' : 'Student Pitch'}
                  </span>
                </div>

                {/* Content */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fff' }}>
                  {post.title}
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {post.content}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {post.tags?.map(t => (
                    <span key={t} className="badge badge-purple" style={{ fontSize: '0.7rem' }}>#{t}</span>
                  ))}
                </div>

                {/* Upvote & Comment Action Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <ThumbsUp size={14} color="#818cf8" /> Upvote ({post.upvotes || 0})
                  </button>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MessageSquare size={14} /> {post.comments?.length || 0} Discussions
                  </span>
                </div>

                {/* Comments List */}
                <div style={{ backgroundColor: '#090d16', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {post.comments?.map(c => (
                    <div key={c.id} style={{ marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#c7d2fe' }}>
                        {c.authorName} <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({c.authorRole})</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.15rem' }}>{c.text}</div>
                    </div>
                  ))}

                  {/* Add Comment Input */}
                  <form onSubmit={(e) => handleCommentSubmit(post.id, e)} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Join the discussion or express interest to team up..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      style={{ flex: 1, padding: '0.5rem 0.75rem', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                    />
                    <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0.5rem 0.85rem' }}>
                      <Send size={14} />
                    </button>
                  </form>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: MY TEAMS & INTERACTIVE DELIVERABLES (Requirements 3, 6, 9)
          ========================================================================= */}
      {activeTab === 'teams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Your Active Project Teams & Workspaces</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Track checklist deliverables, communicate in student-only or mentor guidance chat, and log hours.
              </p>
            </div>
            <button onClick={loadTeams} className="btn btn-secondary btn-sm">Refresh Teams</button>
          </div>

          {teams.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid #6366f1' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span className="badge badge-indigo">Direct Project & Mentor Chat Hub</span>
                      <span className="badge badge-emerald">Live Standby Workspace</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                      Team Members & Mentor Direct Collaboration
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '750px', marginTop: '0.25rem' }}>
                      You can instantly chat with faculty mentors and peer teammates below. Switch channels between active research tracks, discuss project deliverables, share repository links, or assemble independent student teams.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setActiveTab('independent')} className="btn btn-secondary btn-sm">
                      Form Student Team
                    </button>
                    <button onClick={() => setActiveTab('explore')} className="btn btn-primary btn-sm">
                      Browse Projects
                    </button>
                  </div>
                </div>

                {/* Standby Project Channel Selector */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>Select Chat Channel:</span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setStandbyChatProjId('proj_2')}
                      className={`btn btn-sm ${standbyChatProjId === 'proj_2' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Credential Verification (Prof. Ananya Sen)
                    </button>
                    <button
                      onClick={() => setStandbyChatProjId('proj_1')}
                      className={`btn btn-sm ${standbyChatProjId === 'proj_1' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Autonomous Drone Navigation (Dr. Rajesh Kumar)
                    </button>
                    <button
                      onClick={() => setStandbyChatProjId('indep_1')}
                      className={`btn btn-sm ${standbyChatProjId === 'indep_1' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      DevCollab Web IDE (Student Peer Room)
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Chat Component */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <TeamChat
                  projectId={standbyChatProjId || 'proj_2'}
                  projectTitle={
                    standbyChatProjId === 'proj_1' 
                      ? 'Autonomous Drone Navigation Using Computer Vision & Edge AI'
                      : standbyChatProjId === 'indep_1'
                      ? 'DevCollab: Real-Time Pair Programming Web IDE'
                      : 'Decentralized Student Academic Credential Verification Portal'
                  }
                  mentorName={
                    standbyChatProjId === 'proj_1' 
                      ? 'Dr. Rajesh Kumar'
                      : standbyChatProjId === 'indep_1'
                      ? 'Prof. Ananya Sen (Faculty Advisor)'
                      : 'Prof. Ananya Sen'
                  }
                />
              </div>
            </div>
          ) : (
            teams.map(team => {
              const project = projects.find(p => p.id === team.projectId);
              const checklist = project?.checklist || [];
              const completedCount = checklist.filter(c => c.completed).length;
              const progressPct = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;
              const is100Percent = checklist.length > 0 && progressPct === 100;

              return (
                <div key={team.id} className="glass-card" style={{ padding: '2rem' }}>
                  
                  {/* Team Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span className="badge badge-purple">{team.domain || 'Engineering'}</span>
                        <span className="badge badge-indigo">Faculty Mentor: {team.mentorName}</span>
                      </div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{team.projectTitle}</h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {team.members?.length || 0} Teammates Collaborating
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setMentorToRate({ mentorId: team.mentorId, mentorName: team.mentorName, projectId: team.projectId })}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                      >
                        <Star size={13} fill="#fbbf24" color="#fbbf24" /> Rate Mentor
                      </button>
                    </div>
                  </div>

                  {/* 100% Milestone Progress Banner (Requirement 10) */}
                  {is100Percent && (
                    <div style={{ padding: '0.85rem 1.25rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '0.65rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Sparkles size={20} color="#34d399" />
                      <div>
                        <div style={{ fontWeight: '800', color: '#6ee7b7' }}>🎉 100% Deliverables Completed!</div>
                        <div style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>All checklist tasks are ticked. Your mentor will mark the project completed and issue verified certificates.</div>
                      </div>
                    </div>
                  )}

                  {/* Project Workspace Tools & Repository Submission */}
                  <div style={{ marginBottom: '1.5rem', backgroundColor: '#090d16', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FolderGit2 size={18} color="#818cf8" />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>Project Codebase & Workspace Submissions</h4>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Shared with faculty mentor & all team members</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>
                          GitHub / GitLab Repository URL:
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="url"
                            value={projectRepoUrls[team.projectId] || 'https://github.com/project-workspace/' + team.projectId}
                            onChange={(e) => setProjectRepoUrls({ ...projectRepoUrls, [team.projectId]: e.target.value })}
                            placeholder="https://github.com/your-team/repo"
                            style={{ flex: 1, padding: '0.5rem 0.75rem', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontSize: '0.85rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRepoUrl(team.projectId)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem' }}
                          >
                            Save
                          </button>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: '600', display: 'block', marginBottom: '0.35rem' }}>
                          Live Prototype / Documentation Demo URL:
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="url"
                            defaultValue={'https://demo.projectpartner.edu/' + team.projectId}
                            placeholder="https://demo-app.vercel.app"
                            style={{ flex: 1, padding: '0.5rem 0.75rem', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontSize: '0.85rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => alert('Demo URL saved and linked to project workspace!')}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem' }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Checklist & Progress (Requirement 3 & 4) */}
                  <div style={{ marginBottom: '1.75rem', backgroundColor: '#090d16', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#cbd5e1' }}>
                        Interactive Deliverables Checklist:
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: progressPct === 100 ? '#34d399' : '#818cf8' }}>
                        {progressPct}% ({completedCount} of {checklist.length} completed)
                      </span>
                    </div>

                    <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1rem' }}>
                      <div style={{
                        width: `${progressPct}%`,
                        height: '100%',
                        background: progressPct === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                        borderRadius: '9999px',
                        transition: 'width 0.4s ease'
                      }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {checklist.length === 0 ? (
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                          Checklist tasks will be added by the faculty mentor.
                        </div>
                      ) : (
                        checklist.map(item => (
                          <div key={item.id} style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '0.4rem',
                            backgroundColor: item.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                            border: `1px solid ${item.completed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <button
                                type="button"
                                onClick={() => handleToggleChecklist(team.projectId, item.id)}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '4px',
                                  border: item.completed ? 'none' : '2px solid #64748b',
                                  backgroundColor: item.completed ? '#10b981' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                {item.completed && <Check size={12} color="#ffffff" />}
                              </button>
                              <span style={{ fontSize: '0.85rem', fontWeight: '600', textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? '#94a3b8' : '#fff' }}>
                                {item.title}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe' }}>
                              Assigned: {item.assignedToName || 'Team'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Teammates Activity & Peer Reporting (Requirement 6 & 9) */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Teammate Work Designation & Activity:
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                      {team.members?.map((m, idx) => (
                        <div key={idx} style={{ padding: '0.85rem', borderRadius: '0.5rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{m.name}</div>
                            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', backgroundColor: m.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)', color: m.isActive ? '#34d399' : '#94a3b8' }}>
                              {m.isActive ? '🟢 Active' : 'Offline'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Role: <span style={{ color: '#818cf8' }}>{m.role || 'Member'}</span></div>
                          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.2rem' }}>Task: {m.currentTask || 'Assigned tasks'}</div>

                          {m.studentId !== user?.id && (
                            <button
                              type="button"
                              onClick={() => setPeerToReport({ studentId: m.studentId, studentName: m.name, projectId: team.projectId })}
                              className="btn btn-secondary btn-sm"
                              style={{ marginTop: '0.5rem', fontSize: '0.7rem', padding: '0.15rem 0.45rem', color: '#fca5a5' }}
                            >
                              <Flag size={11} /> Report Inactivity
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Collaboration Dual-Tab Chat Component */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <MessageSquare size={18} color="#818cf8" />
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>Team Collaboration Hub</h4>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Toggle between <strong>Students-Only Peer Chat</strong> and <strong>Team + Mentor Guidance</strong>.
                        </p>
                      </div>
                    </div>
                    <TeamChat 
                      projectId={team.projectId} 
                      projectTitle={team.projectTitle} 
                      mentorName={team.mentorName} 
                    />
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 5: MY APPLICATIONS
          ========================================================================= */}
      {activeTab === 'applications' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Your Project Applications</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Track approval status from faculty mentors
              </p>
            </div>
            <button onClick={loadApplications} className="btn btn-secondary btn-sm">Refresh Status</button>
          </div>

          {applications.length === 0 ? (
            <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', color: '#94a3b8' }}>
              <Layers size={36} color="#64748b" style={{ margin: '0 auto 1rem' }} />
              <h3>No project applications submitted yet.</h3>
              <p style={{ marginTop: '0.5rem' }}>Browse projects in the Explore tab and apply for positions!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {applications.map(app => {
                const project = projects.find(p => p.id === app.projectId);
                const isCompleted = app.status === 'completed' || project?.isCompleted || project?.status === 'completed';

                return (
                  <div key={app.id} className="glass-card" style={{
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    borderLeft: isCompleted ? '4px solid #8b5cf6' : app.status === 'accepted' ? '4px solid #10b981' : app.status === 'rejected' ? '4px solid #ef4444' : '4px solid #f59e0b'
                  }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        {isCompleted ? (
                          <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle2 size={13} /> COMPLETED & CERTIFIED
                          </span>
                        ) : (
                          <span className={`badge ${app.status === 'accepted' ? 'badge-emerald' : app.status === 'rejected' ? 'badge-rose' : 'badge-amber'}`}>
                            {app.status.toUpperCase()}
                          </span>
                        )}
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Submitted {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                        {app.projectTitle}
                      </h3>

                      {app.resumeName && (
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                          Attached CV: <strong>{app.resumeName}</strong>
                        </div>
                      )}

                      <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        "{app.coverNote}"
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      {isCompleted ? (
                        <>
                          <button onClick={() => setActiveTab('certificates')} className="btn btn-primary btn-sm">
                            <Award size={14} /> View Certificate
                          </button>
                          <button onClick={() => setActiveTab('teams')} className="btn btn-secondary btn-sm">
                            Workspace History
                          </button>
                        </>
                      ) : app.status === 'accepted' ? (
                        <button onClick={() => setActiveTab('teams')} className="btn btn-primary btn-sm">
                          Open Team Workspace
                        </button>
                      ) : app.status === 'pending' ? (
                        <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: '600' }}>
                          Under Mentor Review
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: '#f87171' }}>
                          Position Filled
                        </span>
                      )}

                      {/* Remove / Archive Application option */}
                      <button
                        onClick={() => handleRemoveApplication(app.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.45rem 0.65rem', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
                        title="Remove / Archive Application"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 6: VERIFIED COMPLETION CERTIFICATES (Requirement 5)
          ========================================================================= */}
      {activeTab === 'certificates' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Verified Project Completion Certificates</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Official certificates awarded by faculty mentors upon successful 100% project finish.
              </p>
            </div>
            <button onClick={loadCertificates} className="btn btn-secondary btn-sm">Refresh Certificates</button>
          </div>

          {myCertificates.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
              <Award size={40} color="#64748b" style={{ margin: '0 auto 1rem' }} />
              <h3>No certificates issued yet.</h3>
              <p style={{ marginTop: '0.5rem' }}>Complete your project deliverables with your mentor to earn verified capstone honors!</p>
            </div>
          ) : (
            <div className="grid-2">
              {myCertificates.map(cert => (
                <div key={cert.id} className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={24} color="#34d399" />
                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#34d399' }}>VERIFIED CAPSTONE CERTIFICATE</span>
                    </div>
                    <span className="badge badge-emerald">{cert.grade || 'Distinction'}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    {cert.projectTitle}
                  </h3>

                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                    Awarded to: <strong>{cert.studentName}</strong>
                    <div>Guiding Mentor: <strong>{cert.mentorName}</strong> ({cert.mentorDesignation})</div>
                    <div>Institution: <strong>{cert.institution}</strong></div>
                    <div>Issued: {cert.issueDate}</div>
                    {cert.stipendDisbursed && (
                      <div style={{ color: '#34d399', fontWeight: '700', marginTop: '0.25rem' }}>
                        Grant / Stipend: {cert.stipendDisbursed}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {cert.certId}</span>
                    <button
                      onClick={() => setViewingCertificate(cert)}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#10b981', border: 'none', fontSize: '0.8rem' }}
                    >
                      View & Print Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 7: STUDENT PROFILE & PORTFOLIO (Requirements 1, 5, 8, 11)
          ========================================================================= */}
      {activeTab === 'profile' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Student Profile & Academic Portfolio</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Manage your verified college details, resume, and skills</p>
              </div>
              <span className="badge badge-indigo" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                {user?.yearOfStudy || '3rd Year'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#090d16', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>College / University</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginTop: '0.2rem' }}>{user?.college || 'National Institute of Technology'}</div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#090d16', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Department & Year</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginTop: '0.2rem' }}>
                  {user?.department || 'Computer Science & Engg.'} ({user?.yearOfStudy || '3rd Year'})
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#090d16', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Daily Work Streak</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#f97316', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Flame size={16} fill="#f97316" /> {user?.streakDays || 5} Consecutive Days
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#090d16', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Hours Logged</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#38bdf8', marginTop: '0.2rem' }}>
                  ⏳ {user?.totalHoursSpent || 48} Hours on Projects
                </div>
              </div>
            </div>

            {/* Resume Upload / Preview Box (Requirement 1) */}
            <div style={{ marginBottom: '2rem', backgroundColor: '#090d16', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="#818cf8" />
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>Verified Student C.V. / Resume:</span>
                </div>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', fontSize: '0.75rem' }}>
                  <UploadCloud size={14} /> Update CV
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeFileUpload} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                Active Document: <strong>{resumeName}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                This CV is automatically attached and forwarded to professors whenever you apply for project opportunities.
              </div>
              {resumeSuccessMsg && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#34d399' }}>{resumeSuccessMsg}</div>
              )}
            </div>

            {/* Achievement Badges (Requirement 8) */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.75rem' }}>Achievement Badges Earned</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(user?.badges || ['🔥 5-Day Streak Master', '🚀 Project Pioneer', '📜 Certified Scholar', '⚡ Full-Stack Virtuoso']).map(b => (
                  <span key={b} style={{ padding: '0.4rem 0.85rem', borderRadius: '9999px', backgroundColor: 'rgba(79, 70, 229, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#c7d2fe', fontWeight: '700', fontSize: '0.85rem' }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Skills Management */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                Technical Skills (Matches with Project Requirements)
              </h3>
              <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Add skill (e.g. Next.js, Kubernetes, TensorFlow)..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  style={{ flex: 1, padding: '0.65rem 0.85rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
                <button type="submit" className="btn btn-secondary btn-sm">Add Skill</button>
              </form>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(user?.skills || []).map(s => (
                  <span key={s} className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    {s}
                    <button type="button" onClick={() => handleRemoveSkill(s)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Projects Worked On (Requirement 5) */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.75rem' }}>
                Projects Portfolio ({teams.length} Active, {myCertificates.length} Completed)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {teams.map(t => (
                  <div key={t.id} style={{ padding: '0.75rem 1rem', backgroundColor: '#090d16', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>{t.projectTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Mentor: {t.mentorName}</div>
                    </div>
                    <span className="badge badge-purple">In Progress</span>
                  </div>
                ))}
                {myCertificates.map(c => (
                  <div key={c.id} style={{ padding: '0.75rem 1rem', backgroundColor: '#090d16', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#34d399' }}>{c.projectTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Mentor: {c.mentorName} • Completed with Distinction</div>
                    </div>
                    <span className="badge badge-emerald">✓ Certified</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone: Delete Account (Requirement 11) */}
            <div style={{ borderTop: '1px solid rgba(239, 68, 68, 0.2)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f87171' }}>Delete Student Account</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Permanently remove your student account, portfolio, and applications.</p>
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
          MODAL: APPLY FOR PROJECT (Requirement 1 - Forwards CV)
          ========================================================================= */}
      {selectedProjectForApply && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-indigo" style={{ marginBottom: '0.35rem' }}>PROJECT APPLICATION</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{selectedProjectForApply.title}</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Faculty Mentor: {selectedProjectForApply.mentorName}</p>
              </div>
              <button onClick={() => setSelectedProjectForApply(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {applyFeedback.text && (
              <div style={{ padding: '0.85rem', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: applyFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: applyFeedback.type === 'success' ? '#6ee7b7' : '#fca5a5', fontSize: '0.85rem' }}>
                {applyFeedback.text}
              </div>
            )}

            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* CV Attachment Notice */}
              <div style={{ padding: '0.85rem', backgroundColor: 'rgba(99, 102, 241, 0.12)', borderRadius: '0.5rem', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FileText size={20} color="#818cf8" />
                <div style={{ fontSize: '0.825rem', color: '#c7d2fe' }}>
                  Your profile and CV document <strong>({resumeName})</strong> will be automatically attached and forwarded to {selectedProjectForApply.mentorName}.
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Cover Note / Pitch to Mentor
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Explain your relevant project experience, why you want to work on this research topic, and how your skills fit the project requirements..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSelectedProjectForApply(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" disabled={applying} className="btn btn-primary btn-sm">
                  {applying ? 'Submitting Application...' : 'Send Application & Forward CV'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE INDEPENDENT PROJECT (Requirement 5)
          ========================================================================= */}
      {showCreateIndepModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-indigo" style={{ marginBottom: '0.35rem' }}>STUDENT-LED COLLABORATION</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Pitch Independent Student Project</h3>
              </div>
              <button onClick={() => setShowCreateIndepModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateIndepSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Open-Source AI Lecture Summarizer"
                  value={indepTitle}
                  onChange={(e) => setIndepTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Problem Statement & What You Are Building</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe your student idea and what kind of teammates you want to collaborate with..."
                  value={indepProblem}
                  onChange={(e) => setIndepProblem(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Domain</label>
                  <select
                    value={indepDomain}
                    onChange={(e) => setIndepDomain(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  >
                    <option value="Full-Stack Web">Full-Stack Web</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="IoT & Hardware">IoT & Hardware</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Team Size</label>
                  <input
                    type="number"
                    min="2"
                    max="6"
                    value={indepTeamSize}
                    onChange={(e) => setIndepTeamSize(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowCreateIndepModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Publish Student Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: INVITE MENTOR TO INDEPENDENT PROJECT (Requirement 5)
          ========================================================================= */}
      {invitingIndepProj && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '0.35rem' }}>FACULTY GUIDANCE REQUEST</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Invite Mentor to Advise</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>For: {invitingIndepProj.title}</p>
              </div>
              <button onClick={() => setInvitingIndepProj(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInviteMentorToIndepSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Select Faculty Professor</label>
                <select
                  required
                  value={selectedMentorForInvite}
                  onChange={(e) => setSelectedMentorForInvite(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value="">-- Choose Professor to Advise --</option>
                  {allMentors.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.department || 'Faculty'} - {m.designation || 'Mentor'})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setInvitingIndepProj(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Send Faculty Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: LOG DAILY WORK HOURS & STREAK (Requirement 12)
          ========================================================================= */}
      {showLogTimeModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '0.35rem' }}>DAILY ACTIVITY & STREAK</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Log Today's Work Time</h3>
              </div>
              <button onClick={() => setShowLogTimeModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {logTimeSuccess && (
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', fontSize: '0.85rem' }}>
                {logTimeSuccess}
              </div>
            )}

            <form onSubmit={handleLogTimeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Hours Spent Today on Project Tasks
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="16"
                  required
                  value={workHours}
                  onChange={(e) => setWorkHours(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  What Did You Work On? (Progress Note)
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Connected sensor websocket feed and debugged latency..."
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowLogTimeModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
                  <Flame size={14} fill="#fff" /> Record & Boost Streak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: RATE MENTOR (Requirement 9)
          ========================================================================= */}
      {mentorToRate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '0.35rem' }}>MENTOR FEEDBACK</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Rate Mentor: {mentorToRate.mentorName}</h3>
              </div>
              <button onClick={() => setMentorToRate(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {rateSuccess && (
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', fontSize: '0.85rem' }}>
                {rateSuccess}
              </div>
            )}

            <form onSubmit={handleRateMentorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Rating (1 to 5 Stars)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setMentorRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      <Star size={28} fill={star <= mentorRating ? '#fbbf24' : 'none'} color={star <= mentorRating ? '#fbbf24' : '#64748b'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  Review & Guidance Feedback
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar provided incredible technical guidance on Jetson Nano edge acceleration and flight control algorithms..."
                  value={mentorReviewText}
                  onChange={(e) => setMentorReviewText(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setMentorToRate(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Submit Mentor Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REPORT INACTIVE / MISCONDUCTING PEER (Requirement 9)
          ========================================================================= */}
      {peerToReport && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-rose" style={{ marginBottom: '0.35rem' }}>CONFIDENTIAL REPORT</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Report Teammate: {peerToReport.studentName}</h3>
              </div>
              <button onClick={() => setPeerToReport(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {reportSuccess && (
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', fontSize: '0.85rem' }}>
                {reportSuccess}
              </div>
            )}

            <form onSubmit={handleReportPeerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value="Inactivity on Assigned Tasks">Inactivity on Assigned Tasks (Ghosting)</option>
                  <option value="Uncommunicative during Sprints">Uncommunicative during Sprints</option>
                  <option value="Plagiarism / Code Quality Issues">Plagiarism / Code Quality Issues</option>
                  <option value="Unprofessional Conduct">Unprofessional Conduct</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Incident Details</label>
                <textarea
                  rows="3"
                  placeholder="Provide context for the mentor and administrator to evaluate..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setPeerToReport(null)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ backgroundColor: '#ef4444', border: 'none' }}>
                  Submit Confidential Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: VIEW & PRINT VERIFIED CERTIFICATE (Requirement 5)
          ========================================================================= */}
      {viewingCertificate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '720px', padding: '3rem', border: '3px solid #10b981', backgroundColor: '#090d16', position: 'relative' }}>
            <button
              onClick={() => setViewingCertificate(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ textAlign: 'center', borderBottom: '2px solid rgba(16, 185, 129, 0.4)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Award size={36} color="#34d399" />
                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#34d399', letterSpacing: '0.1em' }}>
                  PROJECTPARTNER ACADEMIC HONORS
                </span>
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#fff' }}>Certificate of Project Completion</h2>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{viewingCertificate.institution}</div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ fontSize: '1rem', color: '#cbd5e1' }}>This is to certify that</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#a78bfa', margin: '0.5rem 0' }}>
                {viewingCertificate.studentName}
              </h3>
              <p style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
                has successfully completed the research and software engineering capstone project:
              </p>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginTop: '0.5rem' }}>
                "{viewingCertificate.projectTitle}"
              </h4>
              <div style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.4rem 1rem', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', fontWeight: '800', fontSize: '0.9rem' }}>
                Grade: {viewingCertificate.grade}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Certificate ID</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>{viewingCertificate.certId}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Date: {viewingCertificate.issueDate}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>{viewingCertificate.mentorName}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{viewingCertificate.mentorDesignation}</div>
                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '700', marginTop: '0.25rem' }}>✓ Verified Faculty Signature</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: '#10b981', border: 'none' }}
              >
                Print Official Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PITCH CAMPUS IDEA (Requirement 7)
          ========================================================================= */}
      {showCreatePostModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '0.35rem' }}>CAMPUS IDEA LOUNGE</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Pitch an Idea to Campus</h3>
              </div>
              <button onClick={() => setShowCreatePostModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Idea Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 💡 Idea Pitch: AI-Powered Campus Notes Sharing"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Pitch Description</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Explain the problem, what you want to build, and who you're looking for to team up..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Hackathon, AI/ML, Teammates Wanted"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowCreatePostModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Publish to Lounge</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
