import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getApiUrl } from '../config';
import './AuthStyles.css';


const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsOtpLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/auth/send-otp-email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      
      setOtpSent(true);
      setSuccess('OTP sent to your email! Please check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }
    setError('');
    setIsOtpLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/auth/verify-otp-email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      
      setIsEmailVerified(true);
      setSuccess('Email verified successfully! ✅');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isEmailVerified) {
      setError('Please verify your email address first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, otp })
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
            {error && <div className="auth-error"><Mail size={18} /> {error}</div>}
            {success && <div className="auth-success" style={{ color: '#27ae60', background: 'rgba(39,174,96,0.1)', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '600' }}>{success}</div>}
            
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
                  disabled={isEmailVerified}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                {!isEmailVerified && (
                  <button 
                    type="button" 
                    className="otp-send-btn"
                    onClick={handleSendOTP}
                    disabled={isOtpLoading || !formData.email || !formData.email.includes('@')}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'var(--secondary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    {isOtpLoading ? '...' : (otpSent ? 'Resend' : 'Verify Email')}
                  </button>
                )}
                {isEmailVerified && (
                   <CheckCircle2 size={18} className="password-toggle" style={{ color: '#27ae60' }} />
                )}
              </div>
            </div>

            {otpSent && !isEmailVerified && (
              <div className="auth-group animate-fade-in" style={{ marginTop: '10px' }}>
                <label>Verification OTP</label>
                <div className="auth-input-wrapper">
                  <ShieldCheck size={18} className="auth-input-icon" />
                  <input 
                    type="text" 
                    className="auth-input"
                    placeholder="Enter 6-digit OTP" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  <button 
                    type="button" 
                    className="otp-verify-btn"
                    onClick={handleVerifyOTP}
                    disabled={isOtpLoading || otp.length !== 6}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: '#27ae60', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    {isOtpLoading ? '...' : 'Verify'}
                  </button>
                </div>
              </div>
            )}

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

            <button type="submit" className="btn btn-primary btn-auth" disabled={isLoading || !isEmailVerified}>
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                <>Sign Up Now <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="auth-divider">OR REGISTER WITH</div>

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
                  if (!response.ok) throw new Error(data.message || 'Google registration failed');
                  
                  if (data.user.phone === '0000000000') {
                    const userPhone = window.prompt("Welcome! Please enter your mobile number for order delivery:");
                    if (userPhone && userPhone.length === 10) {
                      await fetch(getApiUrl('/api/auth/update-phone'), {
                        method: 'PUT',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${data.token}`
                        },
                        body: JSON.stringify({ phone: userPhone })
                      });
                      data.user.phone = userPhone;
                    } else {
                      alert("Valid phone number is required for ordering.");
                      return;
                    }
                  }

                  login(data.user, data.token);
                  navigate(redirectUrl);
                } catch (err) {
                  setError(err.message);
                } finally {
                  setIsLoading(false);
                }
              }}
              onError={() => setError('Google Registration Failed')}
              useOneTap
            />
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
