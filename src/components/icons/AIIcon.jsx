import React from 'react';

const AIIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 16.8891L3 10.9336L12 5L21 10.9336L12 16.8891Z" 
      stroke={active ? "#007AFF" : "#888888"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M5 12.5L12 17L19 12.5" 
      stroke={active ? "#007AFF" : "#888888"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M5 15.5L12 20L19 15.5" 
      stroke={active ? "#007AFF" : "#888888"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default AIIcon; 