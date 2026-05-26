import React from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import './AboutHome.css';

const AboutHome = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bg1Y = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const bg2Y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
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

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "backOut"
      }
    }
  };

  const features = [
    {
      icon: '🧠',
      title: 'Artificial Intelligence',
      description: 'Advanced AI algorithms analyze skills and match candidates with opportunities'
    },
    {
      icon: '🔍',
      title: 'Smart Matching',
      description: 'Intelligent matching system that goes beyond keywords to find perfect fits'
    },
    {
      icon: '📊',
      title: 'Explainable Insights',
      description: 'Clear, transparent insights that show why a candidate is the right choice'
    }
  ];

  return (
    <section id="about" className="about-home" ref={ref}>
      <div className="container">
        <motion.div
          className="about-home-content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Title */}
          <motion.div className="about-home-header" variants={itemVariants}>
            <h2 className="about-home-title">
              <span className="gradient-text">About InsightCV</span>
            </h2>
            <div className="title-underline"></div>
          </motion.div>

          {/* Main Description */}
          <motion.p className="about-home-description" variants={itemVariants}>
            InsightCV bridges the gap between companies and candidates by analyzing skills,
            matching opportunities, and offering data-driven insights that make hiring decisions
            smarter and more transparent.
          </motion.p>

          {/* Features Grid */}
          <motion.div className="about-home-features" variants={itemVariants}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="about-home-feature"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(255, 215, 0, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="feature-icon"
                  variants={iconVariants}
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.6 }
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>

                {/* Animated background glow */}
                <motion.div
                  className="feature-glow"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div className="about-home-stats" variants={itemVariants}>
            <div className="stats-grid">
              <motion.div
                className="stat-item"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="stat-number"
                  animate={isInView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                  transition={{ delay: 1, duration: 0.8, ease: "backOut" }}
                >
                  2
                </motion.div>
                <div className="stat-label">Active Users</div>
              </motion.div>

              <motion.div
                className="stat-item"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="stat-number"
                  animate={isInView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                  transition={{ delay: 1.2, duration: 0.8, ease: "backOut" }}
                >
                  1
                </motion.div>
                <div className="stat-label">Companies</div>
              </motion.div>

              <motion.div
                className="stat-item"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="stat-number"
                  animate={isInView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                  transition={{ delay: 1.4, duration: 0.8, ease: "backOut" }}
                >
                  95%
                </motion.div>
                <div className="stat-label">Match Accuracy</div>
              </motion.div>

              <motion.div
                className="stat-item"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="stat-number"
                  animate={isInView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                  transition={{ delay: 1.6, duration: 0.8, ease: "backOut" }}
                >
                  24/7
                </motion.div>
                <div className="stat-label">AI Analysis</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="about-home-background">
        <motion.div className="bg-element bg-element-1" style={{ y: bg1Y }} />
        <motion.div className="bg-element bg-element-2" style={{ y: bg2Y }} />
      </div>
    </section>
  );
};

export default AboutHome;
