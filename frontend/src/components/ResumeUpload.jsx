import React, { useState } from 'react';
import './ResumeUpload.css';

const ResumeUpload = ({ onAnalyze }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [model, setModel] = useState('Gemini 2.5 Flash');

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleAnalyze = () => {
    if (resumeFile) {
      onAnalyze({ resumeFile, jobDescription, model });
    }
  };

  return (
    <div className="resume-upload-card">
      <h2 style={{ textAlign: 'center', marginBottom: '1.2rem' }}>Upload Resume</h2>
      <div className="upload-dropzone">
        <label htmlFor="resume-file" className="dropzone-label">
          <span className="upload-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="#23234a" />
              <path d="M24 34V18M24 18L18 24M24 18L30 24" stroke="#7ed6ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="14" y="34" width="20" height="2.5" rx="1.25" fill="#7ed6ff" />
            </svg>
          </span>
          <span className="dropzone-text">Choose or drag your PDF resume here</span>
        </label>
        <input id="resume-file" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
      </div>
      {resumeFile && <div className="file-info">{resumeFile.name} ({(resumeFile.size/1024/1024).toFixed(2)} MB)</div>}
      <label htmlFor="model-select">AI Model</label>
      <select id="model-select" value={model} onChange={e => setModel(e.target.value)}>
        <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
        {/* <option value="GPT-4o Mini">GPT-4o Mini</option> */}
      </select>
      <label htmlFor="job-desc">Job Description</label>
      <textarea id="job-desc" value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste job description here..." />
      <button className="analyze-btn" onClick={handleAnalyze}>Upload and Analyze</button>
    </div>
  );
};

export default ResumeUpload;
