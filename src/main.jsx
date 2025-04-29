import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { WebAppProvider } from './contexts/WebAppContext';
import { UserProvider } from './contexts/UserContext';
import './index.css';
import './styles.css';

// Проверяем наличие Telegram WebApp API
const telegramWebApp = window.Telegram?.WebApp;

// Инициализация приложения
if (telegramWebApp) {
  telegramWebApp.ready();

  // Установка главной кнопки
  telegramWebApp.MainButton.setParams({
    text: 'Написать боту',
    color: '#0ea5e9',
    text_color: '#ffffff',
    is_visible: false,
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <WebAppProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </WebAppProvider>
    </BrowserRouter>
  </React.StrictMode>
); 