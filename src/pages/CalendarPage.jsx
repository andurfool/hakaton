import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths, getDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parse, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import CalendarIcon from '../components/icons/CalendarIcon';

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem('calendar-events');
      return savedEvents ? JSON.parse(savedEvents) : [];
    } catch (e) {
      console.error('Ошибка при загрузке событий из localStorage:', e);
      return [];
    }
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: format(new Date(), 'HH:mm'),
    type: 'lecture', // lecture, seminar, exam, other
    eventFor: 'all' // all, students, teachers
  });
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  
  // Ref для отслеживания монтирования компонента
  const isMounted = useRef(true);
  
  // При размонтировании компонента устанавливаем флаг
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Функция сброса формы - определяем до ее использования
  const resetForm = useCallback(() => {
    setIsAddingEvent(false);
    setEditingEventId(null);
    setNewEvent({
      title: '',
      description: '',
      time: format(new Date(), 'HH:mm'),
      type: 'lecture',
      eventFor: 'all'
    });
  }, []);

  // Сохраняем события в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem('calendar-events', JSON.stringify(events));
    } catch (e) {
      console.error('Ошибка при сохранении событий в localStorage:', e);
    }
  }, [events]);

  // Навигация по месяцам с проверкой редактирования
  const prevMonth = useCallback(() => {
    // Проверяем, идет ли редактирование
    if (isAddingEvent && newEvent.title.trim()) {
      if (!window.confirm('У вас есть несохраненные изменения. Продолжить без сохранения?')) {
        return; // Отменяем навигацию
      }
      // Сбрасываем форму если пользователь согласился
      resetForm();
    }
    
    setCurrentMonth(prevMonth => {
      const newMonth = subMonths(prevMonth, 1);
      // Обновляем выбранную дату, чтобы она была в новом месяце
      if (!isSameMonth(selectedDate, newMonth)) {
        setSelectedDate(new Date(newMonth));
      }
      return newMonth;
    });
  }, [selectedDate, isAddingEvent, newEvent, resetForm]);

  const nextMonth = useCallback(() => {
    // Проверяем, идет ли редактирование
    if (isAddingEvent && newEvent.title.trim()) {
      if (!window.confirm('У вас есть несохраненные изменения. Продолжить без сохранения?')) {
        return; // Отменяем навигацию
      }
      // Сбрасываем форму если пользователь согласился
      resetForm();
    }
    
    setCurrentMonth(prevMonth => {
      const newMonth = addMonths(prevMonth, 1);
      // Обновляем выбранную дату, чтобы она была в новом месяце
      if (!isSameMonth(selectedDate, newMonth)) {
        setSelectedDate(new Date(newMonth));
      }
      return newMonth;
    });
  }, [selectedDate, isAddingEvent, newEvent, resetForm]);

  // Получение дней для отображения в календаре
  const getDaysInMonth = useCallback(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Получаем день недели первого дня месяца (0 - воскресенье, 1 - понедельник, и т.д.)
    let dayOfWeek = getDay(start);
    
    // Преобразуем в формат, где понедельник - 0, вторник - 1, итд., воскресенье - 6
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    // Добавляем дни из предыдущего месяца
    const prevDays = [];
    if (dayOfWeek > 0) {
      const prevMonth = subMonths(start, 1);
      const lastDayOfPrevMonth = endOfMonth(prevMonth);
      
      for (let i = dayOfWeek - 1; i >= 0; i--) {
        const day = new Date(lastDayOfPrevMonth);
        day.setDate(lastDayOfPrevMonth.getDate() - i);
        prevDays.push(day);
      }
    }
    
    // Получаем день недели последнего дня месяца
    let lastDayOfWeek = getDay(end);
    // Преобразуем в формат, где понедельник - 0, ... воскресенье - 6
    lastDayOfWeek = lastDayOfWeek === 0 ? 6 : lastDayOfWeek - 1;
    
    // Добавляем дни из следующего месяца
    const nextDays = [];
    if (lastDayOfWeek < 6) {
      const nextMonth = addMonths(start, 1);
      const firstDayOfNextMonth = startOfMonth(nextMonth);
      
      for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
        const day = new Date(firstDayOfNextMonth);
        day.setDate(firstDayOfNextMonth.getDate() + i - 1);
        nextDays.push(day);
      }
    }
    
    return [...prevDays, ...days, ...nextDays];
  }, [currentMonth]);

  // Обработчик выбора даты
  const handleDateSelect = useCallback((day) => {
    // Если редактируем событие, предложить пользователю сохранить изменения
    if (isAddingEvent && newEvent.title.trim()) {
      if (window.confirm('У вас есть несохраненные изменения. Продолжить без сохранения?')) {
        setSelectedDate(day);
        resetForm();
      }
    } else {
      setSelectedDate(day);
    }
  }, [isAddingEvent, newEvent, resetForm]);

  // Получение событий для выбранного дня
  const getEventsForDate = useCallback((date) => {
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      return events.filter(event => event.date === dateString);
    } catch (e) {
      console.error('Ошибка при получении событий для даты:', e);
      return [];
    }
  }, [events]);

  // Создание или обновление события
  const handleSaveEvent = useCallback((e) => {
    e.preventDefault();
    
    if (!newEvent.title.trim()) return;
    
    try {
      const eventDate = format(selectedDate, 'yyyy-MM-dd');
      
      if (editingEventId !== null) {
        // Обновление существующего события
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === editingEventId 
              ? { ...newEvent, id: editingEventId, date: eventDate } 
              : event
          )
        );
      } else {
        // Создание нового события
        const newEventWithId = {
          ...newEvent,
          id: Date.now(),
          date: eventDate,
          created: new Date().toISOString()
        };
        setEvents(prevEvents => [...prevEvents, newEventWithId]);
      }
      
      // Сбрасываем форму после сохранения
      resetForm();
      
    } catch (e) {
      console.error('Ошибка при сохранении события:', e);
      // TODO: показать уведомление об ошибке
    }
  }, [newEvent, editingEventId, selectedDate, resetForm]);

  // Изменение полей нового события
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  }, []);

  // Редактирование события
  const handleEditEvent = useCallback((event) => {
    setEditingEventId(event.id);
    setNewEvent({
      title: event.title,
      description: event.description || '',
      time: event.time,
      type: event.type,
      eventFor: event.eventFor
    });
    setIsAddingEvent(true);
  }, []);

  // Удаление события
  const handleDeleteEvent = useCallback((eventId) => {
    if (window.confirm('Вы уверены, что хотите удалить это событие?')) {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      
      if (editingEventId === eventId) {
        setEditingEventId(null);
        setNewEvent({
          title: '',
          description: '',
          time: format(new Date(), 'HH:mm'),
          type: 'lecture',
          eventFor: 'all'
        });
        setIsAddingEvent(false);
      }
    }
  }, [editingEventId]);

  // Получение типа события для стилизации
  const getEventTypeColor = useCallback((type) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'seminar':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  }, []);

  // Получение иконки для типа события
  const getEventTypeIcon = useCallback((type) => {
    switch (type) {
      case 'lecture':
        return (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        );
      case 'seminar':
        return (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'exam':
        return (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  }, []);

  // Получение иконки для целевой аудитории события
  const getEventForIcon = useCallback((eventFor) => {
    switch (eventFor) {
      case 'students':
        return (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'teachers':
        return (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
    }
  }, []);

  // Отрисовка дня в календаре
  const renderDay = useCallback((day) => {
    const dateString = format(day, 'yyyy-MM-dd');
    const dayEvents = events.filter(event => event.date === dateString);
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isSelected = isSameDay(day, selectedDate);
    const isTodayDate = isToday(day);

    return (
      <motion.div
        key={dateString}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative p-1 min-h-[80px] border cursor-pointer transition-all duration-200
          ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} 
          ${isSelected ? 'ring-2 ring-primary-500 border-primary-300' : 'border-gray-200'}
          ${isTodayDate ? 'bg-primary-50' : ''}
          ${isAddingEvent && newEvent.title.trim() ? 'opacity-60 pointer-events-none' : 'hover:shadow-md hover:border-primary-200 hover:z-10'}
        `}
        onClick={() => {
          handleDateSelect(day);
        }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm font-medium relative
            ${isTodayDate ? 'text-white bg-primary-500 rounded-full w-6 h-6 flex items-center justify-center' : ''}
            ${isSelected && !isTodayDate ? 'text-primary-700' : ''}
          `}>
            {format(day, 'd')}
          </span>
          {dayEvents.length > 0 && (
            <span className={`text-xs ${isSelected ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
              {dayEvents.length} {dayEvents.length === 1 ? 'событие' : 
              dayEvents.length >= 2 && dayEvents.length <= 4 ? 'события' : 'событий'}
            </span>
          )}
        </div>
        
        <div className="space-y-1 overflow-y-auto max-h-[60px]">
          {dayEvents.slice(0, 2).map(event => (
            <motion.div 
              key={event.id}
              whileHover={{ scale: 1.02 }}
              className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)} cursor-pointer border`}
              onClick={(e) => {
                e.stopPropagation();
                handleDateSelect(day);
                handleEditEvent(event);
              }}
            >
              {event.time} {event.title}
            </motion.div>
          ))}
          {dayEvents.length > 2 && (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-xs text-gray-500 text-center bg-gray-100 py-0.5 rounded cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDateSelect(day);
              }}
            >
              +{dayEvents.length - 2} ещё
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }, [events, currentMonth, selectedDate, handleDateSelect, getEventTypeColor, handleEditEvent]);

  // Отрисовка нескольких дней
  const renderDays = useCallback(() => {
    const days = getDaysInMonth();
    return days.map(day => renderDay(day));
  }, [getDaysInMonth, renderDay]);

  // Получение названия месяца на русском
  const getRussianMonth = useCallback(() => {
    return format(currentMonth, 'LLLL yyyy', { locale: ru });
  }, [currentMonth]);

  // Переход к текущему дню
  const goToToday = useCallback(() => {
    // Проверяем, идет ли редактирование
    if (isAddingEvent && newEvent.title.trim()) {
      if (!window.confirm('У вас есть несохраненные изменения. Продолжить без сохранения?')) {
        return; // Отменяем навигацию
      }
      // Сбрасываем форму если пользователь согласился
      resetForm();
    }
    
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  }, [isAddingEvent, newEvent, resetForm]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-primary-900">Календарь событий</h1>
        <p className="text-gray-600">
          Планирование учебных занятий и мероприятий для преподавателей и студентов
        </p>
      </div>

      {/* Навигация по календарю */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Предыдущий месяц"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            Сегодня
          </button>
        </div>
        
        <h2 className="text-xl font-medium text-gray-900 capitalize">
          {getRussianMonth()}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Следующий месяц"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Дни недели */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
          <div key={day} className="text-center py-2 font-medium text-gray-700 bg-gray-100 rounded">
            {day}
          </div>
        ))}
      </div>
      
      {/* Календарная сетка */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {renderDays()}
      </div>
      
      {/* Информация о выбранном дне */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-primary-800">
            {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ru })}
          </h3>
          
          {!isAddingEvent && (
            <button
              onClick={() => {
                // Инициализируем время текущим временем при добавлении нового события
                setNewEvent({
                  title: '',
                  description: '',
                  time: format(new Date(), 'HH:mm'),
                  type: 'lecture',
                  eventFor: 'all'
                });
                setIsAddingEvent(true);
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors mx-auto"
            >
              Добавить событие
            </button>
          )}
        </div>
        
        {isAddingEvent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSaveEvent}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Название события
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Введите название события"
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
                  value={newEvent.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Добавьте описание события"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Время
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={newEvent.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Тип события
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={newEvent.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="lecture">Лекция</option>
                    <option value="seminar">Семинар</option>
                    <option value="exam">Экзамен/Зачет</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="eventFor" className="block text-sm font-medium text-gray-700 mb-1">
                    Для кого
                  </label>
                  <select
                    id="eventFor"
                    name="eventFor"
                    value={newEvent.eventFor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">Все</option>
                    <option value="students">Студенты</option>
                    <option value="teachers">Преподаватели</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  {editingEventId !== null ? 'Сохранить изменения' : 'Добавить событие'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                  }}
                  className="py-2.5 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div>
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-lg border ${getEventTypeColor(event.type)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium">{event.title}</h4>
                        {event.description && (
                          <p className="mt-1 text-gray-700">{event.description}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {event.time}
                          </div>
                          <div className="flex items-center text-sm">
                            {getEventTypeIcon(event.type)}
                            {event.type === 'lecture' ? 'Лекция' : 
                             event.type === 'seminar' ? 'Семинар' : 
                             event.type === 'exam' ? 'Экзамен/Зачет' : 'Другое'}
                          </div>
                          <div className="flex items-center text-sm">
                            {getEventForIcon(event.eventFor)}
                            {event.eventFor === 'students' ? 'Для студентов' : 
                             event.eventFor === 'teachers' ? 'Для преподавателей' : 'Для всех'}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-1 text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-10 bg-gray-50 rounded-xl"
              >
                <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Нет событий</h3>
                <p className="text-gray-500 mb-4">
                  На выбранный день нет запланированных событий
                </p>
                <button
                  onClick={() => {
                    // Инициализируем время текущим временем при добавлении нового события
                    setNewEvent({
                      title: '',
                      description: '',
                      time: format(new Date(), 'HH:mm'),
                      type: 'lecture',
                      eventFor: 'all'
                    });
                    setIsAddingEvent(true);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors mx-auto"
                >
                  Добавить событие
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage; 