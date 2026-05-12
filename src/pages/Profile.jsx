import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config';
import { User, Phone, Mail, MapPin, Plus, Trash2, Loader2, Save, LogOut } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, login, logout } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', phone: '', email: '', addresses: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProfile();
    }
  }, [isAuthenticated, token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(getApiUrl('/api/users/profile'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfileData({
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          addresses: data.addresses || []
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch(getApiUrl('/api/users/profile'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: profileData.name, phone: profileData.phone })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update user in context as well so Navbar updates
        login({ ...user, name: data.name, phone: data.phone }, token);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(getApiUrl('/api/users/addresses'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ address: newAddress })
      });
      const data = await res.json();
      if (res.ok) {
        setProfileData({ ...profileData, addresses: data });
        setNewAddress('');
        setShowAddAddress(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await fetch(getApiUrl(`/api/users/addresses/${index}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfileData({ ...profileData, addresses: data });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return <div className="profile-container"><div className="profile-card"><h2>Please login to view profile</h2></div></div>;
  }

  if (loading) {
    return <div className="profile-container"><div className="loading-spinner"><Loader2 className="animate-spin" size={40} /></div></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-layout">
        {/* Left Column - Personal Info */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">{profileData.name.charAt(0).toUpperCase()}</div>
            <h2>My Profile</h2>
          </div>

          {message.text && (
            <div className={`message-banner ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon disabled">
                <Mail size={18} />
                <input type="email" value={profileData.email} disabled />
              </div>
              <small className="hint">Email cannot be changed.</small>
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <div className="input-with-icon">
                <Phone size={18} />
                <input
                  type="tel"
                  maxLength={10}
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value.replace(/\D/g, '') })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Changes
            </button>

            <div className="profile-actions-divider"></div>
            
            <button type="button" className="profile-logout-btn" onClick={() => {
              logout();
              navigate('/');
            }}>
              <LogOut size={18} /> Log Out from Account
            </button>
          </form>
        </div>

        {/* Right Column - Addresses */}
        <div className="profile-card">
          <div className="address-header">
            <h2>Saved Addresses</h2>
            <button className="add-btn" onClick={() => setShowAddAddress(!showAddAddress)}>
              <Plus size={18} /> Add New
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="add-address-form">
              <textarea
                placeholder="Enter complete address (House No, Street, Landmark, City, Pincode)"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                required
                rows={3}
              ></textarea>
              <div className="address-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddAddress(false)}>Cancel</button>
                <button type="submit" className="save-btn" disabled={saving}>Save Address</button>
              </div>
            </form>
          )}

          <div className="address-list">
            {profileData.addresses.length === 0 ? (
              <div className="empty-state">
                <MapPin size={40} className="empty-icon" />
                <p>No saved addresses yet.</p>
              </div>
            ) : (
              profileData.addresses.map((addr, index) => (
                <div key={index} className="address-item">
                  <div className="address-icon"><MapPin size={20} /></div>
                  <div className="address-text">{addr}</div>
                  <button 
                    className="delete-address-btn" 
                    onClick={() => handleDeleteAddress(index)}
                    title="Delete Address"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
