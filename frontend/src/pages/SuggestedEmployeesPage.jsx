import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, MapPin, Briefcase, Mail, Phone, Download, Eye, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../services/api';
import { getUser } from '../utils/auth';
import NavbarCompany from '../components/companyHome/NavbarCompany';
import Footer from '../components/Footer';
import './SuggestedEmployeesPage.css';

export default function SuggestedEmployeesPage() {
  const navigate = useNavigate();
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterExperience, setFilterExperience] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [minMatch, setMinMatch] = useState(0);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'company') {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    fetchCandidates(currentUser.id);
  }, [navigate, minMatch]);

  const fetchCandidates = async (userId) => {
    try {
      const filters = {};
      if (minMatch > 0) filters.min_match = minMatch;

      const response = await candidateAPI.getSuggested(userId, filters);

      // Format candidates data
      const formattedCandidates = response.suggested_candidates.map(item => ({
        id: item.candidate.id,
        name: item.candidate.user.name,
        title: item.candidate.title || 'Job Seeker',
        location: item.candidate.user.location || 'Not specified',
        experience: item.candidate.experience_years ? `${item.candidate.experience_years} years` : 'Not specified',
        match: item.match_percentage,
        skills: item.candidate.skills?.map(s => s.name) || [],
        availability: item.candidate.availability || 'available',
        expectedSalary: item.candidate.expected_salary_min && item.candidate.expected_salary_max
          ? `$${(item.candidate.expected_salary_min / 1000).toFixed(0)}k - $${(item.candidate.expected_salary_max / 1000).toFixed(0)}k`
          : 'Negotiable',
        summary: item.candidate.bio || 'No bio available',
        education: item.candidate.education || 'Not specified',
        email: item.candidate.user.email,
        phone: item.candidate.user.phone || 'Not provided',
        rating: 4.5 + (Math.random() * 0.5), // Simulated rating
        projects: Math.floor(Math.random() * 20) + 5, // Simulated projects
        avatar: item.candidate.user.avatar
          ? `http://localhost:8000/storage/${item.candidate.user.avatar}`
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.candidate.user.name)}&background=FFD700&color=1a1a2e&size=150`,
        matchReasons: item.match_reasons || []
      }));

      setCandidates(formattedCandidates);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSkill = filterSkill === 'all' || candidate.skills.some(s =>
      s.toLowerCase().includes(filterSkill.toLowerCase())
    );
    const matchesExperience = filterExperience === 'all' ||
      (filterExperience === 'junior' && parseInt(candidate.experience) <= 2) ||
      (filterExperience === 'mid' && parseInt(candidate.experience) > 2 && parseInt(candidate.experience) <= 5) ||
      (filterExperience === 'senior' && parseInt(candidate.experience) > 5);

    return matchesSkill && matchesExperience;
  });

  const handleContact = (candidate) => {
    alert(`Contact information:\nEmail: ${candidate.email}\nPhone: ${candidate.phone}`);
  };

  return (
    <div className="suggested-employees-page">
      {/* Background */}
      <div className="suggested-employees-bg">
        <div className="suggested-employees-orb-1" />
        <div className="suggested-employees-orb-2" />
      </div>

      <NavbarCompany />

      <div className="suggested-employees-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="suggested-employees-header"
        >
          <Users size={48} />
          <h1>AI-Matched Candidates</h1>
          <p>Top {filteredCandidates.length} candidates matched to your requirements</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="filters-section"
        >
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
              className="filters-panel-emp"
            >
              <div className="filter-group-emp">
                <label>Skills</label>
                <select value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)}>
                  <option value="all">All Skills</option>
                  <option value="react">React</option>
                  <option value="python">Python</option>
                  <option value="node">Node.js</option>
                  <option value="aws">AWS</option>
                  <option value="docker">Docker</option>
                </select>
              </div>

              <div className="filter-group-emp">
                <label>Experience Level</label>
                <select value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)}>
                  <option value="all">All Levels</option>
                  <option value="junior">Junior (0-2 years)</option>
                  <option value="mid">Mid (2-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                </select>
              </div>

              <button
                className="clear-filters-btn-emp"
                onClick={() => {
                  setFilterSkill('all');
                  setFilterExperience('all');
                }}
              >
                Clear
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Candidates Grid */}
        <div className="employees-grid">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#FFD700', gridColumn: '1 / -1' }}>
              Loading candidates...
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999', gridColumn: '1 / -1' }}>
              <Users size={64} style={{ marginBottom: '20px', opacity: 0.5 }} />
              <h3>No candidates found</h3>
              <p>Try adjusting your filters or post more jobs to get better matches.</p>
            </div>
          ) : (
            filteredCandidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="employee-card"
                whileHover={{ y: -5 }}
              >
                {/* Match Badge */}
                <div className="match-badge-emp" style={{
                  background: candidate.match >= 90 ? 'linear-gradient(135deg, #43e97b, #38f9d7)' :
                    candidate.match >= 85 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                      'linear-gradient(135deg, #667eea, #764ba2)'
                }}>
                  {candidate.match}% Match
                </div>

                {/* Avatar */}
                <div className="employee-avatar">
                  {candidate.avatar.startsWith('http') ? (
                    <img src={candidate.avatar} alt={candidate.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span className="avatar-emoji">{candidate.avatar}</span>
                  )}
                </div>

                {/* Info */}
                <h3 className="employee-name">{candidate.name}</h3>
                <p className="employee-title">{candidate.title}</p>

                <div className="employee-meta">
                  <span className="meta-item-emp">
                    <MapPin size={14} />
                    {candidate.location}
                  </span>
                  <span className="meta-item-emp">
                    <Briefcase size={14} />
                    {candidate.experience}
                  </span>
                </div>

                {/* Rating */}
                <div className="employee-rating">
                  <Star size={16} fill="#FFD700" color="#FFD700" />
                  <span>{candidate.rating.toFixed(1)}</span>
                  <span className="projects-count">• {candidate.projects} projects</span>
                </div>

                {/* Summary */}
                <p className="employee-summary">{candidate.summary}</p>

                {/* Skills */}
                <div className="employee-skills">
                  {candidate.skills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="skill-badge-emp">{skill}</span>
                  ))}
                  {candidate.skills.length > 4 && (
                    <span className="skill-badge-emp more">+{candidate.skills.length - 4}</span>
                  )}
                </div>

                {/* Availability & Salary */}
                <div className="employee-details">
                  <div className="detail-item">
                    <strong>Status:</strong> {candidate.availability}
                  </div>
                  <div className="detail-item">
                    <strong>Expected:</strong> {candidate.expectedSalary}
                  </div>
                </div>

                {/* Actions */}
                <div className="employee-actions">
                  <button
                    className="action-btn-emp secondary"
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <Eye size={18} />
                    View Profile
                  </button>
                  <button
                    className="action-btn-emp primary"
                    onClick={() => handleContact(candidate)}
                  >
                    <Mail size={18} />
                    Contact
                  </button>
                </div>

                <button
                  className="download-cv-btn"
                  onClick={() => alert('CV download feature coming soon!')}
                >
                  <Download size={16} />
                  Download CV
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedCandidate(null)}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedCandidate(null)}>×</button>

            <div className="modal-header">
              <div className="modal-avatar">
                {selectedCandidate.avatar.startsWith('http') ? (
                  <img src={selectedCandidate.avatar} alt={selectedCandidate.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '48px' }}>{selectedCandidate.avatar}</span>
                )}
              </div>
              <div>
                <h2>{selectedCandidate.name}</h2>
                <p>{selectedCandidate.title}</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>About</h4>
                <p>{selectedCandidate.summary}</p>
              </div>

              <div className="modal-section">
                <h4>Education</h4>
                <p>{selectedCandidate.education}</p>
              </div>

              <div className="modal-section">
                <h4>Skills</h4>
                <div className="modal-skills">
                  {selectedCandidate.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge-emp">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h4>Contact Information</h4>
                <p><Mail size={16} /> {selectedCandidate.email}</p>
                <p><Phone size={16} /> {selectedCandidate.phone}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn primary"
                onClick={() => handleContact(selectedCandidate)}
              >
                Contact Candidate
              </button>
              <button
                className="modal-btn secondary"
                onClick={() => alert('CV download feature coming soon!')}
              >
                Download CV
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
