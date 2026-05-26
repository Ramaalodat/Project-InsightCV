import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';
import './EmployeeNavbar.css';

export default function EmployeeNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className="employee-navbar">
      <div className="employee-navbar-content">
        <div className="employee-logo" onClick={() => navigate('/employee-home')}>
          InsightCV
        </div>
        <div className="employee-nav-links">
          <a 
            href="/employee-home" 
            className={isActive('/employee-home') && location.pathname === '/employee-home' ? 'active' : ''}
          >
            Home
          </a>
          <a 
            href="/employee-home/profile" 
            className={isActive('/employee-home/profile') ? 'active' : ''}
          >
            Profile
          </a>
          <a 
            href="/employee-home/jobs" 
            className={isActive('/employee-home/jobs') ? 'active' : ''}
          >
            Job Listings
          </a>
          <a 
            href="/employee-home/ai-practice" 
            className={isActive('/employee-home/ai-practice') || isActive('/employee-home/ai-interview') ? 'active' : ''}
          >
            AI Practice
          </a>
          <a 
            href="/employee-home/rate-us" 
            className={isActive('/employee-home/rate-us') ? 'active' : ''}
          >
            Rate Us
          </a>
          <NotificationBell />
          <button className="logout-btn" onClick={() => navigate('/')}>
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}
