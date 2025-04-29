import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ProfileIcon, 
  HistoryIcon, 
  InstructionIcon
} from './icons/Icons';
import TaskIcon from './icons/TaskIcon';
import CalendarIcon from './icons/CalendarIcon';
import './BottomNavigation.css';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { name: 'Профиль', path: '/profile', icon: ProfileIcon },
    { name: 'История', path: '/history', icon: HistoryIcon },
    { name: 'Задачи', path: '/tasks', icon: TaskIcon },
    { name: 'Календарь', path: '/calendar', icon: CalendarIcon },
    { name: 'Инструкции', path: '/instructions', icon: InstructionIcon },
  ];

  const handleNavigate = (navPath) => {
    navigate(navPath);
  };

  return (
    <div className="bottom-navigation">
      {navItems.map((item) => {
        const isActive = path === item.path;
        return (
          <div 
            key={item.path} 
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => handleNavigate(item.path)}
          >
            <item.icon active={isActive} />
            <span className="nav-label">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNavigation; 