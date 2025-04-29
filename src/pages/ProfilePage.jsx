import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useWebApp } from '../contexts/WebAppContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { userData, loading } = useUser();
  const { webApp, colorScheme } = useWebApp();
  const navigate = useNavigate();

  // Переход на страницу внутри приложения
  const navigateToPage = (path) => {
    navigate(path);
  };

  // Открытие ссылки в браузере Telegram
  const openLink = (url) => {
    if (webApp && webApp.openLink) {
      webApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  // Поделиться ботом
  const shareBot = () => {
    if (webApp) {
      // Ссылка на бота
      const botLink = 'https://t.me/hakatonNikits_bot/hakaton';
      
      // Текст для шеринга в зависимости от языка
      const shareText = getLocalizedText('share_text');
      
      // Генерируем текст для шеринга с ссылкой
      const fullShareText = `${shareText}\n${botLink}`;
      
      // Используем Telegram Web App API для шеринга
      if (webApp.openTelegramLink) {
        webApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(botLink)}&text=${encodeURIComponent(shareText)}`);
      } else if (navigator.share) {
        navigator.share({
          title: getLocalizedText('app_name'),
          text: fullShareText,
          url: botLink
        });
      } else {
        // Копируем в буфер обмена, если другие методы недоступны
        navigator.clipboard.writeText(fullShareText)
          .then(() => alert(getLocalizedText('link_copied')))
          .catch(err => console.error('Не удалось скопировать: ', err));
      }
    }
  };

  // Получение локализованного текста
  const getLocalizedText = (key) => {
    const language = userData?.settings?.language || 'ru';
    
    const translations = {
      'ru': {
        'app_name': 'Образовательный ассистент',
        'share_text': 'Попробуйте образовательного ассистента на базе ИИ! Он поможет создавать учебные материалы и отвечать на вопросы.',
        'link_copied': 'Ссылка скопирована в буфер обмена',
        'profile': 'Профиль',
        'share_bot': 'Поделиться ботом',
        'support': 'Поддержка',
        'about_app': 'О приложении',
        'version': 'Версия',
        'terms_of_service': 'Пользовательское соглашение',
        'privacy_policy': 'Политика конфиденциальности',
      },
      'en': {
        'app_name': 'Educational Assistant',
        'share_text': 'Try this AI-based educational assistant! It helps create educational materials and answers questions.',
        'link_copied': 'Link copied to clipboard',
        'profile': 'Profile',
        'share_bot': 'Share bot',
        'support': 'Support',
        'about_app': 'About',
        'version': 'Version',
        'terms_of_service': 'Terms of Service',
        'privacy_policy': 'Privacy Policy',
      },
      'zh': {
        'app_name': '教育助手',
        'share_text': '试试这个基于人工智能的教育助手！它可以帮助创建教育材料和回答问题。',
        'link_copied': '链接已复制到剪贴板',
        'profile': '个人资料',
        'share_bot': '分享机器人',
        'support': '支持',
        'about_app': '关于',
        'version': '版本',
        'terms_of_service': '服务条款',
        'privacy_policy': '隐私政策',
      }
    };
    
    return translations[language]?.[key] || translations['ru'][key] || key;
  };

  if (loading) {
    return <div className="p-4">{getLocalizedText('loading')}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{getLocalizedText('profile')}</h1>
      
      {userData ? (
        <>
          {/* Информация о пользователе */}
          <div className="bg-white rounded-xl shadow-soft p-4 mb-4">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl mr-4">
                {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{userData.firstName} {userData.lastName}</h2>
                {userData.username && <p className="text-gray-500">@{userData.username}</p>}
                <p className="text-xs text-gray-400 mt-1">ID: {userData.id}</p>
              </div>
            </div>
            
            {/* Кнопки действий */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button 
                onClick={shareBot}
                className="bg-primary-50 hover:bg-primary-100 text-primary-600 font-medium py-2 px-4 rounded-lg text-sm transition"
              >
                {getLocalizedText('share_bot')}
              </button>
              <button 
                onClick={() => openLink('https://t.me/andurfool')}
                className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-2 px-4 rounded-lg text-sm transition"
              >
                {getLocalizedText('support')}
              </button>
            </div>
          </div>
          
          {/* Информация о приложении */}
          <div className="bg-white rounded-xl shadow-soft p-4 mt-4">
            <h3 className="text-lg font-medium mb-3">{getLocalizedText('about_app')}</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-500">{getLocalizedText('version')}: </span>
                <span>1.0.0</span>
              </div>
              <div>
                <button 
                  onClick={() => navigateToPage('/terms-of-service')}
                  className="text-sm text-primary-600 block my-1"
                >
                  {getLocalizedText('terms_of_service')}
                </button>
                <button 
                  onClick={() => navigateToPage('/privacy-policy')}
                  className="text-sm text-primary-600 block my-1"
                >
                  {getLocalizedText('privacy_policy')}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-soft p-4 text-center">
          <p>{getLocalizedText('failed_to_load_profile')}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 