import React from 'react';

const NFTs = () => {
  const nfts = [
    { owner: 'Sara Patel', initials: 'SP', project: 'SEO Content Package', rating: 5, type: 'Content Writing', hash: '0xNFT...a3f9' },
    { owner: 'Bob Kumar', initials: 'BK', project: 'React Dashboard', rating: 4.5, type: 'Frontend Dev', hash: '0xNFT...b2e4' },
    { owner: 'Bob Kumar', initials: 'BK', project: 'REST API Integration', rating: 5, type: 'Backend Dev', hash: '0xNFT...c1d7' }
  ];

  const renderStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) stars += '★';
      else if (i < rating) stars += '½';
      else stars += '☆';
    }
    return stars;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Reputation NFTs</div>
          <div className="page-subtitle">Earned after each completed project — unforgeable & portable on-chain</div>
        </div>
      </div>

      <div className="section" style={{ marginBottom: '20px' }}>
        <div className="section-header">
          <div className="section-title">What are Reputation NFTs?</div>
        </div>
        <div className="section-body">
          <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.7' }}>
            Each completed project mints a soulbound NFT to the freelancer's wallet. These tokens store your verified work history, ratings, and specializations permanently on-chain — your credentials that can never be falsified or deleted. Clients can verify your real track record before hiring.
          </div>
        </div>
      </div>

      <div className="nft-grid">
        {nfts.map((n, idx) => (
          <div key={idx} className="nft-card">
            <div className="nft-avatar">{n.initials}</div>
            <div className="nft-name">{n.owner}</div>
            <div className="nft-proj">{n.project}</div>
            <div className="nft-rating">
              {renderStars(n.rating)} 
              <span style={{ fontSize: '11px', color: 'var(--text3)', marginLeft: '5px' }}>{n.rating.toFixed(1)}</span>
            </div>
            <div>
              <span className="nft-tag">{n.type}</span>
            </div>
            <div className="nft-hash">{n.hash}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTs;
