import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, User, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ContactPage.css';

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    }, 1500);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="contact-page">
      {/* Background Effects */}
      <div className="contact-bg">
        <div className="contact-orb-1" />
        <div className="contact-orb-2" />
        <div className="contact-orb-3" />
      </div>

      {/* Particles */}
      <div className="contact-particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="contact-particle"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.6, 0.2],
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

      <Navbar isDarkMode={true} setIsDarkMode={() => {}} />

      <div className="contact-content">
        <motion.div
          className="contact-container"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div variants={item} className="contact-header">
            <h1 className="contact-title">Get In Touch</h1>
            <p className="contact-subtitle">
              We'd love to hear from you! Fill out the form below and we'll get back to you shortly.
            </p>
          </motion.div>

          <div className="contact-grid">
            {/* Contact Info Cards */}
            <motion.div variants={item} className="contact-info-section">
              <div className="info-card">
                <div className="info-icon">
                  <Mail size={28} />
                </div>
                <h3>Email Us</h3>
                <p>contact@insightcv.com</p>
                <p>support@insightcv.com</p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <Phone size={28} />
                </div>
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567</p>
                <p>Mon-Fri: 9AM - 6PM EST</p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <MapPin size={28} />
                </div>
                <h3>Visit Us</h3>
                <p>123 Innovation Street</p>
                <p>New York, NY 10001</p>
              </div>

              {/* Social Links */}
              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-links-contact">
                  <a href="#" className="social-link-contact">
                    <span>💼</span>
                  </a>
                  <a href="#" className="social-link-contact">
                    <span>🐦</span>
                  </a>
                  <a href="#" className="social-link-contact">
                    <span>📘</span>
                  </a>
                  <a href="#" className="social-link-contact">
                    <span>📸</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={item} className="contact-form-section">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group-contact">
                    <label htmlFor="name">
                      <User size={18} />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group-contact">
                    <label htmlFor="email">
                      <Mail size={18} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="form-group-contact">
                    <label htmlFor="subject">
                      <MessageSquare size={18} />
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <div className="form-group-contact">
                    <label htmlFor="message">
                      <MessageSquare size={18} />
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows="6"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn-contact"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner-contact"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  className="success-message"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="success-icon">
                    <CheckCircle size={64} />
                  </div>
                  <h2>Message Sent Successfully!</h2>
                  <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div variants={item} className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>How quickly will I get a response?</h4>
                <p>We typically respond within 24 hours during business days.</p>
              </div>
              <div className="faq-item">
                <h4>Do you offer customer support?</h4>
                <p>Yes! Our support team is available Mon-Fri, 9AM-6PM EST.</p>
              </div>
              <div className="faq-item">
                <h4>Can I schedule a demo?</h4>
                <p>Absolutely! Mention it in your message and we'll arrange a time.</p>
              </div>
              <div className="faq-item">
                <h4>Is there a phone support?</h4>
                <p>Yes, you can call us at +1 (555) 123-4567 during business hours.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
