import React from 'react';

export const ProfileIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" 
      stroke={active ? "#007AFF" : "#888888"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M18 20C18 17.7909 15.3137 16 12 16C8.68629 16 6 17.7909 6 20" 
      stroke={active ? "#007AFF" : "#888888"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const HistoryIcon = ({ active }) => (
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

export const InstructionIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M8 6H16M8 10H16M8 14H11M4 22H20C21.1046 22 22 21.1046 22 20V4C22 2.89543 21.1046 2 20 2H4C2.89543 2 2 2.89543 2 4V20C2 21.1046 2.89543 22 4 22Z" 
      stroke={active ? "#007AFF" : "#888888"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const ModelsIcon = ({ active }) => (
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

export const FavoritesIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
      stroke={active ? "#007AFF" : "#888888"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill={active ? "#007AFF" : "none"}
    />
  </svg>
); 