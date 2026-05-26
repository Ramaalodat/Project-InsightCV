import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { saveUser } from '../utils/auth';
import './LoginForm.css';

function LoginForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });
      saveUser(response.user);
      
      // Navigate based on role
      if (response.user.role === 'company') {
        navigate('/company-home');
      } else {
        navigate('/employee-home');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');
    setResetMessage('');

    try {
      await authAPI.forgotPassword(resetEmail);
      setResetMessage('Password reset link sent to your email!');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetMessage('');
        setResetEmail('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      {/* back arrow removed per request */}
      
      {/* 'form-wrapper' هو العنصر الذي سيقوم بالحركة التمددية والتوهج النيوني */}
      <div 
        className={`form-wrapper ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* تم إزالة أيقونة القلب */}
      
      {/* المنطقة الداخلية السوداء */}
      <div className="inner-container">
      {/* عنوان LOGIN */}
      <div className="login-header">
        <h2 className="login-title">LOGIN</h2>
      </div>
      </div>

      {/* الزر الأولي الذي يتحول إلى نموذج. 
        يظهر فقط عندما isExpanded تكون 'false'
      */}
      {!isExpanded && (
        <button className="initial-button">
          {/* لا يوجد نص هنا - النص في login-header */}
        </button>
      )}

      {/* حقول الإدخال والأزرار الإضافية.
        تظهر فقط عندما isExpanded تكون 'true'
      */}
      <div className="form-content">
        {!showForgotPassword ? (
          <>
            {error && <div style={{ color: '#ff4444', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
            
            <input 
              type="email" 
              placeholder="Email" 
              className="neon-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="neon-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            
            <button 
              className="sign-in-button" 
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="form-links">
              <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}>
                Forgot Password
              </a>
              <Link to="/signup" className="sign-up-link">Sign up</Link>
            </div>
          </>
        ) : (
          <>
            {error && <div style={{ color: '#ff4444', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
            {resetMessage && <div style={{ color: '#4CAF50', marginBottom: '10px', fontSize: '14px' }}>{resetMessage}</div>}
            
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="neon-input" 
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleForgotPassword()}
            />
            
            <button 
              className="sign-in-button" 
              onClick={handleForgotPassword}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="form-links">
              <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); setShowForgotPassword(false); setError(''); }}>
                Back to Login
              </a>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}

export default LoginForm;
