import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const SubmitWorkModal = ({ isOpen, onClose, onSubmit, milestoneId }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    await onSubmit(milestoneId, content);
    setIsAnalyzing(false);
    onClose();
  };

  return (
    <div className="auth-shell" style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      background: 'rgba(0,0,0,0.85)', zIndex: 1000, 
      display: 'flex', alignItems: 'center', justifyContent: 'center' 
    }}>
      <div className="section" style={{ width: '500px', background: 'var(--bg2)', padding: '0', position: 'relative' }}>
        <div className="section-header">
          <div className="section-title">Submit Work for Review</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <div className="section-body">
          <div className="form-group">
            <label className="form-label">Work Content (Text or Links)</label>
            <textarea 
              className="form-input" 
              rows="8" 
              placeholder="Paste your completed work here, or provide a link to a repository/document..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ resize: 'none' }}
              disabled={isAnalyzing}
            ></textarea>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button className="btn btn-ghost" onClick={onClose} disabled={isAnalyzing}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={isAnalyzing || !content.trim()}>
              {isAnalyzing ? (
                <>AI Analyzing...</>
              ) : (
                <><Send size={15} style={{ marginRight: '6px' }} /> Submit & Analyze</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitWorkModal;
