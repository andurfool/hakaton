import { createContext, useContext, useEffect, useState } from 'react';

// Создаем контекст
const WebAppContext = createContext(null);

// Хук для использования контекста
export const useWebApp = () => useContext(WebAppContext);

// Провайдер контекста
export const WebAppProvider = ({ children }) => {
  const [webApp, setWebApp] = useState(null);
  const [initData, setInitData] = useState(null);
  const [colorScheme, setColorScheme] = useState('light');
  
  // Инициализация WebApp при монтировании компонента
  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp;
    
    if (telegramWebApp) {
      setWebApp(telegramWebApp);
      
      // Получаем данные инициализации
      try {
        const parsedInitData = telegramWebApp.initDataUnsafe || {};
        setInitData(parsedInitData);
        
        // Определяем цветовую схему
        setColorScheme(telegramWebApp.colorScheme || 'light');
        
        // Подписываемся на изменение темы
        telegramWebApp.onEvent('themeChanged', () => {
          setColorScheme(telegramWebApp.colorScheme);
        });
      } catch (error) {
        console.error('Ошибка инициализации WebApp:', error);
      }
    } else {
      console.warn('Telegram WebApp не обнаружен. Запускаем в режиме разработки.');
      
      // Mock для разработки
      setWebApp({
        isExpanded: true,
        expand: () => console.log('Expand app'),
        close: () => console.log('Close app'),
        showAlert: (message) => alert(message),
        showConfirm: (message) => confirm(message),
        ready: () => console.log('App ready'),
        setHeaderColor: (color) => console.log('Set header color:', color),
        MainButton: {
          show: () => console.log('Show main button'),
          hide: () => console.log('Hide main button'),
          setParams: (params) => console.log('Set main button params:', params),
          onClick: (callback) => { 
            window._mainButtonCallback = callback; 
            console.log('Main button click handler set');
          },
        },
        BackButton: {
          show: () => console.log('Show back button'),
          hide: () => console.log('Hide back button'),
          onClick: (callback) => {
            window._backButtonCallback = callback;
            console.log('Back button click handler set');
          },
        },
        openLink: (url) => window.open(url, '_blank'),
      });

      setInitData({
        user: {
          id: 12345678,
          first_name: 'Тестовый',
          last_name: 'Пользователь',
          username: 'test_user',
          language_code: 'ru',
        },
        start_param: '',
      });
    }
  }, []);

  const value = {
    webApp,
    initData,
    colorScheme,
    // Вспомогательные методы
    showMainButton: (text, callback) => {
      if (webApp?.MainButton) {
        webApp.MainButton.setParams({ text });
        if (callback) {
          webApp.MainButton.onClick(callback);
        }
        webApp.MainButton.show();
      }
    },
    hideMainButton: () => {
      if (webApp?.MainButton) {
        webApp.MainButton.hide();
      }
    },
    showBackButton: (callback) => {
      if (webApp?.BackButton) {
        if (callback) {
          webApp.BackButton.onClick(callback);
        }
        webApp.BackButton.show();
      }
    },
    hideBackButton: () => {
      if (webApp?.BackButton) {
        webApp.BackButton.hide();
      }
    },
    showAlert: (message) => {
      if (webApp) {
        webApp.showAlert(message);
      } else {
        alert(message);
      }
    },
    showConfirm: (message) => {
      if (webApp) {
        return new Promise((resolve) => {
          webApp.showConfirm(message, resolve);
        });
      } else {
        return Promise.resolve(confirm(message));
      }
    },
    openLink: (url) => {
      if (webApp) {
        webApp.openLink(url);
      } else {
        window.open(url, '_blank');
      }
    },
    getUserInfo: () => {
      return initData?.user || null;
    },
  };

  return (
    <WebAppContext.Provider value={value}>
      {children}
    </WebAppContext.Provider>
  );
}; 