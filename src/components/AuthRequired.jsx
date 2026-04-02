import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRequired = ({ children, requireAssessment = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          border: '3px solid rgba(99,102,241,0.25)',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontFamily: 'sans-serif' }}>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If assessment required and not completed, redirect to assessment
  if (requireAssessment && !user.assessmentCompleted) {
    if (!location.pathname.startsWith('/assessment')) {
      return <Navigate to="/assessment/language" replace />;
    }
  }

  return children;
};

export default AuthRequired;
