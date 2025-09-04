
import React from 'react';
import './ScoreCard.css';



// Reference image colors
const gradients = {
  overall: 'url(#overallGradient)', // pink to purple
  requirements: 'url(#requirementsGradient)', // purple to blue
  keywords: 'url(#keywordsGradient)', // blue to green
};
const amountColors = {
  overall: '#ff4f7a',
  requirements: '#7c5aff',
  keywords: '#3ec6e0',
};

const PhiChart = ({ value, label, gradient }) => {
  const radius = 60;
  const stroke = 16;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.max(0, Math.min(100, value));
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <div className="phi-chart">
      <div className="phi-shadow-gray" />
      <div className="phi-shadow" />
      <svg height={radius * 2} width={radius * 2} style={{ position: 'relative', zIndex: 2 }}>
        <defs>
          <linearGradient id="overallGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff4f7a" />
            <stop offset="100%" stopColor="#7c5aff" />
          </linearGradient>
          <linearGradient id="requirementsGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c5aff" />
            <stop offset="100%" stopColor="#3ec6e0" />
          </linearGradient>
          <linearGradient id="keywordsGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3ec6e0" />
            <stop offset="100%" stopColor="#a8ff78" />
          </linearGradient>
        </defs>
        {/* Gray arc for unfilled section */}
        <circle
          stroke="rgba(180,180,190,0.4)"
          fill="none"
          strokeWidth={stroke}
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeDasharray={circumference}
          strokeDashoffset={0}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        {/* Filled arc */}
        <circle
          stroke={gradient}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.6,.2,.1,1)', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="2rem"
          fontWeight="bold"
          fill="#fff"
          style={{ filter: 'drop-shadow(0 2px 4px #23234a)' }}
        >
          {value}%
        </text>
      </svg>
  <div className="phi-label">{label}</div>
    </div>
  );
};



const ScoreCard = ({ overall, requirements, keywords, overallAmount, requirementsAmount, keywordsAmount }) => (
  <div className="score-card">
    <h3>Resume Score</h3>
    <div className="score-circles">
      {overall !== null && overall !== undefined && (
        <PhiChart value={overall} label="Overall Score" gradient={gradients.overall} amount={overallAmount ? `${overallAmount}%` : ''} amountColor={amountColors.overall} />
      )}
      {requirements !== null && requirements !== undefined && (
        <PhiChart value={requirements} label="Keywords Score" gradient={gradients.requirements} amount={requirementsAmount ? `${requirementsAmount}%` : ''} amountColor={amountColors.requirements} />
      )}
      {keywords !== null && keywords !== undefined && (
        <PhiChart value={keywords} label="ATS Score" gradient={gradients.keywords} amount={keywordsAmount ? `${keywordsAmount}%` : ''} amountColor={amountColors.keywords} />
      )}
    </div>
  </div>
);

export default ScoreCard;
