import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Edit, Trash2, Eye, Users, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';
import { getUser } from '../utils/auth';
import NavbarCompany from '../components/companyHome/NavbarCompany';
import Footer from '../components/Footer';
import './MyJobsPage.css';

export default function MyJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
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
    fetchJobs(currentUser.id);
  }, [navigate]);

  const fetchJobs = async (userId) => {
    try {
      const response = await jobAPI.getCompanyJobs(userId);
      setJobs(response.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;

    try {
      await jobAPI.delete(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      alert('Job deleted successfully!');
    } catch (error) {
      alert('Failed to delete job: ' + error.message);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await jobAPI.update(jobId, { status: newStatus });
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
      alert(`Job status updated to ${newStatus}!`);
    } catch (error) {
      alert('Failed to update status: ' + error.message);
    }
  };

  const handleEdit = (job) => {
    alert(`Edit functionality coming soon for: ${job.title}`);
  };

  const handleToggleStatus = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    await handleStatusChange(jobId, newStatus);
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  return (
    <div className="my-jobs-page">
      {/* Background */}
      <div className="my-jobs-bg">
        <div className="my-jobs-orb-1" />
        <div className="my-jobs-orb-2" />
      </div>

      <NavbarCompany />

      <div className="my-jobs-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-jobs-header"
        >
          <div className="header-left">
            <Briefcase size={48} />
            <div>
              <h1>My Job Postings</h1>
              <p>Manage your active job listings</p>
            </div>
          </div>
          <button 
            className="create-job-btn"
            onClick={() => navigate('/company-home/post-job')}
          >
            + New Job Post
          </button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="jobs-stats-overview"
        >
          <div className="overview-card">
            <div className="overview-number">{jobs.length}</div>
            <div className="overview-label">Total Jobs</div>
          </div>
          <div className="overview-card">
            <div className="overview-number">{jobs.filter(j => j.status === 'active').length}</div>
            <div className="overview-label">Active</div>
          </div>
          <div className="overview-card">
            <div className="overview-number">{jobs.reduce((acc, j) => acc + (j.applicants_count || 0), 0)}</div>
            <div className="overview-label">Total Applicants</div>
          </div>
          <div className="overview-card">
            <div className="overview-number">{jobs.filter(j => j.status === 'closed').length}</div>
            <div className="overview-label">Closed</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="jobs-filters"
        >
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Jobs ({jobs.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({jobs.filter(j => j.status === 'active').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'closed' ? 'active' : ''}`}
            onClick={() => setFilter('closed')}
          >
            Closed ({jobs.filter(j => j.status === 'closed').length})
          </button>
        </motion.div>

        {/* Jobs List */}
        <div className="jobs-list">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="job-item-card"
            >
              <div className="job-item-header">
                <div className="job-item-title-section">
                  <h3>{job.title}</h3>
                  <div className={`status-badge-job ${job.status.toLowerCase()}`}>
                    {job.status}
                  </div>
                </div>
                <div className="job-item-actions">
                  <button 
                    className="action-icon-btn"
                    onClick={() => setSelectedJob(job)}
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    className="action-icon-btn"
                    onClick={() => handleEdit(job)}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="action-icon-btn delete"
                    onClick={() => handleDelete(job.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="job-item-meta">
                <span className="meta-badge">
                  <MapPin size={14} />
                  {job.location || 'Not specified'}
                </span>
                <span className="meta-badge">
                  <Briefcase size={14} />
                  {job.type || 'Full-time'}
                </span>
                <span className="meta-badge">
                  <Calendar size={14} />
                  {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
                </span>
                <span className="meta-badge highlight">
                  <Users size={14} />
                  {job.applicants_count || 0} applicants
                </span>
              </div>

              <p className="job-item-description">
                {job.description ? (job.description.length > 150 ? job.description.substring(0, 150) + '...' : job.description) : 'No description'}
              </p>

              <div className="job-item-skills">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.slice(0, 5).map((skill, idx) => (
                    <span key={idx} className="skill-tag-small">{typeof skill === 'string' ? skill : skill.name}</span>
                  ))
                ) : (
                  <span className="skill-tag-small">No skills listed</span>
                )}
              </div>

              <div className="job-item-footer">
                <div className="job-salary-info">
                  {job.salary_min && job.salary_max 
                    ? `$${(job.salary_min/1000).toFixed(0)}k - $${(job.salary_max/1000).toFixed(0)}k`
                    : 'Salary not specified'}
                </div>
                <div className="job-footer-actions">
                  <button 
                    className="view-applicants-btn"
                    onClick={() => navigate(`/company-home/job-applicants/${job.id}`)}
                  >
                    <Users size={16} />
                    View Applicants
                  </button>
                  <button 
                    className={`toggle-status-btn ${job.status.toLowerCase()}`}
                    onClick={() => handleToggleStatus(job.id)}
                  >
                    {job.status === 'active' ? 'Close Job' : 'Reopen Job'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="no-jobs-message">
              <Briefcase size={64} />
              <h3>No jobs found</h3>
              <p>Start by creating your first job posting</p>
              <button 
                className="create-first-job-btn"
                onClick={() => navigate('/company-home/post-job')}
              >
                Create Job Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <motion.div
          className="job-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedJob(null)}
        >
          <motion.div
            className="job-modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="job-modal-close" onClick={() => setSelectedJob(null)}>×</button>
            
            <div className="job-modal-header">
              <h2>{selectedJob.title}</h2>
              <div className={`status-badge-job ${selectedJob.status.toLowerCase()}`}>
                {selectedJob.status}
              </div>
            </div>

            <div className="job-modal-body">
              <div className="modal-info-row">
                <div className="modal-info-item">
                  <MapPin size={18} />
                  <span>{selectedJob.location || 'Not specified'}</span>
                </div>
                <div className="modal-info-item">
                  <Briefcase size={18} />
                  <span>{selectedJob.type || 'Full-time'}</span>
                </div>
                <div className="modal-info-item">
                  <Users size={18} />
                  <span>{selectedJob.applicants_count || 0} applicants</span>
                </div>
              </div>

              <div className="modal-section">
                <h4>Description</h4>
                <p>{selectedJob.description || 'No description provided'}</p>
              </div>

              {selectedJob.requirements && (
                <div className="modal-section">
                  <h4>Requirements</h4>
                  <p>{selectedJob.requirements}</p>
                </div>
              )}

              <div className="modal-section">
                <h4>Required Skills</h4>
                <div className="modal-skills">
                  {selectedJob.skills && selectedJob.skills.length > 0 ? (
                    selectedJob.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag-modal">
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))
                  ) : (
                    <p>No skills specified</p>
                  )}
                </div>
              </div>

              <div className="modal-section">
                <h4>Compensation</h4>
                <p>
                  {selectedJob.salary_min && selectedJob.salary_max 
                    ? `$${(selectedJob.salary_min/1000).toFixed(0)}k - $${(selectedJob.salary_max/1000).toFixed(0)}k per year`
                    : 'Salary not specified'}
                </p>
              </div>

              <div className="modal-section">
                <h4>Experience Level</h4>
                <p>{selectedJob.experience_level || 'Not specified'}</p>
              </div>
            </div>

            <div className="job-modal-footer">
              <button 
                className="modal-action-btn secondary"
                onClick={() => handleEdit(selectedJob)}
              >
                <Edit size={18} />
                Edit Job
              </button>
              <button 
                className="modal-action-btn primary"
                onClick={() => {
                  setSelectedJob(null);
                  navigate(`/company-home/job-applicants/${selectedJob.id}`);
                }}
              >
                <Users size={18} />
                View Applicants ({selectedJob.applicants_count || 0})
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
