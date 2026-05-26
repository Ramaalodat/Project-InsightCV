import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  // hide certain navbar actions on auth pages (login/signup)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <motion.nav
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <motion.div
          className="navbar-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="logo-text gradient-text">InsightCV</span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navItems.map((item, index) => (
            item.href && item.href.startsWith('/') ? (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ 
                  scale: 1.1,
                  textShadow: "0 0 10px rgba(255, 87, 34, 0.5)"
                }}
              >
                <Link to={item.href} className="navbar-link">{item.name}</Link>
              </motion.div>
            ) : (
              <motion.a
                key={item.name}
                href={item.href}
                className="navbar-link"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ 
                  scale: 1.1,
                  textShadow: "0 0 10px rgba(255, 87, 34, 0.5)"
                }}
              >
                {item.name}
              </motion.a>
            )
          ))}
        </div>

        {/* Right side buttons */}
        <div className="navbar-actions">
          {/* Get Started Button (hidden on /login) */}
          {!isAuthPage && (
            <motion.button
              className="get-started-btn"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255, 87, 34, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
            >
              Get Started
            </motion.button>
          )}

          {/* Mobile menu button */}
          <motion.button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span></span>
            <span></span>
            <span></span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {navItems.map((item, index) => (
          item.href && item.href.startsWith('/') ? (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isMobileMenuOpen ? 1 : 0,
                x: isMobileMenuOpen ? 0 : -20
              }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link to={item.href} className="mobile-menu-link">{item.name}</Link>
            </motion.div>
          ) : (
            <motion.a
              key={item.name}
              href={item.href}
              className="mobile-menu-link"
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isMobileMenuOpen ? 1 : 0,
                x: isMobileMenuOpen ? 0 : -20
              }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </motion.a>
          )
        ))}
        {!isAuthPage && (
          <motion.button
            className="mobile-get-started-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isMobileMenuOpen ? 1 : 0,
              y: isMobileMenuOpen ? 0 : 20
            }}
            transition={{ delay: 0.3 }}
            onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
          >
            Get Started
          </motion.button>
        )}
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
