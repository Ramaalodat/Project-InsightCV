import React from 'react';
import LoginForm from '../components/LoginForm';
import Navbar from '../components/Navbar';

import './Login.css';

const LoginPage = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  return (
    <div className="login-page">
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <div className="login-page-grid">
        <div className="login-image-container">
          <img src="/mem.png" alt="decorative" />
        </div>
        <div className="login-form-container">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
