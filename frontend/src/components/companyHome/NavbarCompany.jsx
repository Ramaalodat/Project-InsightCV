import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from '../NotificationBell';
import './NavbarCompany.css';

export default function NavbarCompany() {
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = (to) => {
    const baseClass = 'navbar-link';
    return location.pathname.includes(to) ? `${baseClass} active` : baseClass;
  };

  return (
    <header className={`navbar-company ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <div className="navbar-logo">
          <span>InsightCV</span>
          <span style={{ margin: '0 0.5rem' }}>–</span>
          <span className="gradient-text">Company Dashboard</span>
        </div>
        <nav className="navbar-nav">
          <Link to="/company-home" className={linkClass('/company-home')}>Home</Link>
          <Link to="/company-home/my-company" className={linkClass('/company-home/my-company')}>My Company</Link>
          <Link to="/company-home/my-jobs" className={linkClass('/company-home/my-jobs')}>My Jobs</Link>
          <Link to="/company-home/rate-us" className={linkClass('/company-home/rate-us')}>Rate Us</Link>
          <NotificationBell />
          <button className="logout-btn-navbar" onClick={() => navigate('/')}>
            Log Out
          </button>
        </nav>
      </div>
    </header>
  );
}
