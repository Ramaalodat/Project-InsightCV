import React from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import './Features.css';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const orb1X = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const orb2X = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      y: 100, 
      opacity: 0,
      scale: 0.8
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Matching',
      description: 'Matches candidates and jobs using deep learning algorithms that understand context, skills, and cultural fit.',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      delay: 0
    },
    {
      icon: '📊',
      title: 'Explainable Insights',
      description: 'Shows why a candidate fits — transparency and trust through clear, data-driven explanations.',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      delay: 0.1
    },
    {
      icon: '🏢',
      title: 'For Companies',
      description: 'Manage applications and find the right talent easily with intelligent filtering and recommendations.',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      delay: 0.2
    },
    {
      icon: '👤',
      title: 'For Candidates',
      description: 'Get personalized feedback and smart CV analysis to improve your profile and increase match chances.',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      delay: 0.3
    }
  ];

  return (
    <section id="features" className="features" ref={ref}>
      <div className="container">
        <motion.div
          className="features-content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div className="features-header" variants={cardVariants}>
            <h2 className="features-title">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="features-subtitle">
              Everything you need to revolutionize your hiring process
            </p>
            <div className="title-underline"></div>
          </motion.div>

          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-wrapper">
                <motion.div
                  className="feature-card"
                  variants={cardVariants}
                  whileHover={{ 
                    y: -20,
                    scale: 1.05,
                    boxShadow: "0 30px 60px rgba(255, 215, 0, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Card Background Gradient */}
                  <div 
                    className="card-gradient"
                    style={{ background: feature.gradient }}
                  />
                  
                  {/* Card Content */}
                  <div className="card-content">
                    <motion.div
                      className="feature-icon"
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      animate={isInView ? {
                        y: [0, -5, 0],
                        transition: {
                          delay: feature.delay + 0.5,
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      } : {}}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>

                  {/* Floating Particles */}
                  <div className="card-particles">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="particle"
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.5
                        }}
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + i * 10}%`,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
                
                {/* Connecting Line */}
                {index < features.length - 1 && (
                  <div className="connecting-line"></div>
                )}
              </div>
            ))}
          </div>

        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="features-background">
        <motion.div className="bg-orb orb-1" style={{ x: orb1X, y: orb1Y }} />
        <motion.div className="bg-orb orb-2" style={{ x: orb2X, y: orb2Y }} />
      </div>
    </section>
  );
};

export default Features;
