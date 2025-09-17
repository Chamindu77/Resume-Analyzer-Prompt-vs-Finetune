import React from 'react';
import './AnalysisModal.css';

const AnalysisModal = ({ open, onCancel }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">
          {/* Placeholder for scanning icon */}
          <span role="img" aria-label="scanning">⚙️</span>
        </div>
        <h2>Scanning Resume...</h2>
        <p>Your resume is being analyzed for ATS compatibility.</p>
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default AnalysisModal;
