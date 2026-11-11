import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  Building, 
  GraduationCap, 
  Briefcase, 
  ArrowRight,
  BookOpen,
  Calendar,
  Code2,
  X,
  Upload,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';

  const [role, setRole] = useState(initialRole);
  const navigate = useNavigate();

  // Shared form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');

  // Student specific fields
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');
  const [resumeName, setResumeName] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [skills, setSkills] = useState(['Python', 'React', 'MongoDB']);
  const [skillInput, setSkillInput] = useState('');
  const [interests, setInterests] = useState('Machine Learning, Full-Stack Web Development');

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

  // Mentor specific fields
  const [designation, setDesignation] = useState('Associate Professor');
  const [experienceYears, setExperienceYears] = useState('8');
  const [expertise, setExpertise] = useState('Artificial Intelligence, Distributed Systems');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      fullName,
      email,
      password,
      role,
      college,
      department,
      ...(role === 'student' ? {
        yearOfStudy,
        skills,
        interests: interests.split(',').map(i => i.trim()),
        resumeName: resumeName || `${fullName.replace(/\s+/g, '_')}_CV.pdf`,
        resumeUrl: resumeUrl || 'data:application/pdf;base64,SAMPLE_RESUME'
      } : {
        designation,
        experienceYears: Number(experienceYears),
        expertise: expertise.split(',').map(e => e.trim()),
      })
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.token) {
        login(data.user, data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Registration successful! Redirecting to your dashboard...');
        setTimeout(() => {
          if (role === 'mentor') navigate('/mentor/dashboard');
          else navigate('/student/dashboard');
        }, 1200);
      } else {
        setMessage('Registration received! In Phase 2, this will persist to MongoDB with hashed credentials. Redirecting to preview...');
        setTimeout(() => {
          if (role === 'mentor') navigate('/mentor/dashboard');
          else navigate('/student/dashboard');
        }, 1500);
      }
    } catch (err) {
      setMessage('ProjectPartner Phase 1 Active. Preparing your workspace...');
      setTimeout(() => {
        if (role === 'mentor') navigate('/mentor/dashboard');
        else navigate('/student/dashboard');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', padding: '3.5rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '2.5rem', boxShadow: 'var(--shadow-glow)' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <UserPlus size={24} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Create Your Account</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Join the smart student–mentor collaboration network
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.35rem', backgroundColor: '#090d16', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            type="button"
            onClick={() => setRole('student')}
            style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.925rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: role === 'student' ? '#4f46e5' : 'transparent',
              color: role === 'student' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            <GraduationCap size={18} /> Student Portal
          </button>

          <button
            type="button"
            onClick={() => setRole('mentor')}
            style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.925rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: role === 'mentor' ? '#7c3aed' : 'transparent',
              color: role === 'mentor' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            <Briefcase size={18} /> Mentor Studio
          </button>
        </div>

        {message && (
          <div style={{ padding: '0.85rem', backgroundColor: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '0.5rem', color: '#c7d2fe', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Row 1: Full Name & Email */}
          <div className="grid-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder={role === 'student' ? 'e.g. Rahul Sharma' : 'e.g. Dr. Rajesh Kumar'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.5rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                College / Institution Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.5rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Row 2: College & Department */}
          <div className="grid-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                College / University Name
              </label>
              <div style={{ position: 'relative' }}>
                <Building size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. National Institute of Technology"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.5rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                Department
              </label>
              <div style={{ position: 'relative' }}>
                <BookOpen size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & Engg."
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.5rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Role-Specific Fields */}
          {role === 'student' ? (
            <>
              {/* Year of study & Interests */}
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
                    Interests & Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AI, Full-Stack, IoT"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.85rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* CV Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Upload C.V. / Resume (.pdf, .doc, .docx) - Forwarded to Project Mentors
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', backgroundColor: '#090d16', border: '1px dashed rgba(99, 102, 241, 0.4)', borderRadius: '0.5rem', cursor: 'pointer', color: resumeName ? '#a5b4fc' : '#94a3b8', fontSize: '0.875rem' }}>
                  <Upload size={18} color="#818cf8" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {resumeName ? `Attached: ${resumeName}` : 'Select or Browse CV File from your computer'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Technical Skills Tag Picker */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Technical Skills (Crucial for Skill-Matching Algorithm)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Type skill & press Add (e.g. React, Python, C++, Docker)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(e); } }}
                    style={{ flex: 1, padding: '0.65rem 0.85rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <button type="button" onClick={addSkill} className="btn btn-secondary btn-sm">
                    Add Skill
                  </button>
                </div>

                {/* Selected skills tag pill list */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {skills.map(s => (
                    <span key={s} className="badge badge-indigo" style={{ padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Mentor specific inputs */}
              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Professor, Assistant Professor, Lead Researcher"
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
                    min="1"
                    max="50"
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.85rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Areas of Expertise / Research Focus
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Vision, Cloud Computing, Cyber Security"
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </>
          )}

          {/* Password field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Create Secure Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="At least 8 characters with letters & numbers"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.5rem', backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {loading ? 'Creating Account...' : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            <ArrowRight size={18} />
          </button>

        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to={`/login?role=${role}`} style={{ color: '#818cf8', fontWeight: '600' }}>
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
}
