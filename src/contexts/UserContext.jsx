import { createContext, useContext, useEffect, useState } from 'react';
import { useWebApp } from './WebAppContext';
import { fetchUserData, updateUserSettings } from '../api/userApi';

// Создаем контекст
const UserContext = createContext(null);

// Хук для использования контекста
export const useUser = () => useContext(UserContext);

// Провайдер контекста
export const UserProvider = ({ children }) => {
  const { getUserInfo } = useWebApp();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestHistory, setRequestHistory] = useState([]);
  
  // Загрузка данных из localStorage
  useEffect(() => {
    try {
      // Загружаем сохраненные данные из localStorage
      const savedHistory = localStorage.getItem('userHistory');
      const savedSettings = localStorage.getItem('userSettings');
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setRequestHistory(parsedHistory);
        console.log('Загружена история из localStorage:', parsedHistory.length);
      }
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        console.log('Загружены настройки из localStorage:', parsedSettings);
        // Настройки будут объединены с данными пользователя при загрузке
      }
    } catch (err) {
      console.error('Ошибка загрузки данных из localStorage:', err);
    }
  }, []);
  
  // Загрузка данных пользователя при инициализации
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const user = getUserInfo();
        
        // Пытаемся загрузить сохраненные настройки
        let savedSettings = null;
        try {
          const savedSettingsJson = localStorage.getItem('userSettings');
          if (savedSettingsJson) {
            savedSettings = JSON.parse(savedSettingsJson);
          }
        } catch (err) {
          console.error('Ошибка при загрузке настроек из localStorage:', err);
        }
        
        if (user?.id) {
          // В реальном приложении здесь будет запрос к API
          // для получения данных пользователя
          const data = await fetchUserData(user.id);
          
          // Приоритет у локальных настроек, если они есть
          const settings = savedSettings || data?.settings || {
            language: user.language_code || 'ru',
            theme: 'auto',
          };
          
          setUserData({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            settings
          });
          
          if (requestHistory.length === 0 && data?.history?.length > 0) {
            setRequestHistory(data?.history || []);
          }
        } else {
          // Мок данных для разработки
          
          // Приоритет у локальных настроек, если они есть
          const settings = savedSettings || {
            language: 'ru',
            theme: 'auto',
          };
          
          setUserData({
            id: 12345678,
            firstName: 'Тестовый',
            lastName: 'Пользователь',
            username: 'test_user',
            settings
          });
          
          if (requestHistory.length === 0) {
            setRequestHistory([
              {
                id: '1',
                type: 'generate_task',
                query: 'Python для начинающих',
                createdAt: '2023-06-15T12:00:00Z'
              },
              {
                id: '2',
                type: 'answer_question',
                query: 'Что такое алгоритмы сортировки?',
                createdAt: '2023-06-20T15:30:00Z'
              },
              {
                id: '3',
                type: 'find_resources',
                query: 'Ресурсы по машинному обучению',
                createdAt: '2023-07-05T09:15:00Z'
              },
              {
                id: '4',
                type: 'create_lesson_plan',
                query: 'План урока по алгебре',
                createdAt: '2023-07-10T14:00:00Z'
              },
              {
                id: '5',
                type: 'get_checklist',
                query: 'Чек-лист по изучению JavaScript',
                createdAt: '2023-07-15T10:45:00Z'
              }
            ]);
          }
        }

        // Применяем тему при загрузке
        if (savedSettings?.theme) {
          applyTheme(savedSettings.theme);
        }
      } catch (err) {
        console.error('Ошибка загрузки данных пользователя:', err);
        setError(err.message || 'Не удалось загрузить данные пользователя');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [getUserInfo, requestHistory.length]);

  // Функция для применения темы
  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    // Удаляем существующие классы темы
    root.classList.remove('theme-light', 'theme-dark');
    
    if (theme === 'auto') {
      // Определяем системную тему
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    } else {
      // Применяем выбранную тему
      root.classList.add(`theme-${theme}`);
    }
    
    // Сохраняем выбранную тему в localStorage
    localStorage.setItem('theme', theme);
  };
  
  // Функция обновления настроек пользователя
  const updateSettings = async (newSettings) => {
    try {
      if (userData?.id) {
        // В реальном приложении здесь будет запрос к API
        await updateUserSettings(userData.id, newSettings);
        
        // Обновляем данные пользователя с новыми настройками
        const updatedUserData = {
          ...userData,
          settings: {
            ...userData.settings,
            ...newSettings
          }
        };
        
        setUserData(updatedUserData);
        
        // Применяем тему, если она была изменена
        if (newSettings.theme && newSettings.theme !== userData.settings.theme) {
          applyTheme(newSettings.theme);
        }
        
        // Сохраняем настройки в localStorage
        try {
          localStorage.setItem('userSettings', JSON.stringify(updatedUserData.settings));
          console.log('Настройки сохранены в localStorage:', updatedUserData.settings);
        } catch (storageErr) {
          console.error('Ошибка сохранения настроек в localStorage:', storageErr);
        }
        
        return true;
      }
      return false;
    } catch (err) {
      console.error('Ошибка обновления настроек:', err);
      setError(err.message || 'Не удалось обновить настройки');
      return false;
    }
  };
  
  // Добавление нового запроса в историю
  const addToHistory = (request) => {
    const newRequest = {
      id: Date.now().toString(),
      ...request,
      createdAt: new Date().toISOString()
    };
    
    const updatedHistory = [newRequest, ...requestHistory];
    setRequestHistory(updatedHistory);
    
    // Сохраняем в localStorage
    try {
      localStorage.setItem('userHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error('Ошибка сохранения истории в localStorage:', err);
    }
    
    return newRequest.id;
  };
  
  // Очистка истории запросов
  const clearHistory = async () => {
    try {
      setRequestHistory([]);
      
      // Удаляем из localStorage
      localStorage.removeItem('userHistory');
      
      return true;
    } catch (err) {
      console.error('Ошибка при очистке истории:', err);
      setError(err.message || 'Не удалось очистить историю');
      return false;
    }
  };
  
  const value = {
    userData,
    loading,
    error,
    requestHistory,
    updateSettings,
    addToHistory,
    clearHistory
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};