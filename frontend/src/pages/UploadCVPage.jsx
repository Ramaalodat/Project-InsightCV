import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Brain, TrendingUp, AlertCircle, CheckCircle, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cvAPI } from '../services/api';
import { getUser } from '../utils/auth';
import EmployeeNavbar from '../components/EmployeeNavbar';
import Footer from '../components/Footer';
import './UploadCVPage.css';

export default function UploadCVPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    const finalJobTitle = jobTitle === 'custom' ? customJobTitle : jobTitle;
    if (!selectedFile || !finalJobTitle) {
      setError('Please upload a CV and enter/select a job title');
      return;
    }

    if (!user) {
      setError('Please login to continue');
      navigate('/login');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('cv_file', selectedFile);
      formData.append('job_title', finalJobTitle);
      formData.append('user_id', user.id);

      const response = await cvAPI.upload(formData);
      
      setAnalysis({
        strengths: response.cv.strengths,
        weaknesses: response.cv.weaknesses,
        missingSkills: response.cv.missing_skills,
        suggestions: response.cv.suggestions,
        matchedCompanies: response.cv.matched_companies,
        overallScore: response.cv.overall_score
      });
    } catch (err) {
      setError(err.message || 'Failed to analyze CV. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="upload-cv-page">
      {/* Background */}
      <div className="upload-cv-bg">
        <div className="upload-cv-orb-1" />
        <div className="upload-cv-orb-2" />
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

      <div className="upload-cv-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="upload-cv-container"
        >
          <h1 className="upload-cv-title">
            <Brain size={40} /> AI-Powered CV Analysis
          </h1>
          <p className="upload-cv-subtitle">
            Upload your CV and let our AI analyze your profile to provide personalized insights
          </p>

          {/* Upload Section */}
          {!analysis && (
            <div className="upload-section">
              {error && <div style={{ color: '#ff4444', marginBottom: '20px', padding: '10px', background: 'rgba(255,68,68,0.1)', borderRadius: '8px' }}>{error}</div>}
              
              <div className="upload-area">
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="cv-upload" className="upload-label">
                  <Upload size={48} />
                  <h3>{selectedFile ? selectedFile.name : 'Click to upload your CV'}</h3>
                  <p>PDF, DOC, or DOCX (Max 5MB)</p>
                </label>
              </div>

              <div className="job-title-section">
                <label htmlFor="job-title">Select Your Desired Job Title</label>
                <div className="job-title-inputs">
                  <select
                    id="job-title"
                    value={jobTitle}
                    onChange={(e) => {
                      setJobTitle(e.target.value);
                      if (e.target.value !== 'custom') {
                        setCustomJobTitle('');
                      }
                    }}
                    className="job-title-select"
                  >
                    <option value="">Choose a job title...</option>
                    <option value="frontend">Frontend Developer</option>
                    <option value="backend">Backend Developer</option>
                    <option value="fullstack">Full Stack Developer</option>
                    <option value="mobile">Mobile Developer</option>
                    <option value="devops">DevOps Engineer</option>
                    <option value="data">Data Scientist</option>
                    <option value="ml">ML Engineer</option>
                    <option value="product">Product Manager</option>
                    <option value="designer">UI/UX Designer</option>
                    <option value="custom">Other (Enter manually)</option>
                  </select>
                  
                  {jobTitle === 'custom' && (
                    <input
                      type="text"
                      value={customJobTitle}
                      onChange={(e) => setCustomJobTitle(e.target.value)}
                      placeholder="Enter job title..."
                      className="custom-job-title-input"
                    />
                  )}
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="analyze-btn"
              >
                {analyzing ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain size={20} />
                    Analyze My CV
                  </>
                )}
              </button>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="analysis-results"
            >
              <div className="overall-score">
                <div className="score-circle">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      style={{
                        strokeDasharray: `${analysis.overallScore * 2.827}, 282.7`,
                      }}
                    />
                  </svg>
                  <div className="score-text">
                    <span className="score-number">{analysis.overallScore}</span>
                    <span className="score-label">Overall Score</span>
                  </div>
                </div>
              </div>

              <div className="analysis-grid">
                {/* Strengths */}
                <div className="analysis-card">
                  <div className="card-header">
                    <CheckCircle size={24} />
                    <h3>Your Strengths</h3>
                  </div>
                  <ul>
                    {analysis.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="analysis-card">
                  <div className="card-header">
                    <AlertCircle size={24} />
                    <h3>Areas to Improve</h3>
                  </div>
                  <ul>
                    {analysis.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>

                {/* Missing Skills */}
                <div className="analysis-card">
                  <div className="card-header">
                    <TrendingUp size={24} />
                    <h3>Missing Skills</h3>
                  </div>
                  <div className="skills-tags">
                    {analysis.missingSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="analysis-card">
                  <div className="card-header">
                    <Brain size={24} />
                    <h3>AI Suggestions</h3>
                  </div>
                  <ul>
                    {analysis.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Matched Companies */}
              <div className="matched-companies">
                <h2>
                  <Building2 size={28} /> Recommended Companies
                </h2>
                <p className="companies-subtitle">Companies looking for candidates like you</p>
                <div className="companies-grid">
                  {analysis.matchedCompanies.map((company, idx) => (
                    <motion.div
                      key={idx}
                      className="company-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="company-match">{company.match}% Match</div>
                      <h4>{company.name}</h4>
                      <p>{company.location}</p>
                      <button className="apply-btn">View Details</button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <button onClick={() => { setAnalysis(null); setSelectedFile(null); setJobTitle(''); }} className="reset-btn">
                Analyze Another CV
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
