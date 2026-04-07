import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Facebook, Chrome } from 'lucide-react';
import { getApiUrl } from '../config';
import './AuthStyles.css';


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

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

            <Link to="#" className="forgot-password-link">Forgot your password?</Link>

            <button type="submit" className="btn btn-primary btn-auth" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                <>Log In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="auth-divider">OR CONTINUE WITH</div>

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
            Don't have an account? <Link to="/register">Sign up here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
