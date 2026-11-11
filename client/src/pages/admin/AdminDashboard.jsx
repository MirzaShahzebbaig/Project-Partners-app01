import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FolderGit2, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  Activity,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminStats();
      if (res.status === 'success') {
        setStats(res.stats);
        setUsersList(res.users);
        setProjectsList(res.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteProject = async (projId) => {
    if (!window.confirm('Are you sure you want to moderate and remove this project?')) return;
    try {
      const token = localStorage.getItem('projectpartner_token');
      const res = await fetch(`/api/admin/projects/${projId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      
      {/* Banner */}
      <div className="glass-panel" style={{
        padding: '2rem',
        borderRadius: '1.25rem',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(79, 70, 229, 0.15) 100%)',
        border: '1px solid rgba(37, 99, 235, 0.3)',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(37, 99, 235, 0.35)'
          }}>
            <ShieldCheck size={28} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-blue">SYSTEM ADMINISTRATION</span>
              <span className="badge badge-emerald">Academic Governance</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800' }}>
              {user?.fullName || 'Academic Dean / Admin'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              College Platform Oversight, User Management & Activity Analytics
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={loadAdminData} className="btn btn-secondary btn-sm">Refresh Stats</button>
          <button onClick={logout} className="btn btn-secondary btn-sm" style={{ color: '#fca5a5' }}>Sign Out</button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Registered Students</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.4rem', color: '#60a5fa' }}>
            {stats?.totalStudents || 3}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>Active Profile Records</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Faculty Mentors</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.4rem', color: '#c084fc' }}>
            {stats?.totalMentors || 2}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '0.25rem' }}>Verified Faculty</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Published Projects</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.4rem', color: '#34d399' }}>
            {stats?.totalProjects || 4}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Across 4 Disciplines</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Applications</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.4rem', color: '#f59e0b' }}>
            {stats?.totalApplications || 2}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.25rem' }}>
            {stats?.acceptedApplications || 1} Accepted
          </div>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.25rem' }}>Registered Users Directory</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '0.75rem' }}>Name</th>
                <th style={{ padding: '0.75rem' }}>Email</th>
                <th style={{ padding: '0.75rem' }}>Role</th>
                <th style={{ padding: '0.75rem' }}>Department</th>
                <th style={{ padding: '0.75rem' }}>Skills / Expertise</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '600', color: '#ffffff' }}>{u.fullName}</td>
                  <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${u.role === 'student' ? 'badge-indigo' : u.role === 'mentor' ? 'badge-purple' : 'badge-blue'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{u.department}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {(u.skills || u.expertise || []).slice(0, 3).map(s => (
                        <span key={s} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{s}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Projects Moderation */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.25rem' }}>Published Projects Moderation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projectsList.map(proj => (
            <div key={proj.id} style={{ padding: '1rem 1.25rem', borderRadius: '0.5rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{proj.title}</h4>
                  <span className="badge badge-purple">{proj.domain}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Mentor: <strong>{proj.mentorName}</strong> ({proj.mentorDept})
                </div>
              </div>
              <button 
                onClick={() => handleDeleteProject(proj.id)}
                className="btn btn-secondary btn-sm"
                style={{ color: '#fca5a5' }}
              >
                <Trash2 size={14} /> Remove Project
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
