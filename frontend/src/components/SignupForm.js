import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { saveUser } from '../utils/auth';
import './LoginForm.css';

function SignupForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState({ fullName: '', companyName: '', email: '', password: '', confirmPassword: '', accountType: 'candidate' });
  const navigate = useNavigate();
  const [companyStep, setCompanyStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'accountType') {
      if (value === 'candidate') setCompanyStep(false);
      if (value === 'company') setForm((prev) => ({ ...prev, companyName: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (form.accountType === 'company' && !companyStep) {
      setError('Please enter your company name and press Continue.');
      return;
    }

    if (form.accountType === 'company' && (!form.companyName || form.companyName.trim() === '')) {
      setError('Please enter your company name.');
      return;
    }

    if (form.accountType === 'candidate' && !form.fullName) {
      setError('Please enter your full name.');
      return;
    }

    if (!form.email || !form.password) {
      setError('Please fill email and password.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: form.accountType === 'candidate' ? form.fullName : form.companyName,
        email: form.email,
        password: form.password,
        role: form.accountType,
      };

      if (form.accountType === 'company') {
        userData.company_name = form.companyName;
      }

      const response = await authAPI.register(userData);
      saveUser(response.user);
      
      // Navigate based on role
      if (response.user.role === 'company') {
        navigate('/company-home');
      } else {
        navigate('/employee-home');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyContinue = () => {
    if (!form.companyName || form.companyName.trim() === '') {
      setError('Please enter your company name to continue.');
      return;
    }
    setCompanyStep(true);
    setError('');
  };

  const handleBackToAccountType = () => {
    setForm(prev => ({ ...prev, accountType: 'candidate' }));
    setCompanyStep(false);
    setError('');
  };

  return (
    <div className="login-container">
      <div
        className={`form-wrapper ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="inner-container">
          <div className="login-header">
            <h2 className="login-title">SIGN UP</h2>
          </div>
        </div>

        {!isExpanded && (
          <button className="initial-button" />
        )}

        <div className="form-content">
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {error && <div style={{ color: '#ff4444', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
            
            {/* If a company account and not yet continued, ask for company name first */}
            {form.accountType === 'company' && !companyStep ? (
              <>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={handleBackToAccountType}
                    className="back-arrow"
                    style={{ 
                      position: 'absolute',
                      top: '-50px', 
                      left: '10px', 
                      width: '45px', 
                      height: '45px', 
                      fontSize: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255, 215, 0, 0.15)',
                      border: '2px solid rgba(255, 215, 0, 0.4)',
                      borderRadius: '12px',
                      color: '#FFD700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 215, 0, 0.25)';
                      e.target.style.borderColor = '#FFD700';
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 215, 0, 0.15)';
                      e.target.style.borderColor = 'rgba(255, 215, 0, 0.4)';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    &larr;
                  </button>
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Company Name"
                    className="neon-input"
                  />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="sign-in-button" style={{ flex: 1 }} onClick={handleCompanyContinue}>Continue</button>
                </div>
              </>
            ) : (
              <>
                {/* Show normal fields (for candidates, or companies after continue) */}
                {form.accountType === 'candidate' && (
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Full Name"
                    className="neon-input"
                  />
                )}

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                  className="neon-input"
                />

                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Password"
                  className="neon-input"
                />

                <input
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  placeholder="Confirm Password"
                  className="neon-input"
                />

                <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="radio-label">
                      <input
                        className="radio-input"
                        type="radio"
                        name="accountType"
                        value="candidate"
                        checked={form.accountType === 'candidate'}
                        onChange={handleChange}
                      />
                      I’m a Candidate
                    </label>

                    <label className="radio-label">
                      <input
                        className="radio-input"
                        type="radio"
                        name="accountType"
                        value="company"
                        checked={form.accountType === 'company'}
                        onChange={handleChange}
                      />
                      I’m a Company
                    </label>
                </div>

                <button className="sign-in-button" style={{ marginTop: 16 }} type="submit" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
                <div className="form-links" style={{ marginTop: 6, justifyContent: 'center' }}>
                  <Link to="/login" className="sign-up-link">Already have an account? Sign in here</Link>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
