import React from 'react';
import './InstructionsCard.css';


const InstructionsCard = () => (
  <div className="instructions-card">
    <h2>How It Works</h2>
    <div className="instructions-steps">
      <div className="instructions-step">
        <div className="step-number">1</div>
        <div className="step-content">
          <div className="step-title">Upload Your Resume</div>
          <div className="step-desc">Upload your resume in PDF or DOCX format. Maximum file size is 10MB.</div>
        </div>
      </div>
      <div className="instructions-step">
        <div className="step-number">2</div>
        <div className="step-content">
          <div className="step-title">Add Job Description (Optional)</div>
          <div className="step-desc">Paste the job description to receive tailored feedback and match analysis.</div>
        </div>
      </div>
      <div className="instructions-step">
        <div className="step-number">3</div>
        <div className="step-content">
          <div className="step-title">Get Instant Analysis</div>
          <div className="step-desc">Our AI will analyze your resume and provide detailed feedback on:</div>
          <ul>
            <li>Content and formatting improvements</li>
            <li>Key skills and qualifications</li>
            <li>ATS optimization suggestions</li>
            <li>Job description alignment (if provided)</li>
            <li>Keyword and requirements matching (if job description is provided)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default InstructionsCard;
