import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoryList.css';

// Отображение в консоль для отладки
console.log("HistoryList component loaded");

const ACTION_ICONS = {
  'generate_task': '📝',
  'find_resources': '🔎',
  'answer_question': '❓',
  'create_lesson_plan': '📚',
  'get_checklist': '✅',
  'get_prompt_guide': '📋',
  'get_study_materials': '📚',
  'get_feedback': '📊',
  'create_test': '📑'
};

const ACTION_NAMES = {
  'generate_task': 'Генерация задания',
  'find_resources': 'Поиск ресурсов',
  'answer_question': 'Ответ на вопрос',
  'create_lesson_plan': 'План урока',
  'get_checklist': 'Чек-лист',
  'get_prompt_guide': 'Гайд запросов',
  'get_study_materials': 'Учебные материалы',
  'get_feedback': 'Обратная связь',
  'create_test': 'Создание теста'
};

// Тестовая история для отладки, если API не работает
const TEST_HISTORY = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    action_type: 'answer_question',
    query: 'Что такое машинное обучение?',
    response: 'Машинное обучение — это подраздел искусственного интеллекта, который фокусируется на использовании данных и алгоритмов для имитации способа обучения людей, постепенно улучшая свою точность.'
  },
  {
    id: '2', 
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    action_type: 'generate_task',
    query: 'Создай задание по программированию на Python',
    response: 'Задание: Напишите программу на Python, которая анализирует текстовый файл и выводит статистику по количеству слов, предложений и параграфов.'
  }
];

// Функция для форматирования Markdown-подобного текста
const formatResponse = (text) => {
  if (!text) return [];
  
  // Предварительная обработка для кодовых блоков
  let processedText = text;
  const codeBlockRegex = /```([\s\S]*?)```/g;
  const codeBlocks = [];
  
  // Сохраняем кодовые блоки отдельно и заменяем их на маркеры
  processedText = processedText.replace(codeBlockRegex, (match, code, index) => {
    const marker = `CODE_BLOCK_MARKER_${codeBlocks.length}`;
    codeBlocks.push(code);
    return marker;
  });
  
  // Разбиваем текст на абзацы
  const paragraphs = processedText.split('\n\n');
  
  // Обрабатываем каждый абзац
  return paragraphs.map((paragraph, index) => {
    // Пропускаем пустые абзацы
    if (!paragraph.trim()) return null;
    
    // Восстанавливаем кодовые блоки
    if (paragraph.includes('CODE_BLOCK_MARKER_')) {
      const blockIndex = parseInt(paragraph.match(/CODE_BLOCK_MARKER_(\d+)/)[1]);
      const code = codeBlocks[blockIndex];
      return (
        <pre key={`code-${index}`} className="response-code-block">
          <code>{code}</code>
        </pre>
      );
    }
    
    // Обработка заголовков (# Заголовок)
    if (paragraph.startsWith('# ')) {
      return (
        <h2 key={index} className="response-heading">
          {paragraph.substring(2)}
        </h2>
      );
    }
    
    // Обработка подзаголовков (## Подзаголовок)
    if (paragraph.startsWith('## ')) {
      return (
        <h3 key={index} className="response-subheading">
          {paragraph.substring(3)}
        </h3>
      );
    }
    
    // Обработка маркированных списков
    if (paragraph.includes('\n- ')) {
      const [listTitle, ...listItems] = paragraph.split('\n- ');
      return (
        <div key={index} className="response-list">
          {listTitle && listTitle.trim() && <p>{listTitle}</p>}
          <ul>
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    // Обработка нумерованных списков
    if (/\n\d+\. /.test(paragraph)) {
      const lines = paragraph.split('\n');
      const titleLine = lines[0].match(/^\d+\. /) ? '' : lines[0];
      const listItems = lines.filter(line => line.match(/^\d+\. /));
      
      return (
        <div key={index} className="response-list">
          {titleLine && <p>{titleLine}</p>}
          <ol>
            {listItems.map((item, itemIndex) => {
              const content = item.replace(/^\d+\.\s+/, '');
              return content ? <li key={itemIndex}>{content}</li> : null;
            })}
          </ol>
        </div>
      );
    }
    
    // Обработка встроенного кода
    if (paragraph.includes('`') && !paragraph.includes('```')) {
      const parts = paragraph.split('`');
      if (parts.length > 1) {
        return (
          <p key={index}>
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 0) {
                return part;
              } else {
                return <code key={`inline-code-${partIndex}`} className="inline-code">{part}</code>;
              }
            })}
          </p>
        );
      }
    }
    
    // Обработка обычных абзацев с возможностью содержания нескольких строк
    const lines = paragraph.split('\n');
    if (lines.length > 1) {
      return (
        <div key={index} className="response-multiline">
          {lines.map((line, lineIndex) => (
            <p key={lineIndex}>{line}</p>
          ))}
        </div>
      );
    }
    
    // Обычный абзац
    return <p key={index}>{paragraph}</p>;
  }).filter(Boolean); // Удаляем null элементы
};

const HistoryList = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [useTestData, setUseTestData] = useState(false);
  
  // Получаем ID пользователя из Telegram WebApp
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'demo_user';
  console.log("HistoryList - Current user ID:", userId);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        console.log("HistoryList - Fetching history for user:", userId);
        
        // Для отладки сначала проверим тестовый эндпоинт
        try {
          const testResponse = await axios.get('/api/test');
          console.log("HistoryList - API test response:", testResponse.data);
        } catch (testErr) {
          console.error("HistoryList - API test failed:", testErr);
        }
        
        const response = await axios.get(`/api/history/${userId}`);
        console.log("HistoryList - History response:", response.data);
        
        if (response.data.success) {
          // Сортируем историю по времени (новые сверху)
          const sortedHistory = response.data.history.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
          );
          
          // Добавляем поле isFavorite, если его нет
          const historyWithFavorites = sortedHistory.map(item => ({
            ...item,
            isFavorite: item.isFavorite || false
          }));
          
          setHistory(historyWithFavorites);
        } else {
          console.error("HistoryList - API returned error:", response.data);
          setError('Не удалось загрузить историю');
          setUseTestData(true);
        }
      } catch (err) {
        console.error("HistoryList - Error fetching history:", err);
        setError('Ошибка при загрузке истории: ' + err.message);
        setUseTestData(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [userId]);
  
  // Если включен режим тестовых данных, используем их
  useEffect(() => {
    if (useTestData) {
      console.log("HistoryList - Using test data instead");
      setHistory(TEST_HISTORY);
    }
  }, [useTestData]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };
  
  const toggleExpand = (id) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };
  
  if (loading) {
    return <div className="history-loading">Загрузка истории...</div>;
  }
  
  if (error && !useTestData) {
    return (
      <div className="history-error">
        <p>{error}</p>
        <button 
          onClick={() => setUseTestData(true)}
          className="test-data-button"
        >
          Показать тестовые данные
        </button>
      </div>
    );
  }
  
  if (history.length === 0) {
    return <div className="history-empty">История диалогов пуста</div>;
  }
  
  return (
    <div className="history-list">
      <h2>История диалогов {useTestData && '(тестовые данные)'}</h2>
      
      {history.map((item) => (
        <div 
          key={item.id} 
          className={`history-item ${expandedItem === item.id ? 'expanded' : ''}`}
          onClick={() => toggleExpand(item.id)}
        >
          <div className="history-item-header">
            <div className="history-item-icon">
              {ACTION_ICONS[item.action_type] || '🤖'}
            </div>
            <div className="history-item-info">
              <div className="history-item-title">
                {ACTION_NAMES[item.action_type] || 'Запрос к ассистенту'}
              </div>
              <div className="history-item-query">{item.query}</div>
              <div className="history-item-date">{formatDate(item.timestamp)}</div>
            </div>
          </div>
          
          {expandedItem === item.id && (
            <div className="history-item-content">
              <div className="history-query">
                <strong>Запрос</strong>
                <p>{item.query}</p>
              </div>
              <div className="history-response">
                <strong>Ответ</strong>
                <div className="response-content">
                  {formatResponse(item.response)}
                </div>
              </div>
              
              {/* Дополнительное действие для экспорта ответа */}
              <div style={{ textAlign: 'right', marginTop: '12px' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.navigator.clipboard.writeText(item.response);
                    alert('Ответ скопирован в буфер обмена');
                  }}
                  className="test-data-button"
                  style={{ 
                    fontSize: '13px', 
                    padding: '6px 12px',
                    backgroundColor: 'rgba(0, 136, 204, 0.8)'
                  }}
                >
                  Копировать ответ
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryList; 