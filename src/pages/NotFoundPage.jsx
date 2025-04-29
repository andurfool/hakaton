import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="p-4 flex flex-col items-center justify-center h-[70vh]">
      <h1 className="text-3xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Страница не найдена</p>
      <Link 
        to="/"
        className="bg-primary-500 text-white px-4 py-2 rounded-lg"
      >
        На главную
      </Link>
    </div>
  );
};

export default NotFoundPage; 