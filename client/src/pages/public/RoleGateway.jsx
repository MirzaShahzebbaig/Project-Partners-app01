import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  Building, 
  BookOpen, 
  ShieldCheck, 
  ArrowLeft,
  X,
  Check,
  Upload,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function RoleGateway() {
  const [searchParams] = useSearchParams();
  const urlRole = searchParams.get('role');
  const urlAction = searchParams.get('action'); // 'login' | 'register'

  // Step 1: Role ('none' | 'student' | 'mentor' | 'admin')
  const [selectedRole, setSelectedRole] = useState(urlRole || null);
  
  // Step 2: Action ('login' | 'register')
  const [activeAction, setActiveAction] = useState(urlAction || 'login');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');
  const [resumeName, setResumeName] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [skills, setSkills] = useState(['Python', 'React', 'MongoDB']);
  const [skillInput, setSkillInput] = useState('');
  const [designation, setDesignation] = useState('Associate Professor');
  const [experienceYears, setExperienceYears] = useState('10');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setResumeUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle skill tag addition
  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (sToRemove) => {
    setSkills(skills.filter(s => s !== sToRemove));
  };

  // Demo 1-Click Fast Login for Viva Demonstration
  const handleQuickDemoLogin = async (roleType) => {
    setLoading(true);
    setError('');
    const demoCredentials = {
      student: { email: 'student.demo@college.edu', password: 'StudentPass123!' },
      mentor: { email: 'mentor.rajesh@college.edu', password: 'MentorPass123!' },
      admin: { email: 'admin.lead@college.edu', password: 'AdminPass123!' }
    }[roleType];

    try {
      const res = await api.login(demoCredentials.email, demoCredentials.password, roleType);
      if (res.status === 'success' && res.token) {
        login(res.user, res.token);
        setSuccess(`Logged in as ${res.user.fullName}! Redirecting...`);
        setTimeout(() => {
          if (roleType === 'mentor') navigate('/mentor/dashboard');
          else if (roleType === 'admin') navigate('/admin/dashboard');
          else navigate('/student/dashboard');
        }, 700);
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Server running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeAction === 'login') {
        const res = await api.login(email, password, selectedRole);
        if (res.status === 'success' && res.token) {
          login(res.user, res.token);
          setSuccess('Login successful! Redirecting to dashboard...');
          setTimeout(() => {
            if (res.user.role === 'mentor') navigate('/mentor/dashboard');
            else if (res.user.role === 'admin') navigate('/admin/dashboard');
            else navigate('/student/dashboard');
          }, 700);
        } else {
          setError(res.message || 'Invalid credentials');
        }
      } else {
        // Registration
        const payload = {
          email,
          password,
          role: selectedRole,
          fullName,
          college: college || 'National Institute of Technology',
          department: department || 'Engineering',
          ...(selectedRole === 'student' ? {
            yearOfStudy,
            skills,
            resumeName: resumeName || `${fullName.replace(/\s+/g, '_')}_CV.pdf`,
            resumeUrl: resumeUrl || 'data:application/pdf;base64,SAMPLE_RESUME_DOC'
          } : {
            designation,
            experienceYears: Number(experienceYears)
          })
        };

        const res = await api.register(payload);
        if (res.status === 'success' && res.token) {
          login(res.user, res.token);
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => {
            if (selectedRole === 'mentor') navigate('/mentor/dashboard');
            else navigate('/student/dashboard');
          }, 700);
        } else {
          setError(res.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', position: 'relative' }}>
      
      {/* Background Orbs */}
      <div className="glow-orb" style={{ top: '10%', left: '15%', width: '380px', height: '380px', backgroundColor: 'rgba(79, 70, 229, 0.12)' }}></div>
      <div className="glow-orb" style={{ bottom: '10%', right: '15%', width: '380px', height: '380px', backgroundColor: 'rgba(124, 58, 237, 0.12)' }}></div>

      <div style={{ width: '100%', maxWidth: selectedRole ? '580px' : '900px', position: 'relative', zIndex: 1 }}>
        
        {/* =========================================================================
            STEP 1: ASK FIRST WHETHER YOU ARE A STUDENT OR A MENTOR
            ========================================================================= */}
        {!selectedRole && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', backgroundColor: 'rgba(79, 70, 229, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '1.25rem' }}>
                <Sparkles size={16} color="#818cf8" />
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#c7d2fe' }}>STEP 1 OF 2: IDENTIFY YOUR ROLE</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '800', lineHeight: '1.2' }}>
                Are you a <span className="text-gradient">Student</span> or a <span className="text-gradient-purple">Mentor</span>?
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginTop: '0.75rem', maxWidth: '600px', margin: '0.75rem auto 0' }}>
                Select your academic identity below to access your dedicated workspace and collaboration tools.
              </p>
            </div>

            {/* Role Selection Big Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Option A: STUDENT */}
              <div 
                onClick={() => setSelectedRole('student')}
                className="glass-card" 
                style={{
                  padding: '2.5rem',
                  cursor: 'pointer',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div>
                  <div style={{
                    width: '3.75rem',
                    height: '3.75rem',
                    borderRadius: '1rem',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.4)'
                  }}>
                    <GraduationCap size={32} color="#ffffff" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>I am a Student</h2>
                    <span className="badge badge-indigo">Learner / Builder</span>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Discover real-world research & software projects, match your skills algorithmically, find teammates, and build verified practical experience.
                  </p>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '2rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="#34d399" />
                      <span>Skill-Based Match % for all projects</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="#34d399" />
                      <span>One-click applications with cover notes</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="#34d399" />
                      <span>Join official teams & track milestones</span>
                    </li>
                  </ul>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                  <span>Continue as Student</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Option B: MENTOR */}
              <div 
                onClick={() => setSelectedRole('mentor')}
                className="glass-card" 
                style={{
                  padding: '2.5rem',
                  cursor: 'pointer',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div>
                  <div style={{
                    width: '3.75rem',
                    height: '3.75rem',
                    borderRadius: '1rem',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 20px rgba(124, 58, 237, 0.4)'
                  }}>
                    <Briefcase size={32} color="#ffffff" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>I am a Mentor</h2>
                    <span className="badge badge-purple">Faculty / Guide</span>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Publish high-impact project opportunities, receive student applications ranked by required technical skills, and oversee milestone delivery.
                  </p>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '2rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="#c084fc" />
                      <span>Post projects specifying required tech stack</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="#c084fc" />
                      <span>Applicants pre-ranked by skill match %</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="#c084fc" />
                      <span>One-click accept & automated team building</span>
                    </li>
                  </ul>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' }}>
                  <span>Continue as Mentor</span>
                  <ArrowRight size={18} />
                </button>
              </div>

            </div>

            {/* Admin Discreet Entry */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button 
                onClick={() => { setSelectedRole('admin'); setActiveAction('login'); }}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                onMouseOver={(e) => e.target.style.color = '#94a3b8'}
                onMouseOut={(e) => e.target.style.color = '#64748b'}
              >
                <ShieldCheck size={16} /> College Administrator Login
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: LATER ASK THEM TO LOGIN OR SIGN IN (ACCORDING TO CHOSEN ROLE)
            ========================================================================= */}
        {selectedRole && (
          <div className="glass-panel" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-glow)' }}>
            
            {/* Top Bar: Back to role selection & chosen role pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <button
                type="button"
                onClick={() => { setSelectedRole(null); setError(''); setSuccess(''); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={16} /> Change Role
              </button>

              <span className={`badge ${selectedRole === 'student' ? 'badge-indigo' : selectedRole === 'mentor' ? 'badge-purple' : 'badge-blue'}`}>
                {selectedRole === 'student' ? '🎓 STUDENT PORTAL' : selectedRole === 'mentor' ? '💡 MENTOR STUDIO' : '🛡️ ADMIN CONTROL'}
              </span>
            </div>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.85rem', fontWeight: '800' }}>
                {activeAction === 'login' ? `Sign In as ${selectedRole.toUpperCase()}` : `Create ${selectedRole.toUpperCase()} Account`}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {activeAction === 'login' 
                  ? 'Access your active projects, applications, and team workspace' 
                  : 'Complete your profile to get matched with real-world projects'}
              </p>
            </div>

            {/* Toggle Between Login & Sign In (Register) */}
            {selectedRole !== 'admin' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.35rem', backgroundColor: '#090d16', borderRadius: '0.75rem', marginBottom: '1.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  type="button"
                  onClick={() => { setActiveAction('login'); setError(''); }}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    backgroundColor: activeAction === 'login' ? (selectedRole === 'student' ? '#4f46e5' : '#7c3aed') : 'transparent',
                    color: activeAction === 'login' ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.2s'
                  }}
                >
                  <LogIn size={16} /> Sign In
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveAction('register'); setError(''); }}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    backgroundColor: activeAction === 'register' ? (selectedRole === 'student' ? '#4f46e5' : '#7c3aed') : 'transparent',
                    color: activeAction === 'register' ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.2s'
                  }}
                >
                  <UserPlus size={16} /> Create Account
                </button>
              </div>
            )}

            {/* Quick 1-Click Demo Login Pill (For Viva demonstration) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#c7d2fe' }}>
                  ⚡ Quick Demo Mode (Evaluation/Viva):
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Instant login without typing passwords
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(selectedRole)}
                disabled={loading}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                1-Click Demo Login
              </button>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '0.5rem', color: '#6ee7b7', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {success}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {/* Registration Extra Fields */}
              {activeAction === 'register' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        required
                        placeholder={selectedRole === 'student' ? 'e.g. Rahul Sharma' : 'e.g. Dr. Rajesh Kumar'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.5rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                        College / University
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. NIT College"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 0.85rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                        Department
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Computer Science"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 0.85rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {selectedRole === 'student' && (
                    <>
                      <div className="grid-2">
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                            Year of Study
                          </label>
                          <select
                            value={yearOfStudy}
                            onChange={(e) => setYearOfStudy(e.target.value)}
                            style={{ width: '100%', padding: '0.7rem 0.85rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                          >
                            <option value="1st Year">1st Year (Freshman)</option>
                            <option value="2nd Year">2nd Year (Sophomore)</option>
                            <option value="3rd Year">3rd Year (Junior)</option>
                            <option value="4th Year">4th Year (Senior / Final)</option>
                            <option value="Postgraduate">Postgraduate / Masters</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                            Upload C.V. / Resume (.pdf, .docx)
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.85rem', backgroundColor: '#090d16', border: '1px dashed rgba(99, 102, 241, 0.4)', borderRadius: '0.5rem', cursor: 'pointer', color: resumeName ? '#a5b4fc' : '#94a3b8', fontSize: '0.85rem' }}>
                            <Upload size={16} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {resumeName ? `Attached: ${resumeName}` : 'Select or Browse CV File'}
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleCvUpload}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                          Your Technical Skills (for Skill-Matching Algorithm)
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <input
                            type="text"
                            placeholder="Type skill & press Enter (e.g. React, Python, C++, AWS)"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(e); } }}
                            style={{ flex: 1, padding: '0.65rem 0.85rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                          />
                          <button type="button" onClick={addSkill} className="btn btn-secondary btn-sm">Add</button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {skills.map(s => (
                            <span key={s} className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              {s}
                              <button type="button" onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedRole === 'mentor' && (
                    <div className="grid-2">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                          Designation
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Associate Professor"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          style={{ width: '100%', padding: '0.7rem 0.85rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          style={{ width: '100%', padding: '0.7rem 0.85rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Academic Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    placeholder={selectedRole === 'student' ? 'student.demo@college.edu' : 'mentor.rajesh@college.edu'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.5rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.5rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.5rem', background: selectedRole === 'mentor' ? 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' : undefined }}
              >
                {loading ? 'Processing...' : (
                  activeAction === 'login' 
                    ? `Sign In to ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal` 
                    : `Complete ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Registration`
                )}
                <ArrowRight size={18} />
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
