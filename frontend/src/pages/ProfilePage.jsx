import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, Award, TrendingUp, Plus, X, Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { profileAPI, cvAPI } from '../services/api';
import { getUser, saveUser } from '../utils/auth';
import EmployeeNavbar from '../components/EmployeeNavbar';
import Footer from '../components/Footer';
import './ProfilePage.css';

// Skills Editor Component
const SkillsEditor = ({ skills, onChange }) => {
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState('intermediate');

  const addSkill = () => {
    if (newSkill.trim() && !skills.find(s => s.toLowerCase() === newSkill.toLowerCase())) {
      onChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="skills-editor">
      <div className="skills-list">
        {skills.map((skill, idx) => (
          <div key={idx} className="skill-item-editable">
            <span>{skill}</span>
            <button onClick={() => removeSkill(skill)} className="remove-skill-btn">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="add-skill-form">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          placeholder="Add a skill..."
          className="skill-input"
        />
        <button onClick={addSkill} className="add-skill-btn-small">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

// CV Upload Component
const CVUploadSection = ({ user, onCVUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [cvFile, setCvFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const uploadCV = async () => {
    if (!cvFile || !user) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('cv_file', cvFile);
      formData.append('user_id', user.id);

      const response = await cvAPI.upload(formData);
      onCVUploaded(response);
      setCvFile(null);
      alert('CV uploaded successfully!');
    } catch (error) {
      alert('Failed to upload CV: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="cv-upload-section">
      <div className="upload-area">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="cv-upload"
        />
        <label htmlFor="cv-upload" className="upload-label">
          <Upload size={24} />
          <span>{cvFile ? cvFile.name : 'Choose CV File (PDF)'}</span>
        </label>
      </div>
      {cvFile && (
        <button 
          onClick={uploadCV} 
          disabled={uploading}
          className="upload-cv-btn"
        >
          {uploading ? 'Uploading...' : 'Upload CV'}
        </button>
      )}
    </div>
  );
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [tempProfile, setTempProfile] = useState(null);
  const [uploadedCVs, setUploadedCVs] = useState([]);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    fetchProfile(currentUser.id);
    if (currentUser.role === 'candidate') {
      fetchUserCVs(currentUser.id);
    }
  }, [navigate]);

  const fetchUserCVs = async (userId) => {
    try {
      const response = await cvAPI.getUserCVs(userId);
      setUploadedCVs(response.cvs || []);
    } catch (error) {
      console.error('Failed to fetch CVs:', error);
    }
  };

  const handleDeleteCV = async (cvId) => {
    if (!window.confirm('Are you sure you want to delete this CV?')) {
      return;
    }

    try {
      await cvAPI.delete(cvId);
      setUploadedCVs(uploadedCVs.filter(cv => cv.id !== cvId));
      alert('CV deleted successfully!');
    } catch (error) {
      alert('Failed to delete CV: ' + error.message);
    }
  };

  const handleCVUploaded = (response) => {
    if (response.cv) {
      setUploadedCVs([response.cv, ...uploadedCVs]);
    }
  };

  const fetchProfile = async (userId) => {
    try {
      const profileResponse = await profileAPI.get(userId);
      let statsResponse = null;
      try {
        statsResponse = await profileAPI.getStatistics(userId);
      } catch (statsErr) {
        console.warn('Stats load failed:', statsErr);
      }

      const userData = profileResponse.user;
      
      // Format profile based on user role
      let formattedProfile;
      if (userData.role === 'candidate') {
        formattedProfile = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          location: userData.location || '',
          title: userData.candidate?.title || '',
          experience: userData.candidate?.experience_years ? `${userData.candidate.experience_years} years` : '',
          dateJoined: new Date(userData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          bio: userData.candidate?.bio || '',
          skills: userData.candidate?.skills?.map(s => s.name) || [],
          education: userData.candidate?.education || '',
          expectedSalary: userData.candidate?.expected_salary_min && userData.candidate?.expected_salary_max
            ? `${(userData.candidate.expected_salary_min/1000).toFixed(0)}k - ${(userData.candidate.expected_salary_max/1000).toFixed(0)}k`
            : '',
          availability: userData.candidate?.availability || 'available'
        };
      } else {
        // Company profile
        formattedProfile = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          location: userData.location || '',
          companyName: userData.company?.name || userData.name,
          industry: userData.company?.industry || '',
          size: userData.company?.size || '',
          foundedYear: userData.company?.founded_year || '',
          website: userData.company?.website || '',
          dateJoined: new Date(userData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          about: userData.company?.about || '',
          culture: userData.company?.culture || '',
          benefits: userData.company?.benefits || '',
          values: userData.company?.values || '',
          title: userData.company?.name || '',
          experience: userData.company?.founded_year ? `Since ${userData.company.founded_year}` : '',
          bio: userData.company?.about || '',
          skills: [],
          education: userData.company?.industry || '',
          expectedSalary: '',
          availability: ''
        };
      }

      setProfile(formattedProfile);
      setTempProfile(formattedProfile);
      setStats(statsResponse?.statistics || null);
      
      // Check if profile is incomplete
      if (userData.role === 'company') {
        const isIncomplete = !userData.company?.about || !userData.company?.industry || !userData.phone || !userData.location;
        if (isIncomplete) {
          setTimeout(() => {
            alert('Please complete your company profile to unlock all features!');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      alert('Failed to load profile: ' + (error?.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfile(profile);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      if (user.role === 'candidate') {
        // Parse salary range
        let salaryMin = null;
        let salaryMax = null;
        if (tempProfile.expectedSalary) {
          const salaryMatch = tempProfile.expectedSalary.match(/\$?(\d+)k?\s*-\s*\$?(\d+)k?/i);
          if (salaryMatch) {
            salaryMin = parseInt(salaryMatch[1]) * 1000;
            salaryMax = parseInt(salaryMatch[2]) * 1000;
          }
        }

        // Parse experience years
        let experienceYears = null;
        if (tempProfile.experience) {
          const expMatch = tempProfile.experience.match(/(\d+)/);
          if (expMatch) {
            experienceYears = parseInt(expMatch[1]);
          }
        }

        const updateData = {
          name: tempProfile.name,
          email: tempProfile.email,
          phone: tempProfile.phone,
          location: tempProfile.location,
          title: tempProfile.title,
          experience_years: experienceYears,
          bio: tempProfile.bio,
          education: tempProfile.education,
          expected_salary_min: salaryMin,
          expected_salary_max: salaryMax,
          availability: tempProfile.availability,
          skills: tempProfile.skills.map(skill => ({ name: skill, level: 'intermediate' }))
        };

        const response = await profileAPI.updateCandidate(user.id, updateData);
        saveUser(response.user);
        await fetchProfile(user.id);
      } else {
        // Company update
        const updateData = {
          name: tempProfile.name,
          email: tempProfile.email,
          phone: tempProfile.phone,
          location: tempProfile.location,
          company_name: tempProfile.companyName || tempProfile.name,
          industry: tempProfile.industry || '',
          size: tempProfile.size || '',
          founded_year: tempProfile.foundedYear ? parseInt(tempProfile.foundedYear) : null,
          website: tempProfile.website || '',
          about: tempProfile.bio || tempProfile.about || '',
          culture: tempProfile.culture || '',
          benefits: tempProfile.benefits || '',
          values: tempProfile.values || ''
        };

        const response = await profileAPI.updateCompany(user.id, updateData);
        saveUser(response.user);
        await fetchProfile(user.id);
      }
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile: ' + (error.message || 'Please try again'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="profile-page">
        <EmployeeNavbar />
        <div style={{ textAlign: 'center', padding: '100px', color: '#FFD700' }}>
          Loading profile...
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <EmployeeNavbar />
        <div style={{ textAlign: 'center', padding: '100px', color: '#ff4444' }}>
          Failed to load profile. Please refresh the page.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Background */}
      <div className="profile-bg">
        <div className="profile-orb-1" />
        <div className="profile-orb-2" />
        <div className="profile-orb-3" />
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

      <div className="profile-content">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-stats-section"
        >
          <div className="stat-card">
            <div className="stat-icon">
              <Award size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{stats?.points_earned || user?.points || 0}</div>
              <div className="stat-label">Total Points</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{stats?.cvs_analyzed || stats?.jobs_posted || 0}</div>
              <div className="stat-label">{user?.role === 'candidate' ? 'CVs Analyzed' : 'Jobs Posted'}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Briefcase size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{stats?.practice_sessions || stats?.active_jobs || 0}</div>
              <div className="stat-label">{user?.role === 'candidate' ? 'Practice Sessions' : 'Active Jobs'}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Mail size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{stats?.jobs_applied || stats?.total_applicants || 0}</div>
              <div className="stat-label">{user?.role === 'candidate' ? 'Jobs Applied' : 'Total Applicants'}</div>
            </div>
          </div>
        </motion.div>

        {/* Main Profile Section */}
        <div className="profile-main-grid">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="profile-card"
          >
            <div className="profile-card-header">
              <div className="profile-avatar">
                <User size={80} />
              </div>
              {!isEditing && (
                <button className="edit-btn" onClick={handleEdit}>
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="profile-form">
                <div className="form-group-profile">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>

                <div className="form-group-profile">
                  <label>Email</label>
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>

                <div className="form-group-profile">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>

                <div className="form-group-profile">
                  <label>Location</label>
                  <input
                    type="text"
                    value={tempProfile.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>

                <div className="form-group-profile">
                  <label>{user?.role === 'candidate' ? 'Job Title' : 'Company Name'}</label>
                  <input
                    type="text"
                    value={user?.role === 'candidate' ? tempProfile.title : tempProfile.companyName}
                    onChange={(e) => handleChange(user?.role === 'candidate' ? 'title' : 'companyName', e.target.value)}
                  />
                </div>

                <div className="form-group-profile">
                  <label>{user?.role === 'candidate' ? 'Experience' : 'Industry'}</label>
                  <input
                    type="text"
                    value={user?.role === 'candidate' ? tempProfile.experience : tempProfile.industry}
                    onChange={(e) => handleChange(user?.role === 'candidate' ? 'experience' : 'industry', e.target.value)}
                  />
                </div>

                {user?.role === 'company' && (
                  <>
                    <div className="form-group-profile">
                      <label>Company Size</label>
                      <select
                        value={tempProfile.size || ''}
                        onChange={(e) => handleChange('size', e.target.value)}
                      >
                        <option value="">Select size...</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="50-200">50-200 employees</option>
                        <option value="200-500">200-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>

                    <div className="form-group-profile">
                      <label>Website</label>
                      <input
                        type="url"
                        value={tempProfile.website || ''}
                        onChange={(e) => handleChange('website', e.target.value)}
                        placeholder="https://www.example.com"
                      />
                    </div>

                    <div className="form-group-profile">
                      <label>Founded Year</label>
                      <input
                        type="number"
                        value={tempProfile.foundedYear || ''}
                        onChange={(e) => handleChange('foundedYear', e.target.value)}
                        placeholder="2020"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </>
                )}

                <div className="profile-form-actions">
                  <button className="cancel-btn-profile" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </button>
                  <button className="save-btn-profile" onClick={handleSave} disabled={saving}>
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <h2 className="profile-name">{profile.name}</h2>
                <p className="profile-title">{profile.title}</p>

                <div className="profile-details">
                  <div className="detail-row">
                    <Mail size={18} />
                    <span>{profile.email}</span>
                  </div>
                  <div className="detail-row">
                    <Phone size={18} />
                    <span>{profile.phone || 'Not provided'}</span>
                  </div>
                  <div className="detail-row">
                    <MapPin size={18} />
                    <span>{profile.location || 'Not provided'}</span>
                  </div>
                  <div className="detail-row">
                    <Briefcase size={18} />
                    <span>{profile.experience || 'Not provided'}</span>
                  </div>
                  <div className="detail-row">
                    <Calendar size={18} />
                    <span>Joined {profile.dateJoined}</span>
                  </div>
                </div>

                {user?.role === 'candidate' && (
                  <div className="profile-status">
                    <div className="status-badge available">{profile.availability}</div>
                    {profile.expectedSalary && <div className="salary-badge">{profile.expectedSalary}</div>}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Right Column - Additional Info */}
          <div className="profile-right-column">
            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="profile-section-card"
            >
              <h3 className="section-title">{user?.role === 'candidate' ? 'About Me' : 'About Company'}</h3>
              {isEditing ? (
                <textarea
                  value={tempProfile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows="4"
                  className="bio-textarea"
                />
              ) : (
                <p className="bio-text">{profile.bio || 'No information provided yet.'}</p>
              )}
            </motion.div>

            {/* Skills Section - Only for candidates */}
            {user?.role === 'candidate' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="profile-section-card"
              >
                <h3 className="section-title">Skills</h3>
                {isEditing ? (
                  <SkillsEditor 
                    skills={tempProfile.skills || []}
                    onChange={(skills) => handleChange('skills', skills)}
                  />
                ) : (
                  <>
                    <div className="skills-grid-profile">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill, idx) => (
                          <div key={idx} className="skill-item-profile">
                            {skill}
                          </div>
                        ))
                      ) : (
                        <p className="bio-text">No skills added yet.</p>
                      )}
                    </div>
                    <button 
                      className="add-skill-btn-profile"
                      onClick={() => setIsEditing(true)}
                    >
                      + Add Skill
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {/* Education Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="profile-section-card"
            >
              <h3 className="section-title">{user?.role === 'candidate' ? 'Education' : 'Industry'}</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.education}
                  onChange={(e) => handleChange('education', e.target.value)}
                  className="education-input"
                />
              ) : (
                <p className="education-text">{profile.education || 'Not provided'}</p>
              )}
            </motion.div>

            {/* CV Upload Section - Only for candidates */}
            {user?.role === 'candidate' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="profile-section-card"
              >
                <h3 className="section-title">My CVs</h3>
                <p className="section-description">Upload your CV to appear in company suggestions and get AI analysis</p>
                
                {/* Uploaded CVs List */}
                {uploadedCVs && uploadedCVs.length > 0 && (
                  <div className="uploaded-cvs-list">
                    {uploadedCVs.map((cv) => (
                      <div key={cv.id} className="cv-item">
                        <div className="cv-item-icon">
                          <FileText size={24} />
                        </div>
                        <div className="cv-item-info">
                          <h4>{cv.file_name || 'CV File'}</h4>
                          <p className="cv-meta">
                            {cv.job_title || 'General'} • Score: {cv.overall_score || 0}% • {' '}
                            {cv.created_at ? new Date(cv.created_at).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                        <div className="cv-item-actions">
                          <button 
                            className="cv-view-btn"
                            onClick={() => navigate('/upload-cv')}
                            title="View Analysis"
                          >
                            View
                          </button>
                          <button 
                            className="cv-delete-btn"
                            onClick={() => handleDeleteCV(cv.id)}
                            title="Delete CV"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload New CV */}
                <CVUploadSection 
                  user={user} 
                  onCVUploaded={handleCVUploaded}
                />
              </motion.div>
            )}

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="profile-section-card"
            >
              <h3 className="section-title">Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">📄</div>
                  <div className="activity-content">
                    <p className="activity-title">{user?.role === 'candidate' ? 'CV Analyzed' : 'Job Posted'}</p>
                    <p className="activity-time">2 days ago</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💼</div>
                  <div className="activity-content">
                    <p className="activity-title">{user?.role === 'candidate' ? 'Applied to Frontend Developer' : 'New Applicant Received'}</p>
                    <p className="activity-time">5 days ago</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🎤</div>
                  <div className="activity-content">
                    <p className="activity-title">{user?.role === 'candidate' ? 'Completed AI Interview Practice' : 'Profile Updated'}</p>
                    <p className="activity-time">1 week ago</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
