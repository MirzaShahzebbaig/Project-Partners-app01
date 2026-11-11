import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Code2, Database, ShieldCheck, GitBranch } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      backgroundColor: '#070a12',
      paddingTop: '4rem',
      paddingBottom: '2.5rem',
      marginTop: '5rem',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem'
        }}>
          
          {/* Column 1: Platform Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={16} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
                Project<span className="text-gradient">Partner</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              A centralized web ecosystem engineered to connect aspiring college students with experienced faculty mentors through algorithmic skill-matching, team building, and milestone governance.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo">React 18</span>
              <span className="badge badge-purple">Node + Express</span>
              <span className="badge badge-emerald">MongoDB</span>
              <span className="badge badge-blue">JWT Auth</span>
            </div>
          </div>

          {/* Column 2: Portals */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Platform Portals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <li>
                <Link to="/register?role=student" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#a5b4fc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                  🎓 Student Registration
                </Link>
              </li>
              <li>
                <Link to="/register?role=mentor" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#a5b4fc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                  💡 Mentor Opportunity Studio
                </Link>
              </li>
              <li>
                <Link to="/login?role=admin" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#a5b4fc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                  🛡️ Administrator Access
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#a5b4fc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                  🔑 Universal Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Modules & Features */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Core Features
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <li><a href="#skill-simulator" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#a5b4fc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Skill Matching Algorithm</a></li>
              <li><a href="#features" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#a5b4fc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>One-Click Applications</a></li>
              <li><a href="#features" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#a5b4fc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Team Assembly & Roster</a></li>
              <li><a href="#how-it-works" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#a5b4fc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Milestone Progress Tracker</a></li>
              <li><a href="#domains" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#a5b4fc'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Multi-Domain Opportunities</a></li>
            </ul>
          </div>

          {/* Column 4: College Project Details */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Academic Scope
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Developed as a major Software Engineering capstone project adhering to full-stack engineering standards, security best practices, and role-based access control.
            </p>
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: '0.8rem',
              color: '#cbd5e1'
            }}>
              <strong>Architecture:</strong> Client–Server RESTful API<br />
              <strong>Auth:</strong> Salted Bcrypt + Signed JWT<br />
              <strong>Status:</strong> Phase 1 Deployed
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} ProjectPartner. Built for College Software Engineering Capstone & Viva Demonstration.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Designed with</span>
            <span style={{ color: '#ec4899' }}>♥</span>
            <span>for Students & Mentors</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
