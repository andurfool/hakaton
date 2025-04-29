import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useWebApp } from '../contexts/WebAppContext';

// Иконки для навигации
import ProfileIcon from '../components/icons/ProfileIcon';
import HistoryIcon from '../components/icons/HistoryIcon';
import InstructionIcon from '../components/icons/InstructionIcon';
import AIIcon from '../components/icons/AIIcon';
import TaskIcon from '../components/icons/TaskIcon';
import CalendarIcon from '../components/icons/CalendarIcon';

const MainLayout = () => {
  const location = useLocation();
  const { webApp, colorScheme } = useWebApp();
  
  // Устанавливаем заголовок страницы в зависимости от маршрута
  useEffect(() => {
    const pathToTitle = {
      '/': 'Профиль',
      '/profile': 'Профиль',
      '/history': 'История',
      '/instructions': 'Инструкции',
      '/ai-models': 'Нейросети',
      '/tasks': 'Планировщик',
      '/calendar': 'Календарь',
    };
    
    const title = pathToTitle[location.pathname] || 'Образовательный ассистент';
    document.title = `${title} | Образовательный ассистент`;
  }, [location.pathname]);
  
  // Обработка кнопки "назад" в приложении Telegram
  useEffect(() => {
    if (webApp) {
      const isMainPage = location.pathname === '/' || location.pathname === '/profile';
      
      if (isMainPage) {
        webApp.BackButton?.hide();
      } else {
        webApp.BackButton?.show();
        webApp.BackButton?.onClick(() => {
          window.history.back();
        });
      }
    }
    
    return () => {
      webApp?.BackButton?.hide();
    };
  }, [location.pathname, webApp]);
  
  return (
    <div className={`app-container ${colorScheme}`}>
      {/* Основное содержимое */}
      <main className="main-container pb-16">
        <Outlet />
      </main>
      
      {/* Нижняя навигация */}
      <nav className="bottom-nav">
        <NavItem 
          to="/profile" 
          icon={<ProfileIcon />} 
          label="Профиль" 
          isActive={location.pathname === '/' || location.pathname === '/profile'} 
        />
        <NavItem 
          to="/history" 
          icon={<HistoryIcon />} 
          label="История" 
          isActive={location.pathname === '/history'} 
        />
        <NavItem 
          to="/tasks" 
          icon={<TaskIcon />} 
          label="Задачи" 
          isActive={location.pathname === '/tasks'} 
        />
        <NavItem 
          to="/calendar" 
          icon={<CalendarIcon />} 
          label="Календарь" 
          isActive={location.pathname === '/calendar'} 
        />
        <NavItem 
          to="/instructions" 
          icon={<InstructionIcon />} 
          label="Инструкции" 
          isActive={location.pathname === '/instructions'} 
        />
        <NavItem 
          to="/ai-models" 
          icon={<AIIcon />} 
          label="Нейросети" 
          isActive={location.pathname === '/ai-models'} 
        />
      </nav>
    </div>
  );
};

// Компонент элемента навигации
const NavItem = ({ to, icon, label, isActive }) => (
  <NavLink 
    to={to} 
    className={`nav-item ${isActive ? 'active' : ''}`}
  >
    <div className={`text-xl mb-1 ${isActive ? 'text-primary-500' : 'text-gray-500'}`}>
      {icon}
    </div>
    <span className={`text-xs ${isActive ? 'text-primary-500 font-medium' : 'text-gray-500'} truncate text-center w-full`}>
      {label}
    </span>
  </NavLink>
);

export default MainLayout; 