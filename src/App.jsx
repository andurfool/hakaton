import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useWebApp } from './contexts/WebAppContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import InstructionsPage from './pages/InstructionsPage';
import AIModelsPage from './pages/AIModelsPage';
import TaskPlannerPage from './pages/TaskPlannerPage';
import CalendarPage from './pages/CalendarPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

// Components
import SplashScreen from './components/ui/SplashScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { webApp } = useWebApp();
  const location = useLocation();

  useEffect(() => {
    // Симуляция загрузки данных
    const loadApp = async () => {
      try {
        // Здесь можно загрузить начальные данные
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Ошибка инициализации приложения:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApp();
  }, []);

  // Обновление цвета заголовка Telegram при смене страницы
  useEffect(() => {
    if (webApp && webApp.isExpanded) {
      const pathToColor = {
        '/profile': '#0ea5e9',
        '/history': '#8b5cf6',
        '/instructions': '#f59e0b',
        '/ai-models': '#10b981',
        '/tasks': '#3b82f6',
        '/calendar': '#4f46e5',
        '/privacy-policy': '#6b7280',
        '/terms-of-service': '#6b7280',
      };
      
      webApp.setHeaderColor(pathToColor[location.pathname] || '#0ea5e9');
    }
  }, [location.pathname, webApp]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<ProfilePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="instructions" element={<InstructionsPage />} />
        <Route path="ai-models" element={<AIModelsPage />} />
        <Route path="tasks" element={<TaskPlannerPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms-of-service" element={<TermsOfServicePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App; 