import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutGrid, FileText, CheckCircle, AlertTriangle, Wallet, Clock, ArrowUpRight, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubmitWorkModal from '../components/SubmitWorkModal';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({ escrow: 0, active: 0, complete: 0, disputed: 0, earnings: 0, pending: 0, submissions: 0 });
  const [contracts, setContracts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/contracts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContracts(res.data);
        
        if (user.role === 'client') {
          const active = res.data.filter(c => c.status === 'active').length;
          const complete = res.data.filter(c => c.status === 'complete').length;
          const disputed = res.data.filter(c => c.status === 'disputed').length;
          const totalETH = res.data.reduce((acc, c) => acc + c.amount, 0);
          setStats({ escrow: totalETH, active, complete, disputed });
        } else {
          const active = res.data.filter(c => c.status === 'active').length;
          const complete = res.data.filter(c => c.status === 'complete').length;
          const earnings = res.data.filter(c => c.status === 'complete').reduce((acc, c) => acc + c.amount, 0);
          const pending = res.data.filter(c => c.status === 'active' || c.status === 'disputed').reduce((acc, c) => acc + c.amount, 0);
          const submissions = res.data.filter(c => c.status === 'submitted').length;
          setStats({ pending, active, complete, earnings, submissions });
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchData();
  }, [user.role]);

  const handleWorkSubmit = async (milestoneId, content) => {
    try {
      const token = localStorage.getItem('token');
      const targetMilestoneId = milestoneId; 
      
      await axios.put(`http://localhost:5000/api/contracts/milestone/${targetMilestoneId}`, {
        status: 'submitted',
        submissionContent: content
      }, { headers: { Authorization: `Bearer ${token}` } });

      await axios.post('http://localhost:5000/api/ai/analyze', {
        milestoneId: targetMilestoneId,
        content
      }, { headers: { Authorization: `Bearer ${token}` } });

      window.location.reload();
    } catch (err) {
      console.error("Submission error", err);
      alert("Analysis failed. Please try again.");
    }
  };

  const openSubmitModal = (milestoneId) => {
    setSelectedMilestone(milestoneId);
    setIsModalOpen(true);
  };

  const renderClientHeader = () => (
    <div className="page-header">
      <div>
        <div className="page-title">Dashboard</div>
        <div className="page-subtitle">Welcome back, {user.name} — here's your overview</div>
      </div>
      <Link to="/create" className="btn btn-primary">Post New Job</Link>
    </div>
  );

  const renderFreelancerHeader = () => (
    <div className="page-header">
      <div>
        <div className="page-title" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>Freelancer <span>Workspace</span></div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          {(user.skills || ['React', 'Web3', 'Node.js']).map((skill, i) => (
            <span key={i} className="chip chip-c" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{skill}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-primary btn-sm">Withdraw Funds</button>
      </div>
    </div>
  );

  const renderClientStats = () => (
    <div className="stats-row" style={{ display: 'flex', gap: '60px', marginBottom: '40px', marginTop: '20px' }}>
      <div className="stat-item">
        <div className="stat-label-wrap"><Wallet size={16} /> <span>ETH in Escrow</span></div>
        <div className="stat-val">{stats.escrow.toFixed(2)}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label-wrap"><FileText size={16} /> <span>Active</span></div>
        <div className="stat-val">{stats.active}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label-wrap"><CheckCircle size={16} /> <span>Completed</span></div>
        <div className="stat-val">{stats.complete}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label-wrap"><AlertTriangle size={16} /> <span>Disputes</span></div>
        <div className="stat-val">{stats.disputed}</div>
      </div>
    </div>
  );

  const renderFreelancerStats = () => (
    <div className="stats-row" style={{ display: 'flex', gap: '60px', marginBottom: '40px', marginTop: '20px' }}>
      <div className="stat-item">
        <div className="stat-label-wrap"><Wallet size={16} color="var(--gold)" /> <span>Total Earned</span></div>
        <div className="stat-val">{stats.earnings.toFixed(2)} <span style={{ fontSize: '12px', color: 'var(--text3)' }}>ETH</span></div>
      </div>
      <div className="stat-item">
        <div className="stat-label-wrap"><Clock size={16} color="var(--blue2)" /> <span>Pending Payments</span></div>
        <div className="stat-val" style={{ color: 'var(--blue2)' }}>{stats.pending.toFixed(2)} <span style={{ fontSize: '12px', color: 'var(--text3)' }}>ETH</span></div>
      </div>
      <div className="stat-item">
        <div className="stat-label-wrap"><ArrowUpRight size={16} color="var(--green)" /> <span>Active Projects</span></div>
        <div className="stat-val">{stats.active}</div>
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      {user.role === 'client' ? renderClientHeader() : renderFreelancerHeader()}
      {user.role === 'client' ? renderClientStats() : renderFreelancerStats()}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div className="section" style={{ background: 'transparent', border: 'none' }}>
            <div className="section-header" style={{ borderBottom: 'none', paddingLeft: '0' }}>
            <div className="section-title" style={{ fontSize: '18px' }}>{user.role === 'client' ? 'Active Contracts' : 'Active Projects'}</div>
            </div>
            <div className="section-body" style={{ paddingLeft: '0' }}>
            {contracts.filter(c => c.status === 'active').length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)', fontSize: '13px', background: 'var(--bg2)', borderRadius: '12px' }}>
                No active {user.role === 'client' ? 'contracts' : 'projects'} found.
                </div>
            ) : (
                contracts.filter(c => c.status === 'active').map(c => (
                <div key={c._id} className="contract-row" style={{ background: 'var(--bg2)', borderRadius: '12px', marginBottom: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '15px' }}>{c.title}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '6px', fontFamily: 'var(--mono)' }}>
                                ⬡ {c.amount} ETH · {user.role === 'client' ? `Freelancer: ${c.freelancerId?.name || 'Unassigned'}` : `Client: ${c.clientId?.name}`}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {user.role === 'freelancer' && (
                                <button className="btn btn-primary btn-xs" onClick={() => openSubmitModal(c._id)}>
                                    <Send size={12} style={{ marginRight: '4px' }} /> Submit Work
                                </button>
                            )}
                            <span className={`badge badge-active`}>In Progress</span>
                        </div>
                    </div>
                </div>
                ))
            )}
            </div>
        </div>

        <div className="section" style={{ background: 'transparent', border: 'none' }}>
            <div className="section-header" style={{ borderBottom: 'none', paddingLeft: '0' }}>
                <div className="section-title" style={{ fontSize: '18px' }}>{user.role === 'client' ? 'Recent History' : 'Payment History'}</div>
            </div>
            <div className="section-body" style={{ paddingLeft: '0' }}>
                {contracts.filter(c => c.status === 'complete').length === 0 ? (
                    <div style={{ fontSize: '12px', color: 'var(--text3)', borderLeft: '2px solid var(--border)', paddingLeft: '15px' }}>
                        No history found.
                    </div>
                ) : (
                    contracts.filter(c => c.status === 'complete').slice(0, 3).map(c => (
                        <div key={c._id} style={{ marginBottom: '15px', borderLeft: '2px solid var(--green)', paddingLeft: '15px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700 }}>{user.role === 'client' ? '-' : '+'}{c.amount} ETH</div>
                            <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{c.title}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      <SubmitWorkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleWorkSubmit}
        milestoneId={selectedMilestone}
      />
    </div>
  );
};

export default Dashboard;
