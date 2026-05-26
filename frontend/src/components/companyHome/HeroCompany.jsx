import React from 'react';
import { motion } from 'framer-motion';
import './HeroCompany.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function HeroCompany() {
  return (
    <section className="hero-company">
      <div className="hero-content">
        <div className="hero-grid">
          {/* Left */}
          <motion.div variants={container} initial="hidden" animate="show" className="hero-text">
            <motion.h1 variants={fadeUp} className="hero-title">
              Welcome to Your Company Space – Where Opportunities Begin.
            </motion.h1>
            <motion.p variants={fadeUp} className="hero-description">
              Manage your job posts, discover top talent, and update your company info — all in one place.
            </motion.p>
            <motion.div variants={fadeUp} className="hero-buttons">
              <a href="/company-home/post-job" className="btn-primary">
                Post a Job
              </a>
              <a href="/company-home/suggested" className="btn-secondary">
                Suggested Employees
              </a>
            </motion.div>
          </motion.div>

          {/* Right image */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="hero-image">
            <div className="hero-image-bg" />
            <img src="/ro.png" alt="Company" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
