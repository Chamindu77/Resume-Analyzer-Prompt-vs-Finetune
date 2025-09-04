import React from 'react';
import './HeroSection.css';


const HeroSection = () => {
  const handleGetStarted = () => {
    const uploadSection = document.getElementById('resume-upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Animated SVG background shapes */}
      <svg className="hero-bg-shape" style={{ position: 'absolute', top: '-60px', left: '-60px', zIndex: 0, opacity: 0.5 }} width="140" height="140">
        <circle cx="70" cy="70" r="70" fill="#7ed6ff">
          <animate attributeName="r" values="55;70;55" dur="6s" repeatCount="indefinite" />
        </circle>
      </svg>
      <svg className="hero-bg-shape" style={{ position: 'absolute', bottom: '-40px', right: '10vw', zIndex: 0, opacity: 0.5 }} width="120" height="120">
        <circle cx="60" cy="60" r="50" fill="#7f53ac">
          <animate attributeName="r" values="50;60;50" dur="7s" repeatCount="indefinite" />
        </circle>
      </svg>
      <svg className="hero-bg-shape" style={{ position: 'absolute', top: '30%', right: '-60px', zIndex: 0, opacity: 0.5 }} width="140" height="140">
        <circle cx="70" cy="70" r="60" fill="#647dee">
          <animate attributeName="r" values="40;60;40" dur="8s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
        <h1>
          Analyze Your Resume<br />
          with <span className="highlight">AI-Powered Insights</span>
        </h1>
        <p>
          Optimize your resume, get ATS-ready, and land your dream job faster.
        </p>
        <button className="get-started" onClick={handleGetStarted}>Get Started</button>
      </div>
      <div className="hero-image" style={{ position: 'relative', zIndex: 2 }}>
        {/* Placeholder for hero illustration */}
        <img src="/src/assets/Progress.gif" alt="AI Resume Analysis" />
      </div>
    </section>
  );
};

export default HeroSection;
