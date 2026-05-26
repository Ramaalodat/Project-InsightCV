import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Clock, DollarSign, Filter, Star, Send, Eye, X, Mail, Phone, Globe, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';
import { getUser } from '../utils/auth';
import EmployeeNavbar from '../components/EmployeeNavbar';
import Footer from '../components/Footer';
import './JobListingsPage.css';

export default function JobListingsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [applying, setApplying] = useState(null);

  const [savedJobs, setSavedJobs] = useState([]);
  
  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  // Fetch jobs from API
  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    const fetchJobs = async () => {
      try {
        const filters = {};
        if (searchTerm) filters.search = searchTerm;
        if (typeFilter !== 'all') filters.type = typeFilter;
        
        const response = await jobAPI.getAll(filters);
        
        // Format jobs data
        const formattedJobs = response.jobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company?.name || 'Company',
          location: job.location,
          type: job.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          salary: job.salary_min && job.salary_max 
            ? `$${(job.salary_min/1000).toFixed(0)}k - $${(job.salary_max/1000).toFixed(0)}k`
            : 'Competitive',
          posted: getTimeAgo(job.created_at),
          match: Math.floor(Math.random() * 20) + 75, // Simulated match score
          skills: job.skills?.map(s => s.name) || [],
          description: job.description,
          applicants: job.applicants_count || 0,
          saved: false
        }));
        
        setJobs(formattedJobs);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [navigate, searchTerm, typeFilter]);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  const toggleSave = (jobId) => {
    const newSavedJobs = savedJobs.includes(jobId) 
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = typeFilter === 'all' || job.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const handleApply = async (job) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setApplying(job.id);

    try {
      await jobAPI.apply({
        job_id: job.id,
        user_id: user.id,
        cover_letter: '' // يمكن إضافة نافذة لإدخال cover letter
      });
      
      alert(`Application submitted successfully for ${job.title}!`);
      
      // Update applicants count
      setJobs(jobs.map(j => 
        j.id === job.id ? { ...j, applicants: j.applicants + 1 } : j
      ));
    } catch (error) {
      alert(error.message || 'Failed to apply. You may have already applied to this job.');
    } finally {
      setApplying(null);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const handleContactCompany = (job) => {
    setSelectedJob(job);
    setShowContactModal(true);
  };

  const sendContactMessage = () => {
    if (!contactMessage.trim()) {
      alert('Please enter a message');
      return;
    }
    
    // Here you would typically send the message via API
    alert(`Message sent to ${selectedJob.company}!\n\nYour message: "${contactMessage}"`);
    setShowContactModal(false);
    setContactMessage('');
  };

  return (
    <div className="job-listings-page">
      {/* Background */}
      <div className="job-listings-bg">
        <div className="job-listings-orb-1" />
        <div className="job-listings-orb-2" />
        <div className="job-listings-orb-3" />
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

      {/* Navbar */}
      <EmployeeNavbar />

      <div className="job-listings-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="job-listings-header"
        >
          <h1>Find Your Dream Job</h1>
          <p>Explore {filteredJobs.length} opportunities matched to your skills</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="search-filters-section"
        >
          <div className="search-bar-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by job title, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </button>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="filters-panel"
            >
              <div className="filter-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Job Type</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="full time">Full Time</option>
                  <option value="part time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setTypeFilter('all');
                }}
              >
                Clear All
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Job Cards */}
        <div className="jobs-grid">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#FFD700', gridColumn: '1 / -1' }}>
              Loading jobs...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="no-results">
              <Briefcase size={64} />
              <h3>No jobs found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="job-card"
                whileHover={{ y: -5 }}
              >
                {/* Match Badge */}
                <div className="match-badge" style={{
                  background: job.match >= 90 ? 'linear-gradient(135deg, #43e97b, #38f9d7)' :
                              job.match >= 80 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                              'linear-gradient(135deg, #667eea, #764ba2)'
                }}>
                  {job.match}% Match
                </div>

                {/* Save Button */}
                <button 
                  className={`save-btn ${savedJobs.includes(job.id) ? 'saved' : ''}`}
                  onClick={() => toggleSave(job.id)}
                >
                  <Star size={20} fill={savedJobs.includes(job.id) ? '#FFD700' : 'none'} />
                </button>

                {/* Job Info */}
                <div className="job-card-header">
                  <h3>{job.title}</h3>
                  <p className="company-name">{job.company}</p>
                </div>

                <div className="job-meta">
                  <span className="meta-item">
                    <MapPin size={16} />
                    {job.location}
                  </span>
                  <span className="meta-item">
                    <Briefcase size={16} />
                    {job.type}
                  </span>
                  <span className="meta-item">
                    <Clock size={16} />
                    {job.posted}
                  </span>
                </div>

                <p className="job-description">{job.description}</p>

                {/* Skills */}
                <div className="job-skills">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">{skill}</span>
                  ))}
                </div>

                {/* Footer */}
                <div className="job-card-footer">
                  <div className="job-salary">
                    <DollarSign size={16} />
                    {job.salary}
                  </div>
                  <div className="job-applicants">
                    {job.applicants} applicants
                  </div>
                </div>

                <div className="job-actions">
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(job)}
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  <button 
                    className="apply-btn-job"
                    onClick={() => handleApply(job)}
                    disabled={applying === job.id}
                  >
                    <Send size={18} />
                    {applying === job.id ? 'Applying...' : 'Apply Now'}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && !showContactModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedJob(null)}
        >
          <motion.div
            className="job-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedJob(null)}>
              <X size={24} />
            </button>

            <div className="job-modal-header">
              <div className="job-modal-title">
                <h2>{selectedJob.title}</h2>
                <p>{selectedJob.company}</p>
              </div>
              <div className="job-modal-match">
                <div className="match-badge-large" style={{
                  background: selectedJob.match >= 90 ? 'linear-gradient(135deg, #43e97b, #38f9d7)' :
                    selectedJob.match >= 80 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                      'linear-gradient(135deg, #667eea, #764ba2)'
                }}>
                  {selectedJob.match}% Match
                </div>
              </div>
            </div>

            <div className="job-modal-content">
              <div className="job-modal-meta">
                <div className="meta-item-modal">
                  <MapPin size={18} />
                  <span>{selectedJob.location}</span>
                </div>
                <div className="meta-item-modal">
                  <Briefcase size={18} />
                  <span>{selectedJob.type}</span>
                </div>
                <div className="meta-item-modal">
                  <DollarSign size={18} />
                  <span>{selectedJob.salary}</span>
                </div>
                <div className="meta-item-modal">
                  <Clock size={18} />
                  <span>{selectedJob.posted}</span>
                </div>
                <div className="meta-item-modal">
                  <Users size={18} />
                  <span>{selectedJob.applicants} applicants</span>
                </div>
              </div>

              <div className="job-modal-section">
                <h3>Job Description</h3>
                <p>{selectedJob.description}</p>
              </div>

              <div className="job-modal-section">
                <h3>Required Skills</h3>
                <div className="job-modal-skills">
                  {selectedJob.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge-modal">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="job-modal-section">
                <h3>Company Information</h3>
                <div className="company-info">
                  <p><strong>Company:</strong> {selectedJob.company}</p>
                  <p><strong>Location:</strong> {selectedJob.location}</p>
                  <p><strong>Industry:</strong> Technology</p>
                </div>
              </div>
            </div>

            <div className="job-modal-actions">
              <button 
                className="contact-company-btn"
                onClick={() => handleContactCompany(selectedJob)}
              >
                <Mail size={18} />
                Contact Company
              </button>
              <button 
                className="apply-modal-btn"
                onClick={() => handleApply(selectedJob)}
                disabled={applying === selectedJob.id}
              >
                <Send size={18} />
                {applying === selectedJob.id ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Contact Company Modal */}
      {showContactModal && selectedJob && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowContactModal(false)}
        >
          <motion.div
            className="contact-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setShowContactModal(false)}>
              <X size={24} />
            </button>

            <div className="contact-modal-header">
              <Mail size={32} />
              <h2>Contact {selectedJob.company}</h2>
              <p>Send a message about the {selectedJob.title} position</p>
            </div>

            <div className="contact-form">
              <div className="form-group">
                <label>Your Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Hi, I'm interested in the position and would like to know more about..."
                  rows="6"
                />
              </div>

              <div className="contact-actions">
                <button 
                  className="cancel-contact-btn"
                  onClick={() => setShowContactModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="send-message-btn"
                  onClick={sendContactMessage}
                >
                  <Send size={18} />
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
