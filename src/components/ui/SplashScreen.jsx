import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-tg-theme-bg">
      <div className="w-20 h-20 mb-4 relative">
        <div className="absolute inset-0 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
      <h1 className="text-2xl font-bold text-primary-600 mb-2">Образовательный Ассистент</h1>
      <p className="text-gray-500">Загрузка приложения...</p>
    </div>
  );
};

export default SplashScreen; 