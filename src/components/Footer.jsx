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
                {footerData?.addresses?.length > 0 ? footerData.addresses.map((addr, index) => (
                  <div key={index} style={{ marginBottom: index === footerData.addresses.length - 1 ? 0 : '4px' }}>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(addr)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {addr}
                    </a>
                  </div>
                )) : (
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent("Shree Shyam Mishthan Bhandar, Sultana")}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    Shree Shyam Mishthan Bhandar, Sultana
                  </a>
                )}
              </span>
            </li>
            <li><Phone size={18} /> 
              <span>
                {footerData?.phoneNumbers?.length > 0 ? footerData.phoneNumbers.map((phone, index) => (
                  <div key={index} style={{ marginBottom: index === footerData.phoneNumbers.length - 1 ? 0 : '4px' }}>
                    <a 
                      href={`tel:${phone.replace(/\s/g, '')}`} 
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {phone}
                    </a>
                  </div>
                )) : (
                  <div>
                    <div style={{ marginBottom: '4px' }}>
                      <a href="tel:+919928432235" style={{ color: 'inherit', textDecoration: 'none' }}>
                        +91 9928432235
                      </a>
                    </div>
                    <div>
                      <a href="tel:+919928349207" style={{ color: 'inherit', textDecoration: 'none' }}>
                        +91 9928349207
                      </a>
                    </div>
                  </div>
                )}
              </span>
            </li>
            <li><Mail size={18} /> 
              <span>
                <a href={`mailto:${footerData?.email || "New.shree.shyam.misthan.bhandar@gmail.com"}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {footerData?.email || "New.shree.shyam.misthan.bhandar@gmail.com"}
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {footerData?.shopName || "New Shree Shyam Misthan Bhandar"}. All rights reserved.</p>
        <p className="text-xs text-gray-500 mt-1">Some product images are sourced from Wikimedia Commons & Pexels under Creative Commons licenses.</p>
      </div>
    </footer>
  );
};

export default Footer;
