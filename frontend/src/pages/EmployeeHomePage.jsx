import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { profileAPI, candidateAPI } from '../services/api';
import { getUser } from '../utils/auth';
import EmployeeNavbar from '../components/EmployeeNavbar';
import Footer from '../components/Footer';
import './EmployeeHomePage.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function EmployeeHomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'candidate') {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    
    const fetchData = async () => {
      try {
        const [statsResponse, completionResponse] = await Promise.all([
          profileAPI.getStatistics(currentUser.id),
          candidateAPI.checkProfileCompletion(currentUser.id)
        ]);
        
        setStatistics(statsResponse.statistics);
        setProfileCompletion(completionResponse);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Set default statistics on error
        setStatistics({
          cvs_analyzed: 0,
          practice_sessions: 0,
          points_earned: 0,
          jobs_applied: 0
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  return (
    <div className="employee-home-page">
      {/* Background effects */}
      <div className="employee-home-bg">
        <div className="employee-home-orb-1" />
        <div className="employee-home-orb-2" />
        <div className="employee-home-orb-3" />
      </div>

      {/* Particles - النقاط الصفراء */}
      <div className="particles-container">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <EmployeeNavbar />

      {/* Hero Section with Phone */}
      <motion.section 
        className="employee-hero"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="employee-hero-content">
          <div className="hero-with-phone">
            {/* Left Side - Text */}
            <motion.div variants={fadeUp} className="hero-text-section">
              <h1 className="employee-hero-title">
                Welcome to <span className="highlight-text">InsightCV</span> 📝
              </h1>
              <p className="employee-hero-description">
                Your intelligent career assistant that helps you prepare for your dream job!<br/>
                Upload your CV, chat with our AI assistant, and let us guide you toward success.
              </p>
              
              {/* Profile Completion Notice */}
              {profileCompletion && !profileCompletion.is_complete && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '20px',
                    padding: '15px 20px',
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '24px' }}>⚠️</span>
                    <h3 style={{ margin: 0, color: '#FFD700', fontSize: '18px' }}>
                      Complete Your Profile ({profileCompletion.completion_percentage}%)
                    </h3>
                  </div>
                  <p style={{ margin: '8px 0', color: '#fff', fontSize: '14px' }}>
                    To appear in company suggestions, please complete:
                  </p>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px', color: '#FFD700' }}>
                    {profileCompletion.missing_fields.map((field, idx) => (
                      <li key={idx}>{field}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate('/employee-home/profile')}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#1a1a2e',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Complete Profile →
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Right Side - Phone */}
            <motion.div 
              variants={fadeUp} 
              className="phone-container"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="phone">
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  <div className="message">Hello employee 👋</div>
                  <div className="message">Ready to enhance your CV?<br/>I will help you get your dream job...</div>
                  <div className="message">Let's begin your journey 🚀</div>
                  <div className="message">🚀 Your path to success</div>
                  <div className="message">💼 Get job opportunities that match your skills</div>
                  <div className="message">🧠 Discover weaknesses in your CV</div>
                  <div className="message">✨ Get smart AI recommendations</div>
                  <div className="message">📊 Analyze your career strengths</div>
                  <div className="message">🗂️ Save and improve your CV anytime</div>
                  <div className="message">🔍 Best suggestions and results</div>
                  <div className="message">📝 Generate optimized cover letters</div>
                  <div className="message">🎯 Match your CV to the right jobs automatically</div>
                  <div className="message">📚 Suggest courses and skills to fill gaps</div>
                </div>
                <div className="phone-home-indicator"></div>
              </div>
            </motion.div>
          </div>

          {/* Main Action Cards */}
          <motion.div variants={fadeUp} className="employee-main-actions">
            <motion.div 
              className="employee-action-card card-upload"
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => navigate('/employee-home/upload-cv')}
            >
              <div className="card-icon">
                <Upload size={48} />
              </div>
              <h3>Upload Your CV</h3>
              <p>Get AI-powered analysis and personalized recommendations</p>
              <div className="card-features">
                <span>✓ Strengths & Weaknesses</span>
                <span>✓ Skill Gap Analysis</span>
                <span>✓ Company Matches</span>
              </div>
              <button className="card-btn">Start Analysis →</button>
            </motion.div>

            <motion.div 
              className="employee-action-card card-interview"
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => navigate('/employee-home/ai-interview')}
            >
              <div className="card-icon">
                <MessageSquare size={48} />
              </div>
              <h3>AI Interview Simulation</h3>
              <p>Practice with AI and improve your interview skills</p>
              <div className="card-features">
                <span>✓ Chat & Voice Modes</span>
                <span>✓ Real-time Feedback</span>
                <span>✓ Progress Tracking</span>
              </div>
              <button className="card-btn">Start Practice →</button>
            </motion.div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={fadeUp} className="employee-stats">
            {loading ? (
              <div style={{ textAlign: 'center', color: '#FFD700', width: '100%' }}>
                Loading statistics...
              </div>
            ) : statistics ? (
              <>
                <div className="stat-item">
                  <div className="stat-number">{statistics.cvs_analyzed || 0}</div>
                  <div className="stat-label">CVs Analyzed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{statistics.practice_sessions || 0}</div>
                  <div className="stat-label">Practice Sessions</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{statistics.points_earned || user?.points || 0}</div>
                  <div className="stat-label">Points Earned</div>
                </div>
              </>
            ) : (
              <>
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">CVs Analyzed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Practice Sessions</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Points Earned</div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
