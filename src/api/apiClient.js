import axios from 'axios';

// Базовый URL для API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.eduassistant.app';

// Создаем инстанс axios с настройками по умолчанию
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 секунд таймаут
});

// Добавляем интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка общих ошибок
    if (error.response) {
      // Ошибка от сервера
      console.error('API Error:', error.response.status, error.response.data);
      
      // Здесь можно добавить специфическую обработку ошибок по статусам
      if (error.response.status === 401) {
        // Обработка неавторизованного доступа
        // например, перенаправление на страницу входа
      }
      
      return Promise.reject({
        statusCode: error.response.status,
        message: error.response.data.message || 'Ошибка сервера',
        data: error.response.data
      });
    } else if (error.request) {
      // Запрос был сделан, но ответа не получено
      console.error('API Request Error:', error.request);
      return Promise.reject({
        statusCode: 0,
        message: 'Нет ответа от сервера. Проверьте подключение к интернету.',
      });
    } else {
      // Ошибка при настройке запроса
      console.error('API Setup Error:', error.message);
      return Promise.reject({
        statusCode: 0,
        message: `Ошибка при выполнении запроса: ${error.message}`,
      });
    }
  }
);

// Функция для добавления токена аутентификации к запросу
export const setAuthToken = (token) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Функция для очистки токена аутентификации
export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

export default apiClient; 