import React from 'react';
import './RequirementsCard.css';

const RequirementsCard = ({ met, missing }) => (
  <div className="requirements-card">
    <h3>Requirements Analysis </h3>
    <div className="requirements-met">
      <h4>Requirements Met</h4>
      <ul>
        {met.map((req, i) => (
          <li key={i} className="met">
            <span className="tick-icon">✔️</span> {req}
          </li>
        ))}
      </ul>
    </div>
    <div className="requirements-missing">
      <h4>Missing Requirements</h4>
      <ul>
        {missing.map((req, i) => <li key={i} className="missing">❌ {req}</li>)}
      </ul>
    </div>
  </div>
);

export default RequirementsCard;
