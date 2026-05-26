import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutHome from './components/AboutHome';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css';
import CompanyHomePage from './pages/CompanyHomePage';
import EmployeeHomePage from './pages/EmployeeHomePage';
import UploadCVPage from './pages/UploadCVPage';
import AIInterviewPage from './pages/AIInterviewPage';
import PostJobPage from './pages/PostJobPage';
import JobListingsPage from './pages/JobListingsPage';
import SuggestedEmployeesPage from './pages/SuggestedEmployeesPage';
import ProfilePage from './pages/ProfilePage';
import MyJobsPage from './pages/MyJobsPage';
import MyCompanyPage from './pages/MyCompanyPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AboutPage from './pages/AboutPage';
import RatingPage from './pages/RatingPage';
import JobApplicantsPage from './pages/JobApplicantsPage';

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.8 });
  const glowY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.8 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 50);
      mouseY.set(e.clientY - 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
        <Routes>
                    <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

                                                  <Route path="/company-home" element={<CompanyHomePage />} />
          <Route path="/company-home/post-job" element={<PostJobPage />} />
          <Route path="/company-home/suggested" element={<SuggestedEmployeesPage />} />
          <Route path="/company-home/my-jobs" element={<MyJobsPage />} />
          <Route path="/company-home/job-applicants/:jobId" element={<JobApplicantsPage />} />
          <Route path="/company-home/my-company" element={<MyCompanyPage />} />
          <Route path="/company-home/rate-us" element={<RatingPage />} />
          
          <Route path="/employee-home" element={<EmployeeHomePage />} />
          <Route path="/employee-home/upload-cv" element={<UploadCVPage />} />
          <Route path="/employee-home/ai-interview" element={<AIInterviewPage />} />
          <Route path="/employee-home/jobs" element={<JobListingsPage />} />
          <Route path="/employee-home/profile" element={<ProfilePage />} />
          <Route path="/employee-home/ai-practice" element={<AIInterviewPage />} />
          <Route path="/employee-home/rate-us" element={<RatingPage />} />

          <Route path="/" element={
            <>
              {/* Background particles */}
              <div className="particles-container">
                {[...Array(30)].map((_, i) => (
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

              {/* Parallax cursor effect */}
              <motion.div
                className="cursor-glow"
                style={{ x: glowX, y: glowY }}
              />

              <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
              <Hero />
              <AboutHome />
              <Features />
              <Testimonials />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;