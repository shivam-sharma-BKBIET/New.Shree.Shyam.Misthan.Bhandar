import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Phone } from 'lucide-react';
import { getApiUrl } from '../config';
import './AuthStyles.css';


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Read redirect URL from query param (e.g. /login?redirect=%2Fcheckout)
  const redirectUrl = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Google Sign-in Extra Phone Flow States
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [googlePhoneInput, setGooglePhoneInput] = useState('');
  const [isPhoneSubmitting, setIsPhoneSubmitting] = useState(false);

  const handleGooglePhoneSubmit = async () => {
    if (googlePhoneInput.length !== 10) return;
    setIsPhoneSubmitting(true);
    try {
      await fetch(getApiUrl('/api/auth/update-phone'), {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pendingGoogleUser.token}`
        },
        body: JSON.stringify({ phone: googlePhoneInput })
      });
      
      const updatedUser = { ...pendingGoogleUser.user, phone: googlePhoneInput };
      login(updatedUser, pendingGoogleUser.token);
      navigate(redirectUrl);
    } catch (err) {
      setError(err.message || 'Failed to update phone number');
      setShowPhoneModal(false);
    } finally {
      setIsPhoneSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      login(data.user, data.token);
      navigate(redirectUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo-icon">NS</div>
            <h2>User <span>Login</span></h2>
            <p>Welcome back! Securely login to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <Mail size={18} /> {error}
              </div>
            )}

            <div className="auth-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input 
                  type="email" 
                  className="auth-input"
                  placeholder="your@email.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="auth-group">
              <label>Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input"
                  placeholder="Enter your password" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Link to="/forgot-password" name="forgot-password" className="forgot-password-link">Forgot your password?</Link>

            <button type="submit" className="btn btn-primary btn-auth" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                <>Log In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="auth-divider">OR CONTINUE WITH</div>

          <div className="auth-social-grid">
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setIsLoading(true);
                  try {
                    const response = await fetch(getApiUrl('/api/auth/google'), {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token: credentialResponse.credential })
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message || 'Google login failed');
                    
                    if (data.user.phone === '0000000000') {
                      setPendingGoogleUser({ user: data.user, token: data.token });
                      setShowPhoneModal(true);
                      setIsLoading(false);
                      return; // Wait for modal submission
                    }

                    login(data.user, data.token);
                    navigate(redirectUrl);
                  } catch (err) {
                    setError(err.message);
                    setIsLoading(false);
                  }
                }}
                onError={(error) => {
                  console.error('Google Login Error:', error);
                  setError('Google Login Failed. Check Console for details.');
                }}
                useOneTap
              />
          </div>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </div>
        </div>
      </div>

      {/* Modern Phone Number Modal for Google Login */}
      {showPhoneModal && (
        <div className="phone-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="auth-card phone-modal-card" style={{ maxWidth: '420px', width: '100%', animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div className="auth-header" style={{ marginBottom: '25px' }}>
              <div className="auth-logo-icon" style={{ margin: '0 auto 15px', background: 'var(--primary)', color: 'white' }}>NS</div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '10px' }}>Welcome! <span>One Last Step</span></h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Please provide your phone number for secure order tracking and delivery updates.</p>
            </div>
            
            <div className="auth-group">
              <label>Mobile Number</label>
              <div className="auth-input-wrapper">
                <Phone size={18} className="auth-input-icon" />
                <input 
                  type="tel" 
                  className="auth-input"
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  value={googlePhoneInput}
                  onChange={(e) => setGooglePhoneInput(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>
            </div>
            
            <button 
              className="btn btn-primary btn-auth" 
              style={{ marginTop: '25px' }}
              disabled={googlePhoneInput.length !== 10 || isPhoneSubmitting}
              onClick={handleGooglePhoneSubmit}
            >
              {isPhoneSubmitting ? <Loader2 className="animate-spin" size={24} /> : <>Complete Profile <ArrowRight size={18} /></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
