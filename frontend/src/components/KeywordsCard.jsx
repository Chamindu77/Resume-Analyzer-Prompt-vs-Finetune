import React from 'react';
import './KeywordsCard.css';

const KeywordsCard = ({ found, missing }) => (
  <div className="keywords-card">
    <h3>ATS Keywords Analysis</h3>
    <div className="keywords-section">
      <div className="keywords-found">
        <h4>Found in Your Resume</h4>
        <div className="keywords-list">
          {found.map((kw, i) => <span key={i} className="keyword found">{kw}</span>)}
        </div>
      </div>
      <div className="keywords-missing">
        <h4>Missing Keywords</h4>
        <div className="keywords-list">
          {missing.map((kw, i) => <span key={i} className="keyword missing">{kw}</span>)}
        </div>
      </div>
    </div>
  </div>
);

export default KeywordsCard;
