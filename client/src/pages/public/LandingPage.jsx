import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Cpu, 
  Users, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Target, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  FolderGit2, 
  Award,
  BookOpen,
  Filter,
  Check,
  ChevronRight,
  Code
} from 'lucide-react';

export default function LandingPage() {
  // Skill Match Simulator state
  const projectRequiredSkills = ['Python', 'Machine Learning', 'React', 'MongoDB'];
  const [selectedStudentSkills, setSelectedStudentSkills] = useState(['Python', 'Machine Learning', 'MongoDB']);
  
  const allAvailableSkills = [
    'Python', 'Machine Learning', 'React', 'MongoDB', 
    'Node.js', 'Java', 'Docker', 'C++', 'Tailwind CSS', 'AWS'
  ];

  const toggleSkill = (skill) => {
    if (selectedStudentSkills.includes(skill)) {
      setSelectedStudentSkills(selectedStudentSkills.filter(s => s !== skill));
    } else {
      setSelectedStudentSkills([...selectedStudentSkills, skill]);
    }
  };

  // Compute live match score
  const matchedSkills = projectRequiredSkills.filter(s => selectedStudentSkills.includes(s));
  const missingSkills = projectRequiredSkills.filter(s => !selectedStudentSkills.includes(s));
  const matchPercentage = Math.round((matchedSkills.length / projectRequiredSkills.length) * 100);

  // Workflow tab state ('student' | 'mentor')
  const [activeWorkflowTab, setActiveWorkflowTab] = useState('student');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Sample featured projects for preview
  const sampleProjects = [
    {
      id: 1,
      title: 'Autonomous Drone Navigation using Computer Vision',
      mentor: 'Dr. Rajesh Kumar',
      dept: 'CSE Dept',
      domain: 'AI & Robotics',
      skills: ['Python', 'OpenCV', 'PyTorch', 'ROS'],
      teamSize: 4,
      duration: '12 Weeks',
      matchScore: 85
    },
    {
      id: 2,
      title: 'Decentralized Healthcare Record Management System',
      mentor: 'Prof. Ananya Sen',
      dept: 'IT & Healthcare',
      domain: 'Full-Stack Web',
      skills: ['React', 'Node.js', 'MongoDB', 'Solidity'],
      teamSize: 3,
      duration: '10 Weeks',
      matchScore: 92
    },
    {
      id: 3,
      title: 'IoT Smart Campus Energy Monitoring & Optimization',
      mentor: 'Dr. Suresh Varma',
      dept: 'ECE & Embedded',
      domain: 'IoT & Cloud',
      skills: ['C++', 'MQTT', 'Node.js', 'React'],
      teamSize: 3,
      duration: '8 Weeks',
      matchScore: 78
    }
  ];

  const filteredProjects = sampleProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Glow Lights */}
      <div className="glow-orb" style={{ top: '-10%', left: '10%', width: '500px', height: '500px', backgroundColor: 'rgba(79, 70, 229, 0.15)' }}></div>
      <div className="glow-orb" style={{ top: '25%', right: '5%', width: '450px', height: '450px', backgroundColor: 'rgba(124, 58, 237, 0.15)' }}></div>

      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section style={{ paddingTop: '5rem', paddingBottom: '4.5rem', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '960px' }}>
          
          {/* Top Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', backgroundColor: 'rgba(79, 70, 229, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '1.75rem' }}>
            <Sparkles size={16} color="#818cf8" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#c7d2fe' }}>
              Smart Student–Mentor Project Collaboration Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: '800', lineHeight: '1.15', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            Bridge the Gap Between <br />
            <span className="text-gradient">Student Ambition</span> &amp; <span className="text-gradient-purple">Mentor Innovation</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#94a3b8', lineHeight: '1.7', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
            A centralized academic hub where mentors publish real-world research opportunities, students discover projects matched precisely to their technical skills, and teams execute with milestone tracking.
          </p>

          {/* Dual Role Call-to-Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem', marginBottom: '3.5rem' }}>
            <Link to="/role-select?role=student" className="btn btn-primary btn-lg" style={{ minWidth: '220px' }}>
              <GraduationCap size={20} />
              <span>Join as Student</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/role-select?role=mentor" className="btn btn-secondary btn-lg" style={{ minWidth: '220px', borderColor: 'rgba(124, 58, 237, 0.4)' }}>
              <Briefcase size={20} color="#c084fc" />
              <span>Publish as Mentor</span>
            </Link>
          </div>

          {/* Quick Search Preview Box */}
          <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '640px', margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
            <Search size={20} color="#818cf8" />
            <input 
              type="text" 
              placeholder="Search projects by skills (e.g. Python, React), title or domain..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.95rem'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Clear
              </button>
            )}
            <span className="badge badge-purple" style={{ display: 'none', sm: 'inline-flex' }}>
              Live Filter
            </span>
          </div>

          {/* Quick Filter Tags */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Popular:</span>
            {['AI/ML', 'Full-Stack', 'IoT', 'Python', 'React'].map((tag) => (
              <button 
                key={tag}
                onClick={() => setSearchQuery(tag)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#93c5fd',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.8rem'
                }}
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          METRICS & IMPACT BANNER
          ========================================================================= */}
      <section style={{ padding: '2rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>150+</div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>Active Mentor Projects</p>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>850+</div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>Registered Students</p>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>95+</div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>Verified Faculty Mentors</p>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-mono)' }}>94%</div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>Skill Match Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED PROJECTS LIVE PREVIEW (FILTERABLE)
          ========================================================================= */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <div className="badge badge-indigo" style={{ marginBottom: '0.75rem' }}>
                <FolderGit2 size={13} />
                <span>EXPLORE OPPORTUNITIES</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>
                Latest Mentor-Posted Projects
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.35rem' }}>
                Browse projects currently seeking students with complementary skillsets.
              </p>
            </div>
            <Link to="/role-select?role=student" className="btn btn-outline btn-sm">
              <span>View All 150+ Projects</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Project Cards Grid */}
          <div className="grid-3">
            {filteredProjects.length === 0 ? (
              <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <Search size={36} color="#64748b" style={{ margin: '0 auto 1rem' }} />
                <h3>No projects match "{searchQuery}"</h3>
                <p style={{ marginTop: '0.5rem' }}>Try searching for Python, React, IoT, or clear the filter.</p>
                <button onClick={() => setSearchQuery('')} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                  Reset Search
                </button>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div key={project.id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Header: Domain badge & Match Score */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="badge badge-purple">{project.domain}</span>
                      <span className="match-score-pill match-high">
                        <Sparkles size={12} />
                        {project.matchScore}% Match
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                      {project.title}
                    </h3>

                    {/* Mentor Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#ffffff' }}>
                        {project.mentor.charAt(4)}
                      </div>
                      <span>{project.mentor} • <span style={{ color: '#818cf8' }}>{project.dept}</span></span>
                    </div>

                    {/* Required Skills */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.5rem' }}>
                        Required Skills:
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {project.skills.map(skill => (
                          <span key={skill} className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={14} color="#60a5fa" /> {project.teamSize} Students
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} color="#a5b4fc" /> {project.duration}
                      </span>
                    </div>
                    
                    <Link to="/role-select?role=student" className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Apply
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE SKILL MATCH SIMULATOR (SHOWSTOPPER COLLEGE DEMO)
          ========================================================================= */}
      <section id="skill-simulator" style={{ padding: '5rem 0', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <div className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>
              <Cpu size={14} />
              <span>LIVE ALGORITHM DEMONSTRATION</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>
              Test The Skill-Based Matching System
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
              ProjectPartner compares project requirements against student competencies using our mathematical matching engine. Toggle skills below to experience the real-time scoring!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            
            {/* Left: Student Skill Selector */}
            <div className="glass-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={22} color="#818cf8" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Your Student Profile</h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Click to add or remove skills from your profile:</p>
                </div>
              </div>

              {/* Skill Toggle Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.75rem' }}>
                {allAvailableSkills.map((skill) => {
                  const isSelected = selectedStudentSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      style={{
                        padding: '0.5rem 0.9rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: isSelected 
                          ? '1px solid #4f46e5' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: isSelected 
                          ? 'rgba(79, 70, 229, 0.25)' 
                          : 'rgba(30, 41, 59, 0.6)',
                        color: isSelected ? '#a5b4fc' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      {isSelected && <Check size={14} color="#818cf8" />}
                      {skill}
                    </button>
                  );
                })}
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <strong>Mathematical Formula:</strong><br />
                <span className="mono" style={{ color: '#c7d2fe' }}>
                  Match % = (Matching Skills / Total Required Skills) × 100
                </span>
              </div>
            </div>

            {/* Right: Live Project Match Preview */}
            <div className="glass-card" style={{ padding: '2.25rem', border: '1px solid rgba(124, 58, 237, 0.4)', position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>TARGET MENTOR PROJECT</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                    AI-Driven Autonomous Rover
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Mentor: Prof. V. Ramanathan (Robotics Lab)</p>
                </div>

                {/* Score Dial / Badge */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '4.5rem',
                    height: '4.5rem',
                    borderRadius: '50%',
                    background: `conic-gradient(#8b5cf6 ${matchPercentage * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                  }}>
                    <div style={{
                      width: '3.6rem',
                      height: '3.6rem',
                      borderRadius: '50%',
                      backgroundColor: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '800',
                      fontSize: '1rem',
                      color: matchPercentage >= 75 ? '#34d399' : matchPercentage >= 50 ? '#818cf8' : '#fbbf24'
                    }}>
                      {matchPercentage}%
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', marginTop: '0.25rem', display: 'block' }}>
                    Match Score
                  </span>
                </div>
              </div>

              {/* Required Skills breakdown */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.6rem' }}>
                  Project Skill Verification Breakdown:
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {projectRequiredSkills.map((skill) => {
                    const isMatched = selectedStudentSkills.includes(skill);
                    return (
                      <div key={skill} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 0.75rem', borderRadius: '0.4rem', backgroundColor: isMatched ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${isMatched ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isMatched ? '#6ee7b7' : '#fca5a5' }}>
                          {skill}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isMatched ? '#34d399' : '#f87171' }}>
                          {isMatched ? '✓ Match Found' : '✗ Missing in Profile'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendation Banner */}
              <div style={{
                padding: '0.9rem',
                borderRadius: '0.5rem',
                backgroundColor: matchPercentage >= 75 ? 'rgba(16, 185, 129, 0.15)' : matchPercentage >= 50 ? 'rgba(79, 70, 229, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                border: `1px solid ${matchPercentage >= 75 ? 'rgba(16, 185, 129, 0.3)' : matchPercentage >= 50 ? 'rgba(79, 70, 229, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Sparkles size={20} color={matchPercentage >= 75 ? '#34d399' : matchPercentage >= 50 ? '#818cf8' : '#fbbf24'} />
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Recommendation Status: </strong>
                  {matchPercentage >= 75 ? (
                    <span style={{ color: '#34d399' }}>Strong Candidate — Top Priority Application</span>
                  ) : matchPercentage >= 50 ? (
                    <span style={{ color: '#a5b4fc' }}>Eligible Match — Recommended to Apply</span>
                  ) : (
                    <span style={{ color: '#fbbf24' }}>Partial Match — Skill Expansion Advised</span>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          THE PROBLEM WE ARE SOLVING (COMPARISON)
          ========================================================================= */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>
              Why College Projects Fail <br />
              <span className="text-gradient">And How We Solve It</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem' }}>
              Traditional college projects suffer from lack of guidance and skill mismatches. ProjectPartner redesigns the collaboration process.
            </p>
          </div>

          <div className="grid-2">
            
            {/* The Old Way */}
            <div className="glass-card" style={{ padding: '2.5rem', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fca5a5' }}>
                  Traditional Project Difficulties
                </h3>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1', fontSize: '0.925rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span>
                  <span><strong>Friend-Based Teaming:</strong> Groups formed by social circles without balanced technical skills (e.g. all frontend, no backend).</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span>
                  <span><strong>Toy Ideas:</strong> Relying on generic, theoretical, or copied online projects rather than real-world challenges.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span>
                  <span><strong>Disconnected Mentors:</strong> Faculty mentors have research ideas but no platform to find capable students.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span>
                  <span><strong>No Accountability:</strong> Projects stall due to absence of structured milestones and progress tracking.</span>
                </li>
              </ul>
            </div>

            {/* The ProjectPartner Way */}
            <div className="glass-card" style={{ padding: '2.5rem', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={24} color="#34d399" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#6ee7b7' }}>
                  The ProjectPartner Solution
                </h3>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1', fontSize: '0.925rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Algorithmic Skill Matching:</strong> Transparent score calculation matching project demands to student profiles.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Real Mentor-Published Opportunities:</strong> Direct guidance on authentic industry and research problems.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Curated Team Assembly:</strong> Mentors handpick students based on skills and cover notes, preventing duplicate entries.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Milestone Governance:</strong> Structured progress delivery, task tracking, and verified mentor completion feedback.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS (DUAL WORKFLOW FOR STUDENTS & MENTORS)
          ========================================================================= */}
      <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
            <div className="badge badge-indigo" style={{ marginBottom: '0.75rem' }}>
              <Layers size={14} />
              <span>STEP-BY-STEP WORKFLOW</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>
              Engineered For Both User Roles
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem' }}>
              Seamless workflows designed for student growth and mentor oversight.
            </p>

            {/* Toggle Tabs */}
            <div style={{ display: 'inline-flex', padding: '0.35rem', backgroundColor: '#090d16', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', marginTop: '1.75rem' }}>
              <button
                onClick={() => setActiveWorkflowTab('student')}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: activeWorkflowTab === 'student' ? '#4f46e5' : 'transparent',
                  color: activeWorkflowTab === 'student' ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.2s'
                }}
              >
                <GraduationCap size={16} /> Student Journey
              </button>
              
              <button
                onClick={() => setActiveWorkflowTab('mentor')}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: activeWorkflowTab === 'mentor' ? '#7c3aed' : 'transparent',
                  color: activeWorkflowTab === 'mentor' ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.2s'
                }}
              >
                <Briefcase size={16} /> Mentor Journey
              </button>
            </div>
          </div>

          {/* Workflow Steps Container */}
          <div className="grid-4" style={{ marginTop: '2.5rem' }}>
            {activeWorkflowTab === 'student' ? (
              <>
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#818cf8', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>01</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Build Profile</h4>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Register, list technical skills, college department, graduation year, and link your resume or GitHub.</p>
                </div>
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#818cf8', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>02</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Discover Matches</h4>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Search faculty projects ranked dynamically by your personalized skill matching percentage.</p>
                </div>
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#818cf8', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>03</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Apply & Join Team</h4>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Submit an application with a cover note. Track status (Pending, Accepted, Rejected) in real-time.</p>
                </div>
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#818cf8', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>04</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Deliver & Certify</h4>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Complete milestone tasks, collaborate with peers, and earn verified mentor feedback for your resume.</p>
                </div>
              </>
            ) : (
              <>
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#c084fc', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>01</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Post Opportunity</h4>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Publish project problem statements, domain category, required tech stack, and team size capacity.</p>
                </div>
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#c084fc', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>02</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Review Candidates</h4>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>View student applicants pre-sorted by skill compatibility scores. Review profiles and portfolios.</p>
                </div>
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#c084fc', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>03</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Assemble Team</h4>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Accept top applicants with one click to automatically assemble the official project team.</p>
                </div>
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#c084fc', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>04</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Guide Milestones</h4>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Assign milestone sprints, monitor progress, provide continuous feedback, and mark completion.</p>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          FEATURED DOMAINS
          ========================================================================= */}
      <section id="domains" style={{ padding: '5rem 0' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>
              Explore Projects By Domain
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem' }}>
              Covering the spectrum of modern computer science and engineering disciplines.
            </p>
          </div>

          <div className="grid-3">
            {[
              { title: 'Artificial Intelligence & ML', count: '45 Projects', desc: 'Computer Vision, NLP, Deep Learning, Predictive Modeling', color: '#818cf8', icon: Cpu },
              { title: 'Full-Stack Web Development', count: '52 Projects', desc: 'MERN, Next.js, Microservices, Real-time Collaborative Systems', color: '#c084fc', icon: Code },
              { title: 'IoT & Embedded Systems', count: '28 Projects', desc: 'Smart Campus, Sensors, MQTT, Raspberry Pi & ESP32 Hardware', color: '#60a5fa', icon: Target },
              { title: 'Cybersecurity & Blockchain', count: '18 Projects', desc: 'Cryptography, Threat Detection, Smart Contracts, Penetration Testing', color: '#34d399', icon: ShieldCheck },
              { title: 'Cloud Computing & DevOps', count: '22 Projects', desc: 'Docker, Kubernetes, AWS Architectures, CI/CD Automated Pipelines', color: '#fbbf24', icon: Layers },
              { title: 'Mobile App Development', count: '25 Projects', desc: 'React Native, Flutter, Cross-Platform Mobile Solutions', color: '#f43f5e', icon: TrendingUp },
            ].map((d, index) => {
              const IconComp = d.icon;
              return (
                <div key={index} className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.6rem', backgroundColor: `${d.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComp size={22} color={d.color} />
                    </div>
                    <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>{d.count}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.4rem' }}>{d.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' }}>{d.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION BANNER
          ========================================================================= */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="glass-panel" style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.4)',
            borderRadius: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: '800', marginBottom: '1rem' }}>
              Ready to Build Your Real-World Project?
            </h2>
            <p style={{ color: '#c7d2fe', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 2rem' }}>
              Join hundreds of students and faculty mentors collaborating on high-impact academic and research projects today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/role-select?role=student" className="btn btn-primary btn-lg">
                <GraduationCap size={20} />
                <span>Register as Student</span>
              </Link>
              <Link to="/role-select?role=mentor" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#0f172a' }}>
                <Briefcase size={20} color="#c084fc" />
                <span>Register as Mentor</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
