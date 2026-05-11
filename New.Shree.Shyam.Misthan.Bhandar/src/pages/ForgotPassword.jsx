import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Key, Lock, ArrowRight, Loader2, CheckCircle, ShieldQuestion } from 'lucide-react';
import { getApiUrl } from '../config';
import './AuthStyles.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify & Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl('/api/auth/verify-otp-reset'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Reset failed');

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card text-center">
            <CheckCircle size={64} color="#27ae60" style={{ margin: '0 auto 1.5rem' }} />
            <h2>Success!</h2>
            <p>Your password has been reset successfully.</p>
            <p className="mt-4 text-muted">Redirecting to login page...</p>
            <Link to="/login" className="btn btn-primary mt-6 w-100">Login Now</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo-icon">
              <ShieldQuestion size={24} />
            </div>
            <h2>Reset <span>Password</span></h2>
            <p>{step === 1 ? 'Enter your email to receive a 6-digit verification code.' : 'Enter the code sent to your email and create a new password.'}</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="auth-form">
              {error && <div className="auth-error">{error}</div>}

              <div className="auth-group">
                <label>Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input 
                    type="email" 
                    className="auth-input"
                    placeholder="Enter your registered email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-auth" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>Send OTP <ArrowRight size={18} /></>
                )}
              </button>

              <div className="auth-footer mt-4">
                Remembered your password? <Link to="/login">Back to Login</Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="auth-form">
              {error && <div className="auth-error">{error}</div>}

              <div className="auth-group">
                <label>Verification Code (OTP)</label>
                <div className="auth-input-wrapper">
                  <Key size={18} className="auth-input-icon" />
                  <input 
                    type="text" 
                    className="auth-input"
                    placeholder="Enter 6-digit code" 
                    required 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Code sent to: <strong>{email}</strong></p>
              </div>

              <div className="auth-group">
                <label>New Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input 
                    type="password" 
                    className="auth-input"
                    placeholder="Enter new password" 
                    required 
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-auth" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>Update Password <ArrowRight size={18} /></>
                )}
              </button>
              
              <button 
                type="button" 
                className="btn btn-outline w-100 mt-3" 
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                Change Email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
