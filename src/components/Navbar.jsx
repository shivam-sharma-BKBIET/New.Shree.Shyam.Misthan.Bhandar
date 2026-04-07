import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchOverlay from './SearchOverlay';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        
        <Link to="/" className="modern-brand">
          <div className="brand-glow"></div>
          <img src="/logoo.png" alt="Logo" className="brand-logo-img" />
          <span className="brand-text-truncate">New Shree Shyam Misthan Bhandar</span>
        </Link>
        
        <nav className={`modern-nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Menu</Link>
          <Link to="/track-order" className={location.pathname === '/track-order' ? 'active' : ''} style={{color: '#e65100', fontWeight: 'bold'}}>Track Order</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
        </nav>

        <div className="modern-nav-actions">
          <button className="navbar-search" onClick={() => setIsSearchOpen(true)} aria-label="Open search">
            <Search size={18} className="navbar-search-icon" strokeWidth={2.5} />
            <span className="navbar-search-placeholder">Search...</span>
          </button>
          
          <div className="nav-auth-wrapper">
            {isAuthenticated ? (
              <div className="nav-user-dropdown">
                <div className="nav-user-info">
                  <span className="nav-user-name">Hi, {user.name.split(' ')[0]}</span>
                  <button className="modern-icon-btn profile-btn" title="Logout" onClick={handleLogout}>
                    <LogOut size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="modern-icon-btn auth-btn" title="Sign In">
                <User size={22} strokeWidth={2.5} />
              </Link>
            )}
          </div>

          <button className="modern-icon-btn cart-btn" onClick={toggleCart} aria-label="Cart">
            <ShoppingBag size={22} strokeWidth={2.5} />
            {cartCount > 0 && <span className="modern-cart-badge">{cartCount}</span>}
          </button>
          
          <button className="modern-icon-btn mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
            {isMobileMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
          </button>
        </div>

      </div>
      
      {/* Global Search Overlay Modal */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Navbar;
