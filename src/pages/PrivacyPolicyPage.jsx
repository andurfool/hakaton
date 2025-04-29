import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebApp } from '../contexts/WebAppContext';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  const { webApp } = useWebApp();
  
  // Настраиваем кнопку "назад" в Telegram WebApp
  useEffect(() => {
    if (webApp?.BackButton) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => navigate(-1));
    }
    
    return () => {
      if (webApp?.BackButton) {
        webApp.BackButton.hide();
      }
    };
  }, [webApp, navigate]);

  return (
    <div className="p-4 pb-16">
      <h1 className="text-2xl font-bold mb-4">Политика конфиденциальности</h1>
      
      <div className="bg-white rounded-xl shadow-soft p-4 mb-4">
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">
            Последнее обновление: 28 апреля 2025 г.
          </p>
          
          <p className="mb-4">
            Настоящая Политика конфиденциальности описывает, как "Образовательный ассистент" 
            ("мы", "нас" или "наш") собирает, использует и раскрывает вашу личную информацию 
            при использовании нашего телеграм-бота и мини-приложения (далее - "Сервис").
          </p>
          
          <h2 className="text-xl font-semibold my-3">Какую информацию мы собираем</h2>
          
          <p className="mb-3">Мы собираем следующие типы информации:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Информация профиля Telegram:</strong> имя пользователя, имя, фамилия, 
              идентификатор пользователя и языковые настройки, предоставленные Telegram.
            </li>
            <li className="mb-2">
              <strong>Данные использования:</strong> история запросов, взаимодействие с ботом, 
              настройки пользователя и предпочтения.
            </li>
            <li className="mb-2">
              <strong>Контент:</strong> информация, которую вы предоставляете при взаимодействии с 
              ботом, включая запросы, вопросы и загруженные вами материалы.
            </li>
          </ul>
          
          <h2 className="text-xl font-semibold my-3">Как мы используем вашу информацию</h2>
          
          <p className="mb-3">Мы используем собранную информацию для:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Предоставления и персонализации нашего Сервиса</li>
            <li className="mb-2">Обработки ваших запросов и предоставления образовательных материалов</li>
            <li className="mb-2">Улучшения нашего Сервиса на основе вашего взаимодействия</li>
            <li className="mb-2">Хранения ваших настроек и предпочтений</li>
            <li className="mb-2">Связи с вами по поводу обновлений или изменений в Сервисе</li>
          </ul>
          
          <h2 className="text-xl font-semibold my-3">Передача данных третьим лицам</h2>
          
          <p className="mb-4">
            Мы можем передавать вашу информацию следующим третьим сторонам:
          </p>
          
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Поставщикам услуг ИИ:</strong> для обработки ваших запросов мы используем 
              модели искусственного интеллекта, предоставляемые проверенными партнерами.
            </li>
            <li className="mb-2">
              <strong>Аналитическим сервисам:</strong> для анализа использования нашего Сервиса 
              и улучшения его функциональности.
            </li>
          </ul>
          
          <h2 className="text-xl font-semibold my-3">Защита данных</h2>
          
          <p className="mb-4">
            Мы прилагаем разумные усилия для защиты вашей личной информации от 
            несанкционированного доступа, использования или раскрытия. Однако, помните, что 
            ни один метод передачи через интернет или метод электронного хранения не является 
            на 100% безопасным.
          </p>
          
          <h2 className="text-xl font-semibold my-3">Ваши права</h2>
          
          <p className="mb-4">
            В зависимости от вашего местоположения, вы можете иметь определенные права в отношении 
            ваших персональных данных, включая:
          </p>
          
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Право на доступ к вашей личной информации</li>
            <li className="mb-2">Право на исправление неточной информации</li>
            <li className="mb-2">Право на удаление ваших данных</li>
            <li className="mb-2">Право на ограничение обработки ваших данных</li>
          </ul>
          
          <p className="mb-4">
            Для осуществления этих прав, пожалуйста, свяжитесь с нами через бота поддержки.
          </p>
          
          <h2 className="text-xl font-semibold my-3">Изменения в этой Политике конфиденциальности</h2>
          
          <p className="mb-4">
            Мы можем обновлять нашу Политику конфиденциальности время от времени. Мы будем 
            уведомлять вас о любых изменениях, публикуя новую Политику конфиденциальности на этой 
            странице и, при существенных изменениях, отправляя вам уведомление.
          </p>
          
          <h2 className="text-xl font-semibold my-3">Контакты</h2>
          
          <p className="mb-4">
            Если у вас есть вопросы по поводу этой Политики конфиденциальности, пожалуйста, 
            свяжитесь с нами:
          </p>
          
          <ul className="list-none pl-0 mb-4">
            <li>По электронной почте: nikits@yandex.ru</li>
            <li>Через бот поддержки: @andurfool</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-4 flex">
        <button 
          onClick={() => navigate(-1)} 
          className="mx-auto px-6 py-2 bg-primary-600 text-white rounded-lg font-medium"
        >
          Вернуться назад
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 