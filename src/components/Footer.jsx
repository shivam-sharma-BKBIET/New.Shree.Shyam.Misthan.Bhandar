import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Camera, Heart, Globe } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import './Footer.css';

const Footer = () => {
  const { footerData } = useProducts();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h3>{footerData?.shopName || "New Shree Shyam Misthan Bhandar"}</h3>
          <p>{footerData?.description || "Bringing you the authentic taste of traditional Indian sweets made with pure desi ghee and love."}</p>
          <div className="social-links">
            <a href="#" aria-label="Social 1"><Camera size={20} /></a>
            <a href="#" aria-label="Social 2"><Heart size={20} /></a>
            <a href="#" aria-label="Social 3"><Globe size={20} /></a>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Menu</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Info</h4>
          <ul>
            <li><MapPin size={18} /> 
              <span>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(footerData?.address || "123 Sweet Lane, Jaipur, Rajasthan")}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  {footerData?.address || "123 Sweet Lane, Jaipur, Rajasthan"}
                </a>
              </span>
            </li>
            <li><Phone size={18} /> 
              <span>
                <a href={`tel:${(footerData?.phone || "+91 9876543210").replace(/\s/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {footerData?.phone || "+91 9876543210"}
                </a>
              </span>
            </li>
            <li><Mail size={18} /> 
              <span>
                <a href={`mailto:${footerData?.email || "hello@newshreeshyam.com"}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {footerData?.email || "hello@newshreeshyam.com"}
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {footerData?.shopName || "New Shree Shyam Misthan Bhandar"}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
