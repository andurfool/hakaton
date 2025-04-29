import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useWebApp } from '../contexts/WebAppContext';
import axios from 'axios';
import HistoryList from '../components/HistoryList';

const HistoryPage = () => {
  const { requestHistory, loading, clearHistory, toggleFavorite } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  const { webApp } = useWebApp();

  useEffect(() => {
    // Загружаем историю запросов из чата с ботом через API
    const loadChatHistory = async () => {
      try {
        setIsLoading(true);
        console.log("Начинаем загрузку истории чата");
        
        // Сначала проверим, работает ли API
        try {
          const testResponse = await axios.get('/api/test');
          console.log("API test response:", testResponse.data);
        } catch (testError) {
          console.error("API test failed:", testError);
        }
        
        // Получаем ID пользователя из Telegram WebApp
        const userId = webApp?.initDataUnsafe?.user?.id || 'demo_user';
        console.log("User ID for history:", userId);
        
        // Получаем историю через наш новый API
        const response = await axios.get(`/api/history/${userId}`);
        console.log("History API response:", response.data);
        
        if (response.data.success) {
          setChatHistory(response.data.history);
        } else {
          setError('Не удалось загрузить историю чата');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки истории из чата:', error);
        setError(`Произошла ошибка при загрузке истории: ${error.message}`);
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [webApp]);

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">История</h1>
        {chatHistory.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-sm text-red-500"
          >
            Очистить
          </button>
        )}
      </div>

      {/* Используем наш компонент истории */}
      <HistoryList />
    </div>
  );
};

export default HistoryPage; 