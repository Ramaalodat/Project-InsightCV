import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ratingAPI } from '../services/api';
import { getUser } from '../utils/auth';
import EmployeeNavbar from '../components/EmployeeNavbar';
import NavbarCompany from '../components/companyHome/NavbarCompany';
import Footer from '../components/Footer';
import './RatingPage.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function RatingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isEmployee = location.pathname.includes('employee-home');
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating before submitting.');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a comment about your experience.');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await ratingAPI.create({
        user_id: user.id,
        rating: rating,
        comment: comment.trim()
      });
      
      setSubmitted(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate(isEmployee ? '/employee-home' : '/company-home');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit rating. Please try again.');
      setIsSubmitting(false);
    }
  };

  const StarRating = () => {
    return (
      <div className="star-rating-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            className={`star-button ${star <= (hoverRating || rating) ? 'active' : ''}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Star
              size={48}
              fill={star <= (hoverRating || rating) ? '#ffc107' : 'none'}
              stroke={star <= (hoverRating || rating) ? '#ffc107' : '#666'}
              strokeWidth={2}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="rating-page">
      {/* Background effects */}
      <div className="rating-bg">
        <div className="rating-orb-1" />
        <div className="rating-orb-2" />
        <div className="rating-orb-3" />
      </div>

      {/* Particles */}
      <div className="particles-container">
        {[...Array(25)].map((_, i) => (
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

      {isEmployee ? <EmployeeNavbar /> : <NavbarCompany />}

      <motion.section 
        className="rating-content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="rating-container">
          <motion.div variants={fadeUp} className="rating-header">
            <h1 className="rating-title">
              Rate Your <span className="highlight-text">Experience</span> ⭐
            </h1>
            <p className="rating-subtitle">
              Your feedback helps us improve InsightCV for everyone
            </p>
          </motion.div>

          {!submitted ? (
            <motion.div variants={fadeUp} className="rating-card">
              <form onSubmit={handleSubmit} className="rating-form">
                {error && (
                  <div style={{ 
                    color: '#ff4444', 
                    marginBottom: '20px', 
                    padding: '12px', 
                    background: 'rgba(255,68,68,0.1)', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    {error}
                  </div>
                )}
                
                <div className="rating-section">
                  <h3 className="section-title">How would you rate us?</h3>
                  <StarRating />
                  {rating > 0 && (
                    <motion.p 
                      className="rating-label"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {ratingLabels[rating]}
                    </motion.p>
                  )}
                </div>

                <div className="comment-section">
                  <h3 className="section-title">Tell us more</h3>
                  <textarea
                    className="comment-textarea"
                    placeholder="Share your thoughts, suggestions, or feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                    rows={6}
                  />
                  <div className="character-count">
                    {comment.length}/500 characters
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting || rating === 0}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255, 87, 34, 0.6)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="spinner"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Submit Rating
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              className="success-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle size={80} className="success-icon" />
              </motion.div>
              <h2 className="success-title">Thank You! 🎉</h2>
              <p className="success-message">
                Your feedback has been submitted successfully!<br/>
                Your review is now live on our homepage.<br/>
                Redirecting you back...
              </p>
            </motion.div>
          )}

        </div>
      </motion.section>

      <Footer />
    </div>
  );
}