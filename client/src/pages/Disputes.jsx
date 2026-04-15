import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Disputes = () => {
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/contracts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter for disputed contracts
        setDisputes(res.data.filter(c => c.status === 'disputed'));
      } catch (err) {
        console.error("Error fetching disputes", err);
      }
    };
    fetchDisputes();
  }, []);

  // Mock jury data matching the screenshot
  const juryVotes = [
    { label: 'Juror 1', side: 'freelancer' },
    { label: 'Juror 2', side: 'client' },
    { label: 'Juror 3', side: 'freelancer' },
    { label: 'Juror 4', side: null },
    { label: 'Juror 5', side: null }
  ];

  const aiScore = { quality: 61, plagiarism: 15, completion: 54 };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Disputes</div>
          <div className="page-subtitle">Active arbitration cases with decentralized jury voting</div>
        </div>
      </div>

      {disputes.length === 0 ? (
        <div className="section">
          <div className="section-body">
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>⚖️</div>
              <div style={{ fontWeight: 700, color: 'var(--text2)' }}>No open disputes</div>
              <div style={{ fontSize: '12px' }}>All contracts are running smoothly</div>
            </div>
          </div>
        </div>
      ) : (
        disputes.map(c => (
          <div key={c._id} className="section" style={{ marginBottom: '20px' }}>
            <div className="section-header">
              <div>
                <div className="section-title">{c.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px', fontFamily: 'var(--mono)' }}>
                  {c.amount} ETH · Client vs Freelancer
                </div>
              </div>
              <span className="badge badge-disputed">disputed</span>
            </div>
            
            <div className="section-body">
              <div className="ai-box">
                <div className="ai-title">AI Verdict Analysis</div>
                <div className="ai-scores">
                  <div className="ai-score">
                    <div className="ai-score-val">{aiScore.quality}%</div>
                    <div className="ai-score-lbl">Quality</div>
                  </div>
                  <div className="ai-score">
                    <div className="ai-score-val" style={{ color: 'var(--red)' }}>{aiScore.plagiarism}%</div>
                    <div className="ai-score-lbl">Plagiarism</div>
                  </div>
                  <div className="ai-score">
                    <div className="ai-score-val">{aiScore.completion}%</div>
                    <div className="ai-score-lbl">Completion</div>
                  </div>
                </div>
              </div>

              <div className="jury-box">
                <div className="jury-title">⚖️ Jury Votes (3/5 cast)</div>
                <div className="jury-chips">
                  {juryVotes.map((v, i) => (
                    <span key={i} className={`chip ${v.side === 'client' ? 'chip-c' : v.side === 'freelancer' ? 'chip-f' : ''}`}>
                      {v.label}: {v.side || 'pending'}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button className="btn btn-xs btn-success">Vote: Freelancer</button>
                  <button className="btn btn-xs btn-primary">Vote: Client</button>
                </div>
              </div>

              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text3)', marginBottom: '10px' }}>
                  Arbitration Resolution
                </div>
                <div className="slider-wrap">
                  <div className="slider-labels">
                    <span>Freelancer: <strong>60%</strong></span>
                    <span>Client: <strong>40%</strong></span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="60" disabled />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                  <button className="btn btn-success">Apply Partial Split</button>
                  <button className="btn btn-primary">All → Freelancer</button>
                  <button className="btn btn-danger">Full Refund → Client</button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Disputes;
