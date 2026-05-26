import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Linkedin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AboutPage.css';

export default function AboutPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const teamMembers = [
    {
      name: 'Rama Alodat',
      linkedin: 'https://www.linkedin.com/in/rama-alodat-686aa932a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      name: 'Doha Eleyyan',
      linkedin: 'https://www.linkedin.com/in/doha-eleyyan-326096284?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      name: 'Mohammed Al-Ahmad',
      linkedin: 'https://www.linkedin.com/in/mo7ammed-al-a7med?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      name: 'Raghad Fwa\'reh',
      linkedin: 'https://www.linkedin.com/in/raghad-fwareh-02955838b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  return (
    <div className="about-page">
      {/* Background Effects */}
      <div className="about-page-bg">
        <div className="about-page-orb-1" />
        <div className="about-page-orb-2" />
        <div className="about-page-orb-3" />
      </div>

      {/* Particles */}
      <div className="about-page-particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="about-page-particle"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.6, 0.2],
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

      <div className="about-page-content" ref={ref}>
        <motion.div
          className="about-page-container"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Team Section */}
          <motion.div className="team-section-page" variants={itemVariants}>
            <h1 className="team-title-page gradient-text">Meet Our Team</h1>
            <p className="team-subtitle-page">Passionate minds behind InsightCV</p>
            
            <div className="team-grid-page">
              {teamMembers.map((member, index) => (
                <motion.a
                  key={index}
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-card-page"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -15,
                    scale: 1.05,
                    boxShadow: "0 20px 60px rgba(255, 215, 0, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-gradient-page" style={{ background: member.gradient }} />
                  <div className="card-content-page">
                    <div className="avatar-circle-page" style={{ background: member.gradient }}>
                      <span className="avatar-initial-page">{member.name.charAt(0)}</span>
                    </div>
                    <h3 className="member-name-page">{member.name}</h3>
                    <div className="linkedin-badge-page">
                      <Linkedin size={18} />
                      <span>Connect on LinkedIn</span>
                    </div>
                  </div>
                  <div className="card-shine-page" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* About Us Section */}
          <motion.div className="about-us-section-page" variants={itemVariants}>
            <div className="about-us-content-page">
              <div className="about-us-text-page">
                <h2 className="section-title-page gradient-text">About Us</h2>
                <div className="text-content-page">
                  <p>
                    We are four students from the <strong>College of Artificial Intelligence and Data Science at Al al-Bayt University</strong>, united by one shared vision: to make the job market smarter and more human.
                  </p>
                  <p>
                    We built <strong>InsightCV</strong>, a platform that connects companies and talents through the power of artificial intelligence.
                  </p>
                  <p>
                    Our goal is to help employees discover their strengths, improve their CVs, and find the right opportunities while helping companies find the perfect match effortlessly.
                  </p>
                  <p className="highlight-text-page">
                    We believe that technology can understand people, not just data.
                  </p>
                  <p>
                    Every line of code we write is driven by our passion to make career connections fairer, faster, and more insightful.
                  </p>
                </div>
              </div>
              <motion.div 
                className="about-us-image-page"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                <img src="/po.jpg" alt="Al al-Bayt University" />
                <div className="image-glow-page" />
              </motion.div>
            </div>
          </motion.div>

          {/* Mission & Vision */}
          <motion.div className="mission-vision-section" variants={itemVariants}>
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To revolutionize the hiring process by leveraging AI to create meaningful connections between talent and opportunity.</p>
            </div>
            <div className="vision-card">
              <div className="vision-icon">🚀</div>
              <h3>Our Vision</h3>
              <p>A world where every professional finds their perfect role and every company discovers their ideal team member.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
