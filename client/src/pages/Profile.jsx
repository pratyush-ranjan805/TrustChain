import React, { useState } from 'react';
import axios from 'axios';

const Profile = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || 'User',
    wallet: user?.wallet || '0x...',
    email: user?.email || '',
    skills: user?.skills?.join(', ') || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
      
      // Assume a PUT endpoint for profile update exists
      await axios.put('http://localhost:5000/api/auth/profile', {
        name: formData.name,
        wallet: formData.wallet,
        skills: skillsArray
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully! Logout and login again to see changes refreshed in the shell.');
    } catch (err) {
      console.error("Profile update failed", err);
      alert('Failed to update profile.');
    }
    setIsSaving(false);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Profile</div>
          <div className="page-subtitle">Manage your professional identity and wallet settings</div>
        </div>
      </div>

      <div className="profile-card section" style={{ padding: '28px', maxWidth: '520px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', paddingBottom: '22px', borderBottom: '1px solid var(--border)', marginBottom: '22px' }}>
          <div className="user-avatar" style={{ width: '60px', height: '60px', fontSize: '20px' }}>
            {formData.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>{formData.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px', fontFamily: 'var(--mono)' }}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} · {formData.email}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '22px' }}>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--mono)' }}>4</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 700 }}>Completed</div>
          </div>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--mono)' }}>1.5</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 700 }}>ETH Balance</div>
          </div>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--mono)' }}>{(user?.skills?.length || 0)}</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 700 }}>Verified Skills</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>

        <div className="form-group">
          <label className="form-label">Professional Skills (comma separated)</label>
          <input type="text" className="form-input" placeholder="e.g. React, Node.js, Web3" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
        </div>

        <div className="form-group">
          <label className="form-label">Wallet Address</label>
          <input type="text" className="form-input" value={formData.wallet} onChange={(e) => setFormData({...formData, wallet: e.target.value})} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
