import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Cookie, UserCheck, FileText, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PrivacyPolicyPage.css';

export default function PrivacyPolicyPage() {
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

  const sections = [
    {
      icon: <Eye size={32} />,
      title: '1. Information We Collect',
      content: [
        {
          subtitle: 'Account Information:',
          text: 'such as your name, email, and password when you create an account.'
        },
        {
          subtitle: 'Profile Information:',
          text: 'including your CV, job title, skills, and any other details you choose to share.'
        },
        {
          subtitle: 'Usage Data:',
          text: 'data about how you use our platform, such as pages visited, clicks, and interaction times.'
        },
        {
          subtitle: 'Company Data:',
          text: 'for companies, we may collect basic company details, job postings, and contact information.'
        }
      ]
    },
    {
      icon: <FileText size={32} />,
      title: '2. How We Use Your Information',
      content: [
        {
          text: 'Help match candidates with suitable job opportunities.'
        },
        {
          text: 'Provide personalized AI-based recommendations and insights.'
        },
        {
          text: 'Improve the quality and functionality of our platform.'
        },
        {
          text: 'Communicate with you regarding updates, notifications, or support.'
        }
      ],
      note: 'We do not sell, rent, or trade your personal data with any third party.'
    },
    {
      icon: <Lock size={32} />,
      title: '3. Data Security',
      content: [
        {
          text: 'We take reasonable technical and organizational measures to protect your information from unauthorized access, loss, or misuse. However, no method of transmission over the internet is 100% secure, so we cannot guarantee absolute security.'
        }
      ]
    },
    {
      icon: <Cookie size={32} />,
      title: '4. Cookies',
      content: [
        {
          text: 'Our website may use cookies to improve your browsing experience. You can choose to disable cookies in your browser settings, but some features may not function properly.'
        }
      ]
    },
    {
      icon: <UserCheck size={32} />,
      title: '5. Your Rights',
      content: [
        {
          text: 'Access, update, or delete your personal data.'
        },
        {
          text: 'Request information about how your data is being used.'
        },
        {
          text: 'Withdraw your consent for data processing at any time.'
        }
      ],
      contactInfo: 'For any privacy-related requests, you can contact us at: support@insightcv.ai'
    },
    {
      icon: <FileText size={32} />,
      title: '6. Changes to This Policy',
      content: [
        {
          text: 'We may update this Privacy Policy occasionally to reflect changes in our practices. Any updates will be posted on this page with a new "Last Updated" date.'
        }
      ]
    },
    {
      icon: <Mail size={32} />,
      title: '7. Contact Us',
      content: [
        {
          text: 'If you have any questions about this Privacy Policy or how we handle your data, please contact us at:'
        }
      ],
      contactInfo: 'support@insightcv.ai'
    }
  ];

  return (
    <div className="privacy-policy-page">
      {/* Background Effects */}
      <div className="privacy-bg">
        <div className="privacy-orb-1" />
        <div className="privacy-orb-2" />
        <div className="privacy-orb-3" />
      </div>

      {/* Particles */}
      <div className="privacy-particles">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="privacy-particle"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
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

      <div className="privacy-content">
        <motion.div
          className="privacy-container"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div variants={item} className="privacy-header">
            <div className="shield-icon">
              <Shield size={64} />
            </div>
            <h1 className="privacy-title">Privacy Policy</h1>
            <p className="privacy-date">Last updated: October 2025</p>
            <p className="privacy-intro">
              Welcome to <strong>InsightCV</strong> — a platform developed by students from Al al-Bayt University to connect companies and job seekers through AI-powered insights.
              Your privacy is very important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="privacy-sections">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                variants={item}
                className="privacy-section"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="section-icon">{section.icon}</div>
                <h2 className="section-title">{section.title}</h2>
                
                <div className="section-content">
                  {section.content.map((item, idx) => (
                    <div key={idx} className="content-item">
                      {item.subtitle && (
                        <strong className="content-subtitle">{item.subtitle}</strong>
                      )}
                      <p className="content-text">{item.text}</p>
                    </div>
                  ))}
                  
                  {section.note && (
                    <div className="section-note">
                      <span className="note-icon">ℹ️</span>
                      <p>{section.note}</p>
                    </div>
                  )}
                  
                  {section.contactInfo && (
                    <div className="contact-info">
                      <Mail size={20} />
                      <a href={`mailto:${section.contactInfo}`}>{section.contactInfo}</a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer CTA */}
          <motion.div variants={item} className="privacy-footer-cta">
            <div className="cta-content">
              <h3>Questions about our Privacy Policy?</h3>
              <p>We're here to help. Feel free to reach out to us anytime.</p>
              <a href="/contact" className="cta-button">
                <Mail size={20} />
                Contact Us
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
