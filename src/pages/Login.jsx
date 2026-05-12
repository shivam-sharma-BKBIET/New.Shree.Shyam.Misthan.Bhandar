import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { getApiUrl } from '../config';
import './AuthStyles.css';


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = '/'; // Always redirect to home as requested by user

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
                      const userPhone = window.prompt("Welcome! Please enter your mobile number for order delivery:");
                      if (userPhone && userPhone.length === 10) {
                        // Update phone in backend
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
    </div>
  );
};

export default Login;
