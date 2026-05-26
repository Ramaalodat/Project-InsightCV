import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';
import { getUser } from '../utils/auth';
import NavbarCompany from '../components/companyHome/NavbarCompany';
import Footer from '../components/Footer';
import './PostJobPage.css';

export default function PostJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'full-time',
    experience_level: 'mid',
    skills: [],
    description: '',
    requirements: '',
    salary_min: '',
    salary_max: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'company') {
      navigate('/login');
    } else {
      setUser(currentUser);
      checkProfileCompletion(currentUser.id);
    }
  }, [navigate]);

  const checkProfileCompletion = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/profile/${userId}`);
      const data = await response.json();
      const company = data.user.company;
      
      if (!company || !company.name || !company.industry || !company.about) {
        setError('Please complete your company profile before posting jobs');
      }
    } catch (err) {
      console.error('Failed to check profile:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to continue');
      navigate('/login');
      return;
    }

    if (!formData.title || !formData.location || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const jobData = {
        user_id: user.id,
        title: formData.title,
        location: formData.location,
        type: formData.type,
        experience_level: formData.experience_level,
        description: formData.description,
        requirements: formData.requirements,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        skills: formData.skills
      };

      await jobAPI.create(jobData);
      alert('Job posted successfully!');
      navigate('/company-home/my-jobs');
    } catch (err) {
      setError(err.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page">
      {/* Background */}
      <div className="post-job-bg">
        <div className="post-job-orb-1" />
        <div className="post-job-orb-2" />
      </div>

      <NavbarCompany />

      <div className="post-job-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="post-job-container"
        >
          <button onClick={() => navigate('/company-home')} className="back-btn-post">
            <ArrowLeft size={20} /> Back to Home
          </button>

          <div className="post-job-header">
            <Briefcase size={48} />
            <h1>Post a New Job</h1>
            <p>Find the perfect candidate for your team</p>
          </div>

          <form onSubmit={handleSubmit} className="job-form">
            <div className="form-row">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. New York, Remote"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Job Type *</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <label>Experience Level *</label>
                <select name="experience_level" value={formData.experience_level} onChange={handleChange} required>
                  <option value="">Select level...</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (2-5 years)</option>
                  <option value="senior">Senior Level (5+ years)</option>
                  <option value="lead">Lead/Principal</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Required Skills *</label>
              <div className="skills-input-container">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Type a skill and press Enter"
                />
                <button type="button" onClick={addSkill} className="add-skill-btn">
                  <Plus size={20} /> Add
                </button>
              </div>
              <div className="skills-display">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="skill-chip">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and what makes your company great..."
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List the key requirements and qualifications..."
                rows="4"
              />
            </div>

            {error && <div className="error-message" style={{color: '#ff4444', marginBottom: '20px', textAlign: 'center'}}>{error}</div>}

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/company-home')} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                <Briefcase size={20} /> {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
