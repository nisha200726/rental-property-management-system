import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

const Navbar = () => {
  const [user, setUser] = useState(getStoredUser());
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshUser = () => setUser(getStoredUser());
    window.addEventListener('storage', refreshUser);
    refreshUser();
    return () => window.removeEventListener('storage', refreshUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setMobileOpen(false);
    navigate('/login');
  };

  const handleNavClick = () => setMobileOpen(false);

  const ownerLinks = [
    { to: '/owner/dashboard', label: 'Dashboard' },
    { to: '/owner/properties', label: 'My Properties' },
    { to: '/owner/rentals', label: 'Rentals' },
    { to: '/owner/profile', label: 'Profile' },
  ];

  const customerLinks = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
    { to: '/customer/rentals', label: 'My Rentals' },
    { to: '/customer/favorites', label: 'Favorites' },
    { to: '/customer/profile', label: 'Profile' },
  ];

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/#how-it-works', label: 'How It Works' },
    { to: '/#about', label: 'About' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ];

  const navigationLinks = user
    ? user.role === 'owner'
      ? ownerLinks
      : customerLinks
    : publicLinks;

  return (
    <header className="site-header">
      <nav className="navbar container">
        <NavLink to="/" className="brand" onClick={handleNavClick}>
          RentalHub
        </NavLink>

        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileOpen((previous) => !previous)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <div className={`nav-menu ${mobileOpen ? 'open' : ''}`}>
          {navigationLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={handleNavClick}
            >
              {item.label}
            </NavLink>
          ))}

          {user && (
            <button type="button" className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
