/**
 * Сервис для работы с задачами и синхронизации с Telegram ботом
 */

import { useWebApp } from '../contexts/WebAppContext';

/**
 * Отправляет задачу боту для создания напоминания
 * @param {Object} task - Объект задачи
 * @returns {Promise} - Результат операции
 */
export const sendTaskToBot = async (task) => {
  try {
    // Получаем экземпляр Telegram WebApp
    const tg = window.Telegram?.WebApp;
    
    if (!tg) {
      throw new Error('Telegram WebApp не доступен');
    }
    
    console.log('Отправка задачи в бот:', task);
    
    // Форматируем данные задачи для отправки
    const taskData = {
      action: 'add_reminder',
      task_id: task.id.toString(), // Преобразуем ID в строку для совместимости
      title: task.title,
      description: task.description || '',
      date: task.date,
      time: task.time
    };
    
    console.log('Форматированные данные для отправки:', taskData);
    
    // Отправляем данные в бот через метод sendData
    tg.sendData(JSON.stringify(taskData));
    
    // Показываем пользователю сообщение об успешной отправке
    tg.showAlert(`Напоминание "${task.title}" добавлено в чат-бота`);
    
    // Возвращаем статус успеха
    return { success: true };
  } catch (error) {
    console.error('Ошибка отправки задачи боту:', error);
    return { 
      success: false, 
      error: error.message || 'Не удалось отправить задачу боту'
    };
  }
};

/**
 * Удаляет напоминание из бота
 * @param {number} taskId - ID задачи
 * @returns {Promise} - Результат операции
 */
export const deleteTaskFromBot = async (taskId) => {
  try {
    // Получаем экземпляр Telegram WebApp
    const tg = window.Telegram?.WebApp;
    
    if (!tg) {
      throw new Error('Telegram WebApp не доступен');
    }
    
    console.log('Удаление задачи из бота, ID:', taskId);
    
    // Отправляем команду удаления
    const deleteData = {
      action: 'delete_reminder',
      task_id: taskId.toString() // Преобразуем ID в строку для совместимости
    };
    
    console.log('Данные для удаления задачи:', deleteData);
    
    // Отправляем данные в бот
    tg.sendData(JSON.stringify(deleteData));
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления задачи из бота:', error);
    return { 
      success: false, 
      error: error.message || 'Не удалось удалить задачу из бота'
    };
  }
};

/**
 * Обновляет напоминание в боте
 * @param {Object} task - Обновленный объект задачи
 * @returns {Promise} - Результат операции
 */
export const updateTaskInBot = async (task) => {
  try {
    // Получаем экземпляр Telegram WebApp
    const tg = window.Telegram?.WebApp;
    
    if (!tg) {
      throw new Error('Telegram WebApp не доступен');
    }
    
    console.log('Обновление задачи в боте:', task);
    
    // Форматируем данные задачи для отправки
    const taskData = {
      action: 'update_reminder',
      task_id: task.id.toString(), // Преобразуем ID в строку для совместимости
      title: task.title,
      description: task.description || '',
      date: task.date,
      time: task.time
    };
    
    console.log('Данные для обновления задачи:', taskData);
    
    // Отправляем данные в бот
    tg.sendData(JSON.stringify(taskData));
    
    // Показываем пользователю сообщение об успешном обновлении
    tg.showAlert(`Напоминание "${task.title}" обновлено в чат-боте`);
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления задачи в боте:', error);
    return { 
      success: false, 
      error: error.message || 'Не удалось обновить задачу в боте'
    };
  }
};

/**
 * Хук для работы с задачами в Telegram боте
 */
export const useTaskService = () => {
  const { webApp } = useWebApp();
  
  /**
   * Отправляет задачу в Telegram бот
   */
  const sendTask = async (task) => {
    if (!webApp) {
      console.warn('WebApp недоступен, операция невозможна');
      return { success: false, error: 'WebApp недоступен' };
    }
    
    return await sendTaskToBot(task);
  };
  
  /**
   * Удаляет задачу из Telegram бота
   */
  const deleteTask = async (taskId) => {
    if (!webApp) {
      console.warn('WebApp недоступен, операция невозможна');
      return { success: false, error: 'WebApp недоступен' };
    }
    
    return await deleteTaskFromBot(taskId);
  };
  
  /**
   * Обновляет задачу в Telegram боте
   */
  const updateTask = async (task) => {
    if (!webApp) {
      console.warn('WebApp недоступен, операция невозможна');
      return { success: false, error: 'WebApp недоступен' };
    }
    
    return await updateTaskInBot(task);
  };
  
  return {
    sendTask,
    deleteTask,
    updateTask
  };
};

export default useTaskService; 