import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Briefcase, Award, CheckCircle, XCircle, Clock, MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobAPI } from '../services/api';
import { getUser } from '../utils/auth';
import NavbarCompany from '../components/companyHome/NavbarCompany';
import Footer from '../components/Footer';
import './JobApplicantsPage.css';

export default function JobApplicantsPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'company') {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    fetchApplicants();
  }, [navigate, jobId]);

  const fetchApplicants = async () => {
    try {
      const response = await jobAPI.getApplicants(jobId);
      setJob(response.job);
      setApplicants(response.applicants);
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
      alert('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await jobAPI.updateApplicationStatus(applicationId, { status: newStatus });
      setApplicants(applicants.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      alert(`Application status updated to ${newStatus}!`);
    } catch (error) {
      alert('Failed to update status: ' + error.message);
    }
  };

  const handleContactCandidate = (applicant) => {
    const subject = encodeURIComponent(`Regarding your application for ${job.title}`);
    const body = encodeURIComponent(`Dear ${applicant.name},\n\nThank you for applying to the ${job.title} position at our company.\n\nBest regards`);
    window.location.href = `mailto:${applicant.email}?subject=${subject}&body=${body}`;
  };

  const filteredApplicants = applicants.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      reviewed: '#4169E1',
      shortlisted: '#32CD32',
      rejected: '#DC143C',
      hired: '#FFD700'
    };
    return colors[status] || '#888';
  };

  if (loading) {
    return (
      <div className="job-applicants-page">
        <NavbarCompany />
        <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>
          Loading applicants...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="job-applicants-page">
      {/* Background */}
      <div className="applicants-bg">
        <div className="applicants-orb-1" />
        <div className="applicants-orb-2" />
      </div>

      <NavbarCompany />

      <div className="applicants-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="applicants-header"
        >
          <button className="back-btn" onClick={() => navigate('/company-home/my-jobs')}>
            <ArrowLeft size={20} />
            Back to Jobs
          </button>
          <div className="header-info">
            <h1>{job?.title}</h1>
            <p>{applicants.length} Applicants</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="applicants-stats"
        >
          <div className="stat-card-app">
            <Clock size={24} />
            <div>
              <div className="stat-number">{applicants.filter(a => a.status === 'pending').length}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card-app">
            <CheckCircle size={24} />
            <div>
              <div className="stat-number">{applicants.filter(a => a.status === 'shortlisted').length}</div>
              <div className="stat-label">Shortlisted</div>
            </div>
          </div>
          <div className="stat-card-app">
            <Award size={24} />
            <div>
              <div className="stat-number">{applicants.filter(a => a.status === 'hired').length}</div>
              <div className="stat-label">Hired</div>
            </div>
          </div>
          <div className="stat-card-app">
            <XCircle size={24} />
            <div>
              <div className="stat-number">{applicants.filter(a => a.status === 'rejected').length}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="applicants-filters"
        >
          <button 
            className={`filter-btn-app ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn-app ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn-app ${filter === 'reviewed' ? 'active' : ''}`}
            onClick={() => setFilter('reviewed')}
          >
            Reviewed
          </button>
          <button 
            className={`filter-btn-app ${filter === 'shortlisted' ? 'active' : ''}`}
            onClick={() => setFilter('shortlisted')}
          >
            Shortlisted
          </button>
          <button 
            className={`filter-btn-app ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </motion.div>

        {/* Applicants List */}
        <div className="applicants-list">
          {filteredApplicants.map((applicant, index) => (
            <motion.div
              key={applicant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="applicant-card"
            >
              <div className="applicant-header">
                <div className="applicant-avatar">
                  {applicant.avatar ? (
                    <img src={applicant.avatar} alt={applicant.name} />
                  ) : (
                    <div className="avatar-placeholder">{applicant.name.charAt(0)}</div>
                  )}
                </div>
                <div className="applicant-info">
                  <h3>{applicant.name}</h3>
                  <p className="applicant-title">{applicant.title || 'Candidate'}</p>
                  <div 
                    className="status-badge-app" 
                    style={{ backgroundColor: getStatusColor(applicant.status) }}
                  >
                    {applicant.status}
                  </div>
                </div>
              </div>

              <div className="applicant-details">
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{applicant.email}</span>
                </div>
                {applicant.phone && (
                  <div className="detail-item">
                    <Phone size={16} />
                    <span>{applicant.phone}</span>
                  </div>
                )}
                <div className="detail-item">
                  <Briefcase size={16} />
                  <span>{applicant.experience_years || 0} years experience</span>
                </div>
              </div>

              {applicant.skills && applicant.skills.length > 0 && (
                <div className="applicant-skills">
                  {applicant.skills.slice(0, 5).map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {typeof skill === 'string' ? skill : skill.name || skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="applicant-actions">
                <button 
                  className="action-btn-app contact"
                  onClick={() => handleContactCandidate(applicant)}
                >
                  <MessageCircle size={16} />
                  Contact
                </button>
                <button 
                  className="action-btn-app view"
                  onClick={() => setSelectedApplicant(applicant)}
                >
                  View Details
                </button>
                <select
                  value={applicant.status}
                  onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
            </motion.div>
          ))}

          {filteredApplicants.length === 0 && (
            <div className="no-applicants">
              <Users size={64} />
              <h3>No applicants found</h3>
              <p>No one has applied to this position yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <motion.div
          className="applicant-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedApplicant(null)}
        >
          <motion.div
            className="applicant-modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedApplicant(null)}>×</button>
            
            <div className="modal-header-app">
              <div className="modal-avatar">
                {selectedApplicant.avatar ? (
                  <img src={selectedApplicant.avatar} alt={selectedApplicant.name} />
                ) : (
                  <div className="avatar-placeholder-large">{selectedApplicant.name.charAt(0)}</div>
                )}
              </div>
              <div>
                <h2>{selectedApplicant.name}</h2>
                <p>{selectedApplicant.title || 'Candidate'}</p>
              </div>
            </div>

            <div className="modal-body-app">
              <div className="modal-section-app">
                <h4>Contact Information</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={18} />
                    <span>{selectedApplicant.email}</span>
                  </div>
                  {selectedApplicant.phone && (
                    <div className="contact-item">
                      <Phone size={18} />
                      <span>{selectedApplicant.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-section-app">
                <h4>Experience</h4>
                <p>{selectedApplicant.experience_years || 0} years of professional experience</p>
              </div>

              {selectedApplicant.skills && selectedApplicant.skills.length > 0 && (
                <div className="modal-section-app">
                  <h4>Skills</h4>
                  <div className="modal-skills">
                    {selectedApplicant.skills.map((skill, idx) => (
                      <span key={idx} className="skill-badge-modal">
                        {typeof skill === 'string' ? skill : skill.name || skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApplicant.cover_letter && (
                <div className="modal-section-app">
                  <h4>Cover Letter</h4>
                  <p className="cover-letter">{selectedApplicant.cover_letter}</p>
                </div>
              )}

              <div className="modal-section-app">
                <h4>Applied On</h4>
                <p>{new Date(selectedApplicant.applied_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>

            <div className="modal-footer-app">
              <button 
                className="modal-btn-app contact"
                onClick={() => handleContactCandidate(selectedApplicant)}
              >
                <MessageCircle size={18} />
                Send Email
              </button>
              <button 
                className="modal-btn-app shortlist"
                onClick={() => {
                  handleStatusChange(selectedApplicant.id, 'shortlisted');
                  setSelectedApplicant(null);
                }}
              >
                <CheckCircle size={18} />
                Shortlist
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
