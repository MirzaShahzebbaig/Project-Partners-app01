import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/public/LandingPage';
import RoleGateway from './pages/public/RoleGateway';
import StudentDashboard from './pages/student/StudentDashboard';
import MentorDashboard from './pages/mentor/MentorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ServerSetup from './components/ServerSetup';
import { isNative, getApiBase } from './config';

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Verifying authorization...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/role-select" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'mentor') return <Navigate to="/mentor/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
}

export default function App() {
  // The APK has no backend of its own: ask for the server address on first launch.
  if (isNative() && !getApiBase()) {
    return <ServerSetup />;
  }

  return (
    <AuthProvider>
      <Router
        basename={import.meta.env.BASE_URL}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Primary Role-First Gateway: Asks Student or Mentor first */}
              <Route path="/role-select" element={<RoleGateway />} />
              <Route path="/login" element={<Navigate to="/role-select?action=login" replace />} />
              <Route path="/register" element={<Navigate to="/role-select?action=register" replace />} />

              {/* Protected Student Portal */}
              <Route 
                path="/student/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Mentor Studio */}
              <Route 
                path="/mentor/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['mentor']}>
                    <MentorDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Control Center */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
