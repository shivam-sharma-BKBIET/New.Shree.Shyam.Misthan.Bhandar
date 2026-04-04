import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import './Contact.css';

const Contact = () => {
  const { footerData } = useProducts();
  const [formData, setFormData] = useState({ name: '', mobileNumber: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct WhatsApp Message
    const whatsappMessage = `New Website Inquiry:\nName: ${formData.name}\nMobile: ${formData.mobileNumber}\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/918529434514?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    setSuccess(true);
    setFormData({ name: '', mobileNumber: '', message: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="contact-page section">
      <div className="container">
        <h1 className="section-title">Get in <span>Touch</span></h1>
        
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info-cards">
            <div className="info-card">
              <div className="icon-wrapper"><MapPin size={24} /></div>
              <h3>Visit Our Store</h3>
              {(footerData?.addresses && footerData.addresses.length > 0) ? footerData.addresses.map((addr, index) => (
                <p key={index} style={{ marginBottom: index === footerData.addresses.length - 1 ? 0 : '8px' }}>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(addr)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {addr}
                  </a>
                </p>
              )) : (
                <p>123 Mithai Wala Lane, Model Town<br/>Sweet City, SC 400001</p>
              )}
            </div>
            
            <div className="info-card">
              <div className="icon-wrapper"><Phone size={24} /></div>
              <h3>Call Us</h3>
              {(footerData?.phoneNumbers && footerData.phoneNumbers.length > 0) ? footerData.phoneNumbers.map((phone, index) => (
                <p key={index} style={{ marginBottom: '4px' }}>
                  <a 
                    href={`tel:${phone.replace(/\s/g, '')}`} 
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {phone}
                  </a>
                </p>
              )) : (
                <p>+91 98765 43210</p>
              )}
              <p className="hours-text" style={{ marginTop: '8px', fontSize: '0.9rem', opacity: 0.8 }}>
                {footerData?.hours || "Mon-Sun: 9:00 AM - 10:00 PM"}
              </p>
            </div>
            
            <div className="info-card">
              <div className="icon-wrapper"><Mail size={24} /></div>
              <h3>Email Us</h3>
              <p>
                <a 
                  href={`mailto:${footerData?.email || "hello@newshreeshyam.com"}`} 
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {footerData?.email || "hello@newshreeshyam.com"}
                </a>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            <h2>Send us a Message</h2>
            <p className="text-muted">Have a special request for a bulk order or custom designer cake? Let us know!</p>
            
            {success && (
              <div className="alert-success">
                Redirecting to WhatsApp... Thank you for reaching out!
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Rahul Sharma" 
                />
              </div>
              
              <div className="form-group">
                <label>Mobile Number</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  required 
                  value={formData.mobileNumber}
                  onChange={e => setFormData({...formData, mobileNumber: e.target.value})}
                  placeholder="Enter your 10-digit mobile number" 
                />
              </div>
              
              <div className="form-group">
                <label>Your Message</label>
                <textarea 
                  className="input-field" 
                  rows="5" 
                  required 
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="How can we help you make your occasion sweeter?"
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary w-100 send-btn">
                <Send size={18} style={{marginRight: '8px'}} /> Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
