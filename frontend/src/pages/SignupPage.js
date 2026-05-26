import React from 'react';
import SignupForm from '../components/SignupForm';
import Navbar from '../components/Navbar';

import './Login.css';

const SignupPage = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  return (
    <div className="login-page">
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <div className="login-page-grid">
        <div className="login-image-container">
          <img src="/mem.png" alt="decorative" />
        </div>
        <div className="login-form-container">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
