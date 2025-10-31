
import React from 'react';

const ReactIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    className={className}
  >
    <circle cx="12" cy="12" r="2"></circle>
    <g>
      <ellipse cx="12" cy="12" rx="11" ry="4.2"></ellipse>
      <ellipse cx="12"cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)"></ellipse>
      <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)"></ellipse>
    </g>
  </svg>
);

export default ReactIcon;
