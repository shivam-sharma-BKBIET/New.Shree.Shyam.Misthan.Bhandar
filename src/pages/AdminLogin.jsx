import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
  const { adminAuth } = useProducts();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Safely fallback to admin/admin123 if context isn't fully loaded yet
    const validUser = adminAuth?.username || 'admin';
    const validPass = adminAuth?.password || 'admin123';

    if (username === validUser && password === validPass) {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/manage-store-admin');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-icon">SD</div>
            <h2>Admin <span>Login</span></h2>
            <p>Access the store management dashboard.</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="login-error">
                <AlertCircle size={18} /> {error}
              </div>
            )}
            
            <div className="login-group">
              <label>Username</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            <div className="login-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-login">
              Login to Dashboard <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="login-footer">
            <p>Authorized access only. Technical issues? Contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
