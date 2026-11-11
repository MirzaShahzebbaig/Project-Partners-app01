import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, LogIn, Lock, Mail, ArrowRight, UserCheck, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Quick-fill credentials for easy college demonstration & testing
  const fillDemoCredentials = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setEmail('student.demo@college.edu');
      setPassword('StudentPass123!');
    } else if (selectedRole === 'mentor') {
      setEmail('mentor.rajesh@college.edu');
      setPassword('MentorPass123!');
    } else if (selectedRole === 'admin') {
      setEmail('admin.lead@college.edu');
      setPassword('AdminPass123!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        login(data.user, data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          if (data.user.role === 'mentor') navigate('/mentor/dashboard');
          else if (data.user.role === 'admin') navigate('/admin/dashboard');
          else navigate('/student/dashboard');
        }, 1000);
      } else {
        // Fallback for Phase 1 demo mode if backend auth endpoint is being wired
        setError(data.message || 'Authentication endpoint will be fully active in Phase 2. You can preview with demo data!');
      }
    } catch (err) {
      setError('Connection to auth service: Server is running Phase 1. Phase 2 will implement live token verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', boxShadow: 'var(--shadow-glow)' }}>
        
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
            <LogIn size={24} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Welcome Back</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to access your ProjectPartner dashboard
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', padding: '0.35rem', backgroundColor: '#090d16', borderRadius: '0.75rem', marginBottom: '1.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            type="button"
            onClick={() => setRole('student')}
            style={{
              padding: '0.55rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              backgroundColor: role === 'student' ? '#4f46e5' : 'transparent',
              color: role === 'student' ? '#ffffff' : '#94a3b8'
            }}
          >
            <GraduationCap size={15} /> Student
          </button>

          <button
            type="button"
            onClick={() => setRole('mentor')}
            style={{
              padding: '0.55rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              backgroundColor: role === 'mentor' ? '#7c3aed' : 'transparent',
              color: role === 'mentor' ? '#ffffff' : '#94a3b8'
            }}
          >
            <Briefcase size={15} /> Mentor
          </button>

          <button
            type="button"
            onClick={() => setRole('admin')}
            style={{
              padding: '0.55rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              backgroundColor: role === 'admin' ? '#2563eb' : 'transparent',
              color: role === 'admin' ? '#ffffff' : '#94a3b8'
            }}
          >
            <ShieldCheck size={15} /> Admin
          </button>
        </div>

        {/* Demo Fill Helper Pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', padding: '0.5rem 0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
          <span style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>Demo Viva Quick-Fill:</span>
          <button
            type="button"
            onClick={() => fillDemoCredentials(role)}
            style={{ background: 'transparent', border: 'none', color: '#c7d2fe', fontSize: '0.75rem', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Auto-Fill {role.toUpperCase()}
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Academic Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder={role === 'student' ? 'student@college.edu' : 'faculty@college.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  backgroundColor: '#090d16',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  color: '#ffffff',
                  fontSize: '0.925rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  backgroundColor: '#090d16',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  color: '#ffffff',
                  fontSize: '0.925rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            <ArrowRight size={18} />
          </button>

        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link to={`/register?role=${role}`} style={{ color: '#818cf8', fontWeight: '600' }}>
            Register as {role}
          </Link>
        </div>

      </div>
    </div>
  );
}
