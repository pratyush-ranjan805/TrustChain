import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Wallet, Tag, AlignLeft } from 'lucide-react';

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      // Reverting to creating a direct contract in 'locked' status (awaiting freelancer)
      await axios.post('http://localhost:5000/api/contracts', {
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.budget),
        status: 'locked'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Contract drafted successfully!');
      navigate('/contracts');
    } catch (err) {
      console.error("Job creation failed", err);
      alert('Failed to post job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Post a Job</div>
          <div className="page-subtitle">Publish a new contract to find the best talent on TrustChain</div>
        </div>
      </div>

      <div className="section" style={{ maxWidth: '600px', padding: '30px', background: 'var(--bg2)', borderRadius: '16px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <div style={{ position: 'relative' }}>
                <PlusCircle size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text3)' }} />
                <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Build a Web3 Dashboard" 
                    style={{ paddingLeft: '40px' }}
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <div style={{ position: 'relative' }}>
                <AlignLeft size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text3)' }} />
                <textarea 
                    className="form-input" 
                    placeholder="Describe the deliverables..." 
                    rows="5"
                    style={{ paddingLeft: '40px', paddingTop: '12px' }}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                ></textarea>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
                <label className="form-label">Budget (ETH)</label>
                <div style={{ position: 'relative' }}>
                    <Wallet size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text3)' }} />
                    <input 
                        type="number" 
                        step="0.01"
                        className="form-input" 
                        placeholder="0.5" 
                        style={{ paddingLeft: '40px' }}
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        required
                    />
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Tags</label>
                <div style={{ position: 'relative' }}>
                    <Tag size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text3)' }} />
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder="React, Web3" 
                        style={{ paddingLeft: '40px' }}
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    />
                </div>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={isSubmitting} style={{ width: '100%', marginTop: '10px', height: '48px' }}>
            {isSubmitting ? 'Posting...' : 'Create Contract Draft'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
