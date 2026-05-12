import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, LogOut, Heart, Sun, Moon, Home, Utensils, Truck, Info, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import SearchOverlay from './SearchOverlay';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, toggleCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
      if (!event.target.closest('.hamburger-dropdown-menu') && !event.target.closest('.mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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
        
        <nav className="modern-nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <Home size={18} className="nav-link-icon" />
            <span>Home</span>
          </Link>
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>
            <Utensils size={18} className="nav-link-icon" />
            <span>Menu</span>
          </Link>
          <Link to="/track-order" className={location.pathname === '/track-order' ? 'active' : ''}>
            <Truck size={18} className="nav-link-icon" />
            <span>Track Order</span>
          </Link>
        </nav>

        <div className="modern-nav-actions">
          <button className="navbar-search" onClick={() => setIsSearchOpen(true)} aria-label="Open search">
            <Search size={16} className="navbar-search-icon" strokeWidth={2.5} />
            <span className="navbar-search-placeholder">Search...</span>
          </button>

          <Link to="/wishlist" className="modern-icon-btn wishlist-btn" aria-label="Wishlist" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Heart size={18} strokeWidth={2.5} />
            {wishlistCount > 0 && <span className="modern-cart-badge">{wishlistCount}</span>}
          </Link>

          <button className="modern-icon-btn cart-btn" onClick={toggleCart} aria-label="Cart">
            <ShoppingBag size={18} strokeWidth={2.5} />
            {cartCount > 0 && <span className="modern-cart-badge">{cartCount}</span>}
          </button>
          
          <button onClick={toggleTheme} className="modern-icon-btn desktop-theme-toggle" aria-label="Toggle theme" title={theme === 'light' ? "Dark Mode" : "Light Mode"}>
            {theme === 'light' ? <Moon size={18} strokeWidth={2.5} /> : <Sun size={18} strokeWidth={2.5} />}
          </button>
          
          <button className="modern-icon-btn mobile-menu-btn" onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(!isMobileMenuOpen); }} aria-label="Menu">
            {isMobileMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
          </button>
          
          <div className="nav-auth-wrapper">
            {isAuthenticated ? (
              <div className="nav-profile-dropdown-container">
                <button 
                  className="modern-icon-btn profile-avatar-btn" 
                  onClick={(e) => { e.stopPropagation(); setIsProfileDropdownOpen(!isProfileDropdownOpen); }}
                  title="My Account"
                >
                  <span className="avatar-letter">{user.name.charAt(0).toUpperCase()}</span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="nav-dropdown-menu">
                    <div className="dropdown-header">
                      <p className="dropdown-greet">Welcome,</p>
                      <p className="dropdown-username">{user.name}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                      <User size={16} /> My Profile
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-btn" onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}>
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="modern-icon-btn auth-btn" title="Sign In">
                <User size={18} strokeWidth={2.5} />
              </Link>
            )}
          </div>
        </div>

        {/* Separated Hamburger Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="hamburger-dropdown-menu">
            <div className="mobile-only-links">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={location.pathname === '/' ? 'active' : ''}>
                <Home size={18} className="nav-link-icon" />
                <span>Home</span>
              </Link>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={location.pathname === '/products' ? 'active' : ''}>
                <Utensils size={18} className="nav-link-icon" />
                <span>Menu</span>
              </Link>
              <Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className={location.pathname === '/track-order' ? 'active' : ''}>
                <Truck size={18} className="nav-link-icon" />
                <span>Track Order</span>
              </Link>
            </div>
            
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={location.pathname === '/about' ? 'active' : ''}>
              <Info size={18} className="nav-link-icon" />
              <span>About Us</span>
            </Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={location.pathname === '/contact' ? 'active' : ''}>
              <Phone size={18} className="nav-link-icon" />
              <span>Contact</span>
            </Link>
            
            <button onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} className="hamburger-theme-toggle-btn" title={theme === 'light' ? "Dark Mode" : "Light Mode"}>
              <div className="nav-link-icon-wrapper">
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        )}

      </div>
      
      {/* Global Search Overlay Modal */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Navbar;
