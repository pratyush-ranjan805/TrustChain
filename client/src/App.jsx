import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Contracts from './pages/Contracts';
import CreateJob from './pages/CreateJob';
import Disputes from './pages/Disputes';
import NFTs from './pages/NFTs';
import Profile from './pages/Profile';
import { useWeb3 } from './context/Web3Context';
import { Shield, LayoutGrid, FileText, PlusCircle, AlertTriangle, User, LogOut, Award } from 'lucide-react';

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { account, connectWallet, isConnecting } = useWeb3();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (err) {
          console.error("Token verification failed", err);
          localStorage.removeItem('token');
          if (location.pathname !== '/auth') navigate('/auth');
        }
      } else {
        if (location.pathname !== '/auth') navigate('/auth');
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/auth');
  };

  if (isLoading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--gold)' }}>Loading TrustChain...</div>;

  if (!user && location.pathname !== '/auth') {
    return <Navigate to="/auth" />;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <Routes>
      <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
      <Route
        path="/*"
        element={
          <div id="page-app" className="active" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div className="topbar">
              <div className="topbar-left">
                <Link to="/" className="topbar-logo">
                  <div className="topbar-logo-icon">
                    <Shield size={18} color="#0A0C10" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="topbar-logo-name" style={{ color: 'var(--text)' }}>TrustChain</div>
                    <div className="topbar-logo-sub">Decentralized Escrow</div>
                  </div>
                </Link>
              </div>
              <div className="topbar-right">
                <button 
                  className={`wallet-btn ${account ? 'connected' : ''}`} 
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  <div className={`wallet-dot ${account ? 'connected' : ''}`}></div>
                  <span>
                    {isConnecting ? 'Connecting...' : (account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Connect MetaMask')}
                  </span>
                </button>
                {user && (
                  <Link to="/profile" className="user-chip">
                    <div className="user-avatar">{user.name.substring(0, 2).toUpperCase()}</div>
                    <div>
                      <div className="user-chip-name">{user.name}</div>
                      <div className="user-chip-role">{user.role}</div>
                    </div>
                  </Link>
                )}
                <button className="btn-logout" onClick={handleLogout}><LogOut size={16} /></button>
              </div>
            </div>

            <div className="app-layout">
              <div className="sidebar">
                <div className="sidebar-section">
                  <div className="sidebar-section-label">Overview</div>
                  <Link to="/" className={`sidebar-item ${isActive('/') ? 'active' : ''}`}>
                    <LayoutGrid size={15} />
                    <span>Dashboard</span>
                  </Link>
                </div>
                <div className="sidebar-section">
                  <div className="sidebar-section-label">Work</div>
                  <Link to="/contracts" className={`sidebar-item ${isActive('/contracts') ? 'active' : ''}`}>
                    <FileText size={15} />
                    <span>Contracts</span>
                  </Link>
                  <Link to="/create" className={`sidebar-item ${isActive('/create') ? 'active' : ''}`}>
                    <PlusCircle size={15} />
                    <span>Post a Job</span>
                  </Link>
                  <Link to="/disputes" className={`sidebar-item ${isActive('/disputes') ? 'active' : ''}`}>
                    <AlertTriangle size={15} />
                    <span>Disputes</span>
                    <span className="badge-disputed" style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '10px', marginLeft: 'auto' }}>1</span>
                  </Link>
                </div>
                <div className="sidebar-section">
                  <div className="sidebar-section-label">Identity</div>
                  <Link to="/reputation" className={`sidebar-item ${isActive('/reputation') ? 'active' : ''}`}>
                    <Award size={15} />
                    <span>Reputation NFTs</span>
                  </Link>
                  <Link to="/profile" className={`sidebar-item ${isActive('/profile') ? 'active' : ''}`}>
                    <User size={15} />
                    <span>Profile</span>
                  </Link>
                </div>
              </div>

              <div className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard user={user} />} />
                  <Route path="/contracts" element={<Contracts />} />
                  <Route path="/create" element={<CreateJob />} />
                  <Route path="/disputes" element={<Disputes />} />
                  <Route path="/reputation" element={<NFTs />} />
                  <Route path="/profile" element={<Profile user={user} />} />
                </Routes>
              </div>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
