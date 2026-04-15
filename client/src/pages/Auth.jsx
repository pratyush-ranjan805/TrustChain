import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Briefcase, Zap } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5000${url}`, formData);
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.user);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Error occurred', type: 'err' });
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Shield size={24} color="#0A0C10" strokeWidth={2.5} />
            </div>
            <div>
              <div className="auth-logo-name">TrustChain</div>
              <div style={{ fontSize: '10px', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>Decentralized Escrow</div>
            </div>
          </div>
          <div className="auth-hero-title">
            The future of<br /><span>trustless</span><br />freelancing.
          </div>
          <div className="auth-hero-desc">
            Smart contract-powered escrow that protects both clients and freelancers. Milestone-based payments, AI-verified work, and decentralized dispute resolution.
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-tab-row">
          <div className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Sign In</div>
          <div className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Create Account</div>
        </div>

        <form onSubmit={handleSubmit} className="fade-in">
          <div className="auth-heading">{isLogin ? 'Welcome back' : 'Join TrustChain'}</div>
          <div className="auth-subheading">
            {isLogin ? 'Sign in to manage contracts and payments.' : 'Create your account and start working today.'}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" placeholder="Your name" onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" placeholder="you@example.com" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" placeholder="••••••••" onChange={handleChange} required />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">I am joining as</label>
              <div className="role-grid">
                <div className={`role-card ${formData.role === 'client' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, role: 'client' })}>
                  <div className="role-card-icon">🏢</div>
                  <div className="role-card-name">Client</div>
                  <div className="role-card-desc">Hire & pay for work</div>
                </div>
                <div className={`role-card ${formData.role === 'freelancer' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, role: 'freelancer' })}>
                  <div className="role-card-icon">⚡</div>
                  <div className="role-card-name">Freelancer</div>
                  <div className="role-card-desc">Get paid for work</div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn-auth">{isLogin ? 'Sign in' : 'Create account'}</button>
          
          {msg.text && <div className={`auth-msg ${msg.type}`}>{msg.text}</div>}
        </form>
      </div>
    </div>
  );
};

export default Auth;
