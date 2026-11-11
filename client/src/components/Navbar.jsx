import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Cpu, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  GraduationCap,
  Briefcase,
  LayoutDashboard,
  LogOut,
  FolderGit2,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ServerSetup from './ServerSetup';
import { isNative } from '../config';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showServerSetup, setShowServerSetup] = useState(false);
  const [serverHealth, setServerHealth] = useState({ online: false, checking: true, db: 'standby' });

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setServerHealth({ online: true, checking: false, db: data.database });
        } else {
          setServerHealth({ online: false, checking: false, db: 'offline' });
        }
      })
      .catch(() => {
        setServerHealth({ online: false, checking: false, db: 'offline' });
      });
  }, []);

  const getDashboardPath = () => {
    if (!user) return '/role-select';
    if (user.role === 'mentor') return '/mentor/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
        
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div className="nav-logo" style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="nav-brand-text" style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
                Project<span className="text-gradient">Partner</span>
              </span>
              <span className="badge badge-indigo nav-badge" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                ACADEMIC
              </span>
            </div>
            <p className="nav-sub" style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '-2px' }}>
              Student–Mentor Collaboration Hub
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="nav-desktop">
          <Link to="/" style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            Home
          </Link>
          <a href="/#skill-simulator" style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={15} color="#818cf8" />
            Skill Matcher
          </a>
          <a href="/#how-it-works" style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            How It Works
          </a>
          <a href="/#domains" style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            Domains
          </a>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Live Full-Stack Indicator */}
          <div 
            className="nav-health"
            title={`Backend Status: ${serverHealth.online ? 'Online' : 'Offline'} (${serverHealth.db})`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              fontSize: '0.75rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: serverHealth.online ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${serverHealth.online ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: serverHealth.online ? '#34d399' : '#f87171'
            }}
          >
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: serverHealth.online ? '#10b981' : '#ef4444',
              boxShadow: serverHealth.online ? '0 0 8px #10b981' : 'none'
            }}></span>
            <span className="nav-health-text" style={{ fontWeight: '600' }}>
              {serverHealth.online ? 'API Online' : 'Offline'}
            </span>
          </div>

          {user ? (
            /* Logged-In User Actions */
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {user.role === 'student' && (
                <span className="badge badge-emerald nav-streak" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}>
                  <Flame size={13} fill="#f97316" color="#f97316" /> {user.streakDays || 5}d Streak 🔥
                </span>
              )}
              <Link to={getDashboardPath()} className="btn btn-primary btn-sm" style={{ display: 'inline-flex' }}>
                <LayoutDashboard size={15} />
                <span className="nav-label">Dashboard ({user.role})</span>
              </Link>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="btn btn-secondary btn-sm"
                title="Sign Out"
                style={{ padding: '0.45rem 0.65rem' }}
              >
                <LogOut size={15} color="#fca5a5" />
              </button>
            </div>
          ) : (
            /* Guest Actions -> Route directly to Role Gateway asking Student or Mentor */
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/role-select?action=login" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex' }}>
                <LogIn size={15} />
                <span className="nav-label">Sign In</span>
              </Link>

              <Link to="/role-select" className="btn btn-primary btn-sm" style={{ display: 'inline-flex' }}>
                <UserPlus size={15} />
                <span className="nav-label">Select Role</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              display: 'none', 
              background: 'transparent', 
              border: 'none', 
              color: '#ffffff', 
              cursor: 'pointer',
              padding: '0.4rem'
            }}
            className="menu-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 860px) {
          .nav-desktop { display: flex !important; }
        }
        @media (max-width: 859px) {
          .menu-toggle { display: block !important; }
        }
      `}</style>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#090d16',
          borderTop: '1px solid #1e293b',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1' }}>Home</Link>
          <a href="/#skill-simulator" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1' }}>Skill Matcher</a>
          <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1' }}>How It Works</a>
          <a href="/#domains" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1' }}>Project Domains</a>
          
          {isNative() && (
            <button type="button" onClick={() => { setMobileMenuOpen(false); setShowServerSetup(true); }} style={{ background: 'none', border: 'none', color: '#a5b4fc', textAlign: 'left', fontSize: '1rem', padding: 0 }}>
              Server settings
            </button>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Link to="/role-select?role=student" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              <GraduationCap size={15} /> Student
            </Link>
            <Link to="/role-select?role=mentor" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              <Briefcase size={15} /> Mentor
            </Link>
          </div>
        </div>
      )}
      {showServerSetup && <ServerSetup onCancel={() => setShowServerSetup(false)} />}
    </header>
  );
}
