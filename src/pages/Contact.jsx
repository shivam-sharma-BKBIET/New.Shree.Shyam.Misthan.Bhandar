import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import './Contact.css';

const Contact = () => {
  const { footerData } = useProducts();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setFormData({ name: '', email: '', message: '' });
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
              <p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(footerData?.address || "123 Sweet Lane, Jaipur, Rajasthan")}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {footerData?.address || <>123 Mithai Wala Lane, Model Town<br/>Sweet City, SC 400001</>}
                </a>
              </p>
            </div>
            
            <div className="info-card">
              <div className="icon-wrapper"><Phone size={24} /></div>
              <h3>Call Us</h3>
              <p>
                <a 
                  href={`tel:${(footerData?.phone || "+919876543210").replace(/\s/g, '')}`} 
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {footerData?.phone || "+91 98765 43210"}
                </a>
                <br/>
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
                Message sent successfully! We will get back to you soon.
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
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="rahul@example.com" 
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
                <Send size={18} style={{marginRight: '8px'}} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
