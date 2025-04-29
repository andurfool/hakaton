import apiClient from './apiClient';

/**
 * Получение данных пользователя
 * @param {number|string} userId - ID пользователя
 * @returns {Promise<Object>} Объект с данными пользователя
 */
export const fetchUserData = async (userId) => {
  try {
    // В режиме разработки используем моки данных
    if (process.env.NODE_ENV === 'development') {
      return mockUserData();
    }
    
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    // В случае ошибки используем моки в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      return mockUserData();
    }
    
    throw error;
  }
};

/**
 * Обновление настроек пользователя
 * @param {number|string} userId - ID пользователя
 * @param {Object} settings - Новые настройки
 * @returns {Promise<Object>} Объект с обновленными настройками
 */
export const updateUserSettings = async (userId, settings) => {
  try {
    // В режиме разработки возвращаем моки данных
    if (process.env.NODE_ENV === 'development') {
      return { success: true, settings };
    }
    
    const response = await apiClient.patch(`/users/${userId}/settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

/**
 * Получение избранных запросов пользователя
 * @param {number|string} userId - ID пользователя
 * @returns {Promise<Array>} Список избранных запросов
 */
export const fetchUserFavorites = async (userId) => {
  try {
    // В режиме разработки используем моки данных
    if (process.env.NODE_ENV === 'development') {
      return mockFavorites();
    }
    
    const response = await apiClient.get(`/users/${userId}/favorites`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    
    // В случае ошибки используем моки в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      return mockFavorites();
    }
    
    throw error;
  }
};

/**
 * Получение истории запросов пользователя
 * @param {number|string} userId - ID пользователя
 * @returns {Promise<Array>} Список истории запросов
 */
export const fetchUserHistory = async (userId) => {
  try {
    // В режиме разработки используем моки данных
    if (process.env.NODE_ENV === 'development') {
      return mockHistory();
    }
    
    const response = await apiClient.get(`/users/${userId}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user history:', error);
    
    // В случае ошибки используем моки в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      return mockHistory();
    }
    
    throw error;
  }
};

/**
 * Добавление запроса в избранное
 * @param {number|string} userId - ID пользователя
 * @param {string} requestId - ID запроса
 * @returns {Promise<Object>} Результат операции
 */
export const addToFavorites = async (userId, requestId) => {
  try {
    // В режиме разработки возвращаем моки данных
    if (process.env.NODE_ENV === 'development') {
      return { success: true };
    }
    
    const response = await apiClient.post(`/users/${userId}/favorites`, { requestId });
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

/**
 * Удаление запроса из избранного
 * @param {number|string} userId - ID пользователя
 * @param {string} requestId - ID запроса
 * @returns {Promise<Object>} Результат операции
 */
export const removeFromFavorites = async (userId, requestId) => {
  try {
    // В режиме разработки возвращаем моки данных
    if (process.env.NODE_ENV === 'development') {
      return { success: true };
    }
    
    const response = await apiClient.delete(`/users/${userId}/favorites/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

/**
 * Очистка истории запросов пользователя
 * @param {number|string} userId - ID пользователя
 * @returns {Promise<Object>} Результат операции
 */
export const clearUserHistory = async (userId) => {
  try {
    // В режиме разработки возвращаем моки данных
    if (process.env.NODE_ENV === 'development') {
      return { success: true };
    }
    
    const response = await apiClient.delete(`/users/${userId}/history`);
    return response.data;
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};

// Моки данных для разработки
const mockUserData = () => ({
  id: 12345678,
  username: 'test_user',
  firstName: 'Тестовый',
  lastName: 'Пользователь',
  settings: {
    defaultModel: 'default',
    language: 'ru',
    notifications: true,
    theme: 'auto',
  },
  stats: {
    totalRequests: 15,
    favoriteCount: 3,
    lastActive: new Date().toISOString(),
  },
  favorites: mockFavorites(),
  history: mockHistory(),
});

const mockFavorites = () => [
  {
    id: '1',
    type: 'generate_task',
    title: 'Python для начинающих',
    content: 'Задание на основы Python...',
    createdAt: '2023-06-15T12:00:00Z'
  },
  {
    id: '2',
    type: 'answer_question',
    title: 'Алгоритмы сортировки',
    content: 'Объяснение различных алгоритмов сортировки...',
    createdAt: '2023-06-20T15:30:00Z'
  },
  {
    id: '3',
    type: 'find_resources',
    title: 'Ресурсы по машинному обучению',
    content: 'Список ресурсов для изучения ML...',
    createdAt: '2023-07-05T09:15:00Z'
  }
];

const mockHistory = () => [
  {
    id: '1',
    type: 'generate_task',
    query: 'Python для начинающих',
    createdAt: '2023-06-15T12:00:00Z',
    isFavorite: true
  },
  {
    id: '2',
    type: 'answer_question',
    query: 'Что такое алгоритмы сортировки?',
    createdAt: '2023-06-20T15:30:00Z',
    isFavorite: true
  },
  {
    id: '3',
    type: 'find_resources',
    query: 'Ресурсы по машинному обучению',
    createdAt: '2023-07-05T09:15:00Z',
    isFavorite: true
  },
  {
    id: '4',
    type: 'create_lesson_plan',
    query: 'План урока по алгебре',
    createdAt: '2023-07-10T14:00:00Z',
    isFavorite: false
  },
  {
    id: '5',
    type: 'get_checklist',
    query: 'Чек-лист по изучению JavaScript',
    createdAt: '2023-07-15T10:45:00Z',
    isFavorite: false
  }
]; 