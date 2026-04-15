import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        // Get user profile first to check role
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
      
      // 1. Update milestone status to 'submitted'
      await axios.put(`http://localhost:5000/api/contracts/milestone/${milestoneId}`, {
        status: 'submitted',
        submissionContent: content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Trigger AI Analysis
      await axios.post('http://localhost:5000/api/ai/analyze', {
        milestoneId,
        content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 3. Refresh data
      const res = await axios.get('http://localhost:5000/api/contracts', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
                <div className="page-title">Active Contracts</div>
                <div className="page-subtitle">Manage your milestones and submissions</div>
            </div>
        </div>

        <div className="section-body" style={{ padding: '0' }}>
          {contracts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text3)' }}>No contracts found.</div>
          ) : (
            contracts.map(c => (
              <div key={c._id} className="section" style={{ marginBottom: '22px' }}>
                <div className="section-header">
                  <div>
                    <div className="section-title">{c.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px', fontFamily: 'var(--mono)' }}>
                      ⬡ {c.amount} ETH · {user?.role === 'client' ? `Freelancer: ${c.freelancerId?.name || 'Unassigned'}` : `Client: ${c.clientId?.name}`}
                    </div>
                  </div>
                  <span className={`badge badge-${c.status || 'active'}`}>{c.status || 'active'}</span>
                </div>
                
                <div className="section-body">
                    {/* Simplified progress bar for the row */}
                    {c.status !== 'locked' && (
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text3)', marginBottom: '8px', fontWeight: 700 }}>
                            <span>PROJECT PROGRESS</span>
                            <span style={{ color: 'var(--gold)' }}>{c.status === 'complete' ? '100%' : '66%'}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: c.status === 'complete' ? '100%' : '66%' }}></div>
                        </div>

                        {/* Real AI Result Display */}
                        {c.milestones?.find(m => m.aiResult)?.aiResult && (
                            <div className="ai-box" style={{ marginTop: '20px', padding: '12px' }}>
                                <div className="ai-title" style={{ fontSize: '10px' }}>AI Work Verification Analysis</div>
                                <div className="ai-scores">
                                    <div className="ai-score">
                                        <div className="ai-score-val" style={{ fontSize: '16px' }}>{c.milestones.find(m => m.aiResult).aiResult.quality}%</div>
                                        <div className="ai-score-lbl">Quality</div>
                                    </div>
                                    <div className="ai-score">
                                        <div className="ai-score-val" style={{ fontSize: '16px', color: c.milestones.find(m => m.aiResult).aiResult.plagiarism > 5 ? 'var(--red)' : 'var(--text)' }}>
                                            {c.milestones.find(m => m.aiResult).aiResult.plagiarism}%
                                        </div>
                                        <div className="ai-score-lbl">Plagiarism</div>
                                    </div>
                                    <div className="ai-score">
                                        <div className="ai-score-val" style={{ fontSize: '16px' }}>{c.milestones.find(m => m.aiResult).aiResult.completion}%</div>
                                        <div className="ai-score-lbl">Completion</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '10px', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                                    " {c.milestones.find(m => m.aiResult).aiResult.feedback} "
                                </div>
                            </div>
                        )}
                    </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                        {user?.role === 'freelancer' && c.status === 'active' && (
                            <button className="btn btn-primary btn-sm" onClick={() => openSubmitModal(c._id)}>Submit Work</button>
                        )}
                        {user?.role === 'client' && c.status === 'active' && (
                            <button className="btn btn-success btn-sm" onClick={() => alert('Approve')}>Approve Payment</button>
                        )}
                        <button className="btn btn-ghost btn-sm">View Details</button>
                    </div>
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
