import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, Facebook, Chrome } from 'lucide-react';
import './AuthStyles.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict Phone Validation
    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      alert('Registration successful! Please login.');
      navigate(`/login${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      // Mock Social Login Execution
      const mockUser = {
        name: `Social User (${provider})`,
        email: `user@${provider.toLowerCase()}.com`,
        isAdmin: false
      };
      login(mockUser, 'mock-social-token-12345');
      navigate(redirectUrl);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo-icon">NS</div>
            <h2>User <span>Registration</span></h2>
            <p>Join our sweet community! Create your account below.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <Mail size={18} /> {error}
              </div>
            )}
            
            <div className="auth-group">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input 
                  type="text" 
                  className="auth-input"
                  placeholder="Enter your name" 
                  required 
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setFormData({...formData, name: val});
                  }}
                />
              </div>
            </div>

            <div className="auth-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input 
                  type="email" 
                  className="auth-input"
                  placeholder="Enter your email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="auth-group">
              <label>Phone Number</label>
              <div className="auth-input-wrapper">
                <Phone size={18} className="auth-input-icon" />
                <input 
                  type="tel" 
                  className="auth-input"
                  placeholder="10-digit mobile number" 
                  required 
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({...formData, phone: val});
                  }}
                />
              </div>
            </div>

            <div className="auth-group">
              <label>Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input 
                  type="password" 
                  className="auth-input"
                  placeholder="Create a password" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-auth" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                <>Sign Up Now <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="auth-divider">OR REGISTER WITH</div>

          <div className="auth-social-grid">
            <button type="button" className="social-btn" onClick={() => handleSocialLogin('Google')}>
              <Chrome size={20} color="#EA4335" />
              Google
            </button>
            <button type="button" className="social-btn" onClick={() => handleSocialLogin('Facebook')}>
              <Facebook size={20} color="#1877F2" fill="#1877F2" />
              Facebook
            </button>
          </div>

          <div className="auth-footer">
            Already have an account? <Link to={`/login${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`}>Login Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
