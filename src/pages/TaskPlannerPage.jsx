import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import useTaskService from '../api/taskService';
import { useWebApp } from '../contexts/WebAppContext';

const TaskPlannerPage = () => {
  // Получаем сервис для работы с задачами
  const { sendTask, deleteTask, updateTask } = useTaskService();
  const { webApp } = useWebApp();
  
  // Состояния для хранения задач и новой задачи
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('planner-tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    completed: false
  });
  const [filter, setFilter] = useState('all'); // all, today, upcoming, completed
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Сохранение задач в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('planner-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Показать уведомление
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Обработчик добавления/редактирования задачи
  const handleSaveTask = async (e) => {
    e.preventDefault();
    
    // Проверка обязательных полей
    if (!newTask.title.trim()) return;
    
    setIsLoading(true);
    
    try {
      if (editingTaskId !== null) {
        // Редактирование существующей задачи
        const updatedTask = { ...newTask, id: editingTaskId };
        setTasks(tasks.map(task => 
          task.id === editingTaskId ? updatedTask : task
        ));
        
        // Синхронизация с ботом если задача не выполнена
        if (!updatedTask.completed && webApp) {
          await updateTask(updatedTask);
        }
        
        showNotification('Задача успешно обновлена', 'success');
        setEditingTaskId(null);
      } else {
        // Добавление новой задачи
        const taskToAdd = {
          ...newTask,
          id: Date.now(),
          created: new Date().toISOString()
        };
        setTasks([...tasks, taskToAdd]);
        
        // Отправляем задачу боту
        if (webApp) {
          await sendTask(taskToAdd);
        }
        
        showNotification('Задача успешно создана', 'success');
      }
    } catch (error) {
      console.error('Ошибка при сохранении задачи:', error);
      showNotification('Произошла ошибка при сохранении задачи', 'error');
    } finally {
      setIsLoading(false);
      
      // Сброс формы
      setNewTask({
        title: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm'),
        completed: false
      });
    }
  };

  // Обработчик изменения полей новой задачи
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // Обработчик изменения статуса выполнения задачи
  const handleToggleComplete = async (taskId) => {
    try {
      setIsLoading(true);
      
      // Находим задачу и меняем ее статус
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
      
      // Обновляем локальное состояние
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      // Если задача помечена как выполненная, удаляем напоминание из бота
      if (updatedTask.completed && webApp) {
        await deleteTask(taskId);
        showNotification('Задача помечена как выполненная', 'success');
      } 
      // Если задача снова активна, добавляем напоминание в бот
      else if (!updatedTask.completed && webApp) {
        await sendTask(updatedTask);
        showNotification('Напоминание восстановлено', 'success');
      }
    } catch (error) {
      console.error('Ошибка при изменении статуса задачи:', error);
      showNotification('Произошла ошибка при изменении статуса задачи', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик удаления задачи
  const handleDeleteTask = async (taskId) => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        setIsLoading(true);
        
        // Удаляем задачу из локального хранилища
        setTasks(tasks.filter(task => task.id !== taskId));
        
        // Удаляем напоминание из бота
        if (webApp) {
          await deleteTask(taskId);
        }
        
        // Сбрасываем форму редактирования, если удаляемая задача сейчас редактируется
        if (editingTaskId === taskId) {
          setEditingTaskId(null);
          setNewTask({
            title: '',
            description: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            time: format(new Date(), 'HH:mm'),
            completed: false
          });
        }
        
        showNotification('Задача успешно удалена', 'success');
      } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
        showNotification('Произошла ошибка при удалении задачи', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Обработчик редактирования задачи
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title,
      description: task.description || '',
      date: task.date,
      time: task.time,
      completed: task.completed
    });
  };

  // Функция фильтрации задач
  const getFilteredTasks = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    switch (filter) {
      case 'today':
        return tasks.filter(task => task.date === today);
      case 'upcoming':
        return tasks.filter(task => task.date > today);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  // Сортировка задач по дате и времени
  const sortedTasks = getFilteredTasks().sort((a, b) => {
    // Сначала сортируем по дате
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) return dateComparison;
    
    // Если даты одинаковые, сортируем по времени
    return a.time.localeCompare(b.time);
  });

  // Функция форматирования даты для отображения
  const formatTaskDate = (dateStr, timeStr) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrow = format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd');
    
    let displayDate;
    if (dateStr === today) {
      displayDate = 'Сегодня';
    } else if (dateStr === tomorrow) {
      displayDate = 'Завтра';
    } else {
      const date = new Date(`${dateStr}T${timeStr}`);
      displayDate = format(date, 'd MMMM', { locale: ru });
    }
    
    return `${displayDate}, ${timeStr}`;
  };

  // Добавим функцию для проверки, просрочена ли задача
  const isTaskOverdue = (task) => {
    if (task.completed) return false;
    
    const now = new Date();
    const taskDateTime = new Date(`${task.date}T${task.time || '23:59'}`);
    return taskDateTime < now;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-primary-900">Планировщик задач</h1>
        <p className="text-gray-600">
          Создавайте заметки и устанавливайте сроки для своих задач
        </p>
      </div>
      
      {/* Уведомление */}
      {notification && (
        <motion.div 
          className={`p-3 rounded-lg mb-4 ${
            notification.type === 'error' 
              ? 'bg-red-100 text-red-800' 
              : notification.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {notification.message}
        </motion.div>
      )}
      
      {/* Форма добавления/редактирования задачи */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSaveTask}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Название задачи
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Введите название задачи"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Описание (необязательно)
            </label>
            <textarea
              id="description"
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Добавьте описание задачи"
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Дата
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={newTask.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Время
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={newTask.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            {editingTaskId !== null ? 'Сохранить изменения' : 'Добавить задачу'}
          </button>
        </form>
      </motion.div>
      
      {/* Фильтры задач */}
      <div className="flex overflow-x-auto mb-4 pb-2 gap-2">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          Все
        </FilterButton>
        <FilterButton active={filter === 'today'} onClick={() => setFilter('today')}>
          Сегодня
        </FilterButton>
        <FilterButton active={filter === 'upcoming'} onClick={() => setFilter('upcoming')}>
          Предстоящие
        </FilterButton>
        <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')}>
          Выполненные
        </FilterButton>
      </div>
      
      {/* Список задач */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5v2h6V5" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Нет задач</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Добавьте вашу первую задачу выше' 
                : `Нет ${filter === 'today' ? 'задач на сегодня' : filter === 'upcoming' ? 'предстоящих задач' : 'выполненных задач'}`}
            </p>
          </div>
        ) : (
          sortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              formatDate={formatTaskDate}
              onToggleComplete={() => handleToggleComplete(task.id)}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task.id)}
              isOverdue={isTaskOverdue(task)}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Компонент кнопки фильтра
const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors
      ${active 
        ? 'bg-primary-500 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }
    `}
  >
    {children}
  </button>
);

// Компонент для отдельной задачи
const TaskItem = ({ task, formatDate, isOverdue, onToggleComplete, onEdit, onDelete }) => {
  return (
    <div className={`p-4 rounded-lg border shadow-sm ${
      task.completed ? 'bg-gray-50 border-gray-200' : 
      isOverdue ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-start">
        <button
          onClick={onToggleComplete}
          className={`
            w-6 h-6 rounded-full flex-shrink-0 border transition-colors mr-3 mt-1
            ${task.completed 
              ? 'bg-green-500 border-green-500 text-white flex items-center justify-center' 
              : isOverdue
                ? 'border-red-400'
                : 'border-gray-300'
            }
          `}
        >
          {task.completed && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${
            task.completed 
              ? 'text-gray-500 line-through' 
              : isOverdue
                ? 'text-red-700'
                : 'text-gray-900'
          }`}>
            {task.title}
            {isOverdue && !task.completed && (
              <span className="ml-2 text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                Просрочено
              </span>
            )}
          </h3>
          
          {task.description && (
            <p className={`mt-1 ${
              task.completed 
                ? 'text-gray-400 line-through' 
                : isOverdue
                  ? 'text-red-600'
                  : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <svg className={`mr-1.5 h-4 w-4 ${isOverdue && !task.completed ? 'text-red-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={isOverdue && !task.completed ? 'text-red-500 font-medium' : ''}>
              {formatDate(task.date, task.time)}
            </span>
          </div>
        </div>
        
        <div className="flex ml-4">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-primary-600 p-1 transition-colors"
            aria-label="Редактировать"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600 p-1 transition-colors"
            aria-label="Удалить"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskPlannerPage; 