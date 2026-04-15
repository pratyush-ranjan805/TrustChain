import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Wallet, Users, CheckCircle, Clock, ShieldCheck, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import SubmitWorkModal from '../components/SubmitWorkModal';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem('token');
        const profileRes = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUser(profileRes.data);

        const res = await axios.get('http://localhost:5000/api/contracts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContracts(res.data);
      } catch (err) {
        console.error("Error fetching contracts", err);
      }
    };
    fetchContracts();
  }, []);

  const handleWorkSubmit = async (milestoneId, content) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/contracts/milestone/${milestoneId}`, {
        status: 'submitted',
        submissionContent: content
      }, { headers: { Authorization: `Bearer ${token}` } });

      await axios.post('http://localhost:5000/api/ai/analyze', { milestoneId, content }, { headers: { Authorization: `Bearer ${token}` } });

      const res = await axios.get('http://localhost:5000/api/contracts', { headers: { Authorization: `Bearer ${token}` } });
      setContracts(res.data);
      alert("Work submitted and AI analysis complete!");
    } catch (err) {
      console.error("Error submitting work", err);
      alert("Analysis failed. Please try again.");
    }
  };

  const openSubmitModal = (milestoneId) => {
    setSelectedMilestone(milestoneId);
    setIsModalOpen(true);
  };

  return (
    <div className="fade-in">
        <div className="page-header">
            <div>
                <div className="page-title" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '32px' }}>Workspace <span>Archive</span></div>
                <div className="page-subtitle">Manage your active milestones, AI verifications, and escrow releases</div>
            </div>
        </div>

        <div className="section-body" style={{ padding: '0', marginTop: '30px' }}>
          {contracts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text3)', border: '1px dashed var(--border)', borderRadius: '20px' }}>
                <FileText size={40} style={{ marginBottom: '15px', opacity: 0.2 }} />
                <div>No active contracts found in your workspace</div>
            </div>
          ) : (
            contracts.map(c => (
              <div key={c._id} className="contract-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className={`badge badge-${c.status || 'active'}`} style={{ fontSize: '10px' }}>
                            <div className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', marginRight: '6px', display: 'inline-block' }}></div>
                            {c.status || 'active'}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>ID: #{c._id.substring(c._id.length - 8)}</div>
                    </div>
                    <div className="section-title" style={{ fontSize: '22px', marginTop: '12px', letterSpacing: '-0.5px' }}>{c.title}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gold)' }}>{c.amount} ETH</div>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '4px' }}>ESCROW FUNDED</div>
                  </div>
                </div>
                
                <div className="contract-meta">
                    <div className="meta-item"><Users size={14} /> {user?.role === 'client' ? `FOR: ${c.freelancerId?.name || 'QUEUED'}` : `FROM: ${c.clientId?.name}`}</div>
                    <div className="meta-item"><Clock size={14} /> 48H DEFAULT RELEASE</div>
                    <div className="meta-item"><Zap size={14} /> AI VERIFIED</div>
                </div>

                <div>
                    {c.status !== 'locked' ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text)', marginBottom: '10px', fontWeight: 700 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} color="var(--gold)" /> MILESTONE PROGRESS</div>
                            <span style={{ color: 'var(--gold)' }}>{c.status === 'complete' ? '100%' : '66%'}</span>
                        </div>
                        <div className="progress-bar" style={{ height: '6px' }}>
                            <div className="progress-fill" style={{ width: c.status === 'complete' ? '100%' : '66%' }}></div>
                        </div>

                        {/* Premium AI Report Visualization */}
                        {c.milestones?.find(m => m.aiResult)?.aiResult && (
                            <div className="ai-report">
                                <div className="ai-report-title"><ShieldCheck size={14} /> Protocol AI — Verification Report</div>
                                <div className="score-grid">
                                    <div className="score-card">
                                        <div className="score-val">{c.milestones.find(m => m.aiResult).aiResult.quality}%</div>
                                        <div className="score-label">Quality</div>
                                    </div>
                                    <div className="score-card">
                                        <div className="score-val" style={{ color: c.milestones.find(m => m.aiResult).aiResult.plagiarism > 5 ? 'var(--red)' : 'var(--text)' }}>
                                            {c.milestones.find(m => m.aiResult).aiResult.plagiarism}%
                                        </div>
                                        <div className="score-label">Plagiarism</div>
                                    </div>
                                    <div className="score-card">
                                        <div className="score-val">{c.milestones.find(m => m.aiResult).aiResult.completion}%</div>
                                        <div className="score-label">Completion</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '12px', lineHeight: '1.6', background: 'var(--bg)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                    <span style={{ color: 'var(--gold)', fontWeight: 800 }}>Insight:</span> "{c.milestones.find(m => m.aiResult).aiResult.feedback}"
                                </div>
                            </div>
                        )}
                    </div>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(232,184,75,0.02)', border: '1px dashed var(--gold-dim)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 700 }}>AWAITING FREELANCER ACCEPTANCE</div>
                            <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '4px' }}>Funds are locked in escrow and will be released to workspace upon acceptance.</div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {user?.role === 'freelancer' && c.status === 'active' && (
                            <button className="btn btn-primary" onClick={() => openSubmitModal(c._id)} style={{ padding: '10px 24px' }}>
                                <Zap size={14} /> Submit Deliverables
                            </button>
                        )}
                        {user?.role === 'client' && c.status === 'active' && (
                            <button className="btn btn-primary" onClick={() => alert('Approve Payment')} style={{ padding: '10px 24px' }}>
                                <CheckCircle size={14} /> Release Payment
                            </button>
                        )}
                        <button className="btn btn-ghost" style={{ border: '1px solid var(--border)' }}>
                            View Nodes <ArrowRight size={14} />
                        </button>
                    </div>
                    <button className="btn-ghost" style={{ fontSize: '11px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        SCAN ON EXPLORER <ExternalLink size={12} />
                    </button>
                </div>
              </div>
            ))
          )}
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

export default Contracts;
