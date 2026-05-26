import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <footer className="modern-footer" ref={ref}>
      <div className="modern-footer-inner container">
        <motion.div
          className="modern-footer-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* 1. Logo & Description */}
          <div className="footer-col footer-brand">
            <h3 className="brand-logo">InsightCV</h3>
            <p className="brand-desc">Empowering talent and companies through AI-driven insights.</p>
          </div>

          {/* 2. Quick Links */}
          <div className="footer-col">
            <h4 className="col-title">Quick Links</h4>
            <ul className="col-list">
              <li><a href="/" className="col-link">Home</a></li>
              <li><a href="/about" className="col-link">About</a></li>
              <li><a href="/contact" className="col-link">Contact</a></li>
              <li><a href="/privacy-policy" className="col-link">Privacy Policy</a></li>
            </ul>
          </div>

          {/* 3. Contact */}
          <div className="footer-col">
            <h4 className="col-title">Contact</h4>
            <ul className="contact-list">
              <li><span className="contact-emoji">📧</span><a className="contact-link" href="mailto:support@insightcv.ai">support@insightcv.ai</a></li>
              <li><span className="contact-emoji">📍</span><span>Amman, Jordan</span></li>
            </ul>
          </div>
        </motion.div>

        <div className="footer-bottom">
          <div className="glow-line" />
          <p className="copyright">© {currentYear} InsightCV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
