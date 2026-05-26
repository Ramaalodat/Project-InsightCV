import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.9 });
  const parallaxY = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.9 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      // small parallax factor directly in handler to avoid extra renders
      mouseX.set(e.clientX * 0.02);
      mouseY.set(e.clientY * 0.02);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  return (
    <section id="home" className="hero">
      {/* Background with exact colors from image */}
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="hero-particle"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                duration: Math.random() * 8 + 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Parallax effect based on mouse position */}
      <motion.div
        className="hero-parallax"
        style={{ x: parallaxX, y: parallaxY }}
      />

      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Headline */}
          <motion.h1 className="hero-headline" variants={itemVariants}>
            <span className="hero-text-white">Connecting Talent with Opportunity  </span>
            <span className="hero-text-orange">Smarter.</span>
          </motion.h1>

          {/* Description */}
          <motion.p className="hero-description" variants={itemVariants}>
            InsightCV helps employees showcase their true skills and allows companies to discover the perfect match through AI-driven analysis.
          </motion.p>

          {/* Action Buttons */}
          <motion.div className="hero-buttons" variants={itemVariants}>
            <motion.button
              className="hero-btn-primary"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 40px rgba(255, 215, 0, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
            >
              <span>Get Started</span>
              <motion.div
                className="btn-glow"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>

          </motion.div>

          {/* Floating Elements */}
          <div className="hero-floating-elements">
            <motion.div
              className="floating-element element-1"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🧠
            </motion.div>
            <motion.div
              className="floating-element element-2"
              animate={{
                y: [0, 15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              🔍
            </motion.div>
            <motion.div
              className="floating-element element-3"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 3, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              📊
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Wave animation at bottom */}
      <div className="hero-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <motion.path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="rgba(15, 15, 26, 0.8)"
            animate={{
              d: [
                "M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z",
                "M0,60 C300,80 900,40 1200,60 L1200,120 L0,120 Z",
                "M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
