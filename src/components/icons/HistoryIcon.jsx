import React from 'react';

const HistoryIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 8V12L15 15" 
      stroke={active ? "#007AFF" : "#888888"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3.05078 11.0002C3.27368 7.85838 4.94722 5.01903 7.65077 3.51703C10.3543 2.01503 13.6457 2.01503 16.3492 3.51703C19.0528 5.01903 20.7263 7.85838 20.9492 11.0002C21.172 14.142 19.789 17.2051 17.2497 19.1258C14.7104 21.0464 11.3519 21.5569 8.36861 20.489C5.38533 19.4211 3.1315 16.9199 2.28135 13.8554" 
      stroke={active ? "#007AFF" : "#888888"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default HistoryIcon; 