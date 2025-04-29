import React, { useState } from 'react';
import { useWebApp } from '../contexts/WebAppContext';

const AIModelsPage = () => {
  const [expanded, setExpanded] = useState(null);
  const { openLink } = useWebApp();

  const models = [
    {
      id: 'yandexgpt',
      name: 'YandexGPT',
      description: 'Языковая модель от Яндекса, обученная на разнообразных русскоязычных текстах и адаптированная для решения широкого спектра задач.',
      link: 'https://yandex.ru/gpt',
      type: 'Языковая модель',
      company: 'Яндекс',
      details: 'YandexGPT - это семейство нейросетевых моделей для генерации и обработки текстов на русском языке. Модель обучена на обширном корпусе русскоязычных текстов, что делает ее особенно эффективной для работы с российскими реалиями и контекстом. Доступна через API для разработчиков и в составе сервиса Яндекс.Диалоги.',
      free: true,
      paid: true,
      icon: '🔍'
    },
    {
      id: 'gigachat',
      name: 'GigaChat',
      description: 'Крупная языковая модель от Сбера, оптимизированная для задач в русскоязычной среде с учетом российских культурных и правовых особенностей.',
      link: 'https://developers.sber.ru/portal/tools/gigachat',
      type: 'Языковая модель',
      company: 'Сбер',
      details: 'GigaChat - это мультимодальная модель, умеющая работать с текстом и изображениями. Она способна генерировать тексты различных жанров, отвечать на вопросы, писать код, делать краткие и развернутые пересказы. Обучена на русскоязычных данных с учетом российских законов и культурного контекста. Доступна как бесплатная и платная версии с различными уровнями возможностей.',
      free: true,
      paid: true,
      icon: '🟢'
    },
    {
      id: 'kandinsky',
      name: 'Kandinsky',
      description: 'Модель генерации изображений от российской компании Сбер, названная в честь русского художника Василия Кандинского.',
      link: 'https://fusionbrain.ai/kandinsky',
      type: 'Генерация изображений',
      company: 'Сбер AI',
      details: 'Kandinsky - это диффузионная модель для генерации изображений по текстовому описанию. Модель показывает высокое качество визуализации, особенно с запросами на русском языке. Последние версии (Kandinsky 3) значительно улучшены в плане детализации, реализма и понимания сложных многоступенчатых запросов. Модель доступна через API и веб-интерфейс.',
      free: true,
      paid: true,
      icon: '🎨'
    },
    {
      id: 'russiangpt',
      name: 'RussianGPT',
      description: 'Языковая модель, специально обученная на текстах на русском языке для создания высококачественного русскоязычного контента.',
      link: 'https://russiangpt.ru',
      type: 'Языковая модель',
      company: 'AI Russia',
      details: 'RussianGPT разработан с фокусом на российские культурные и исторические особенности. Модель понимает идиомы, культурные отсылки и региональный контекст, что делает ее идеальной для задач, требующих глубокого понимания русского языка. Особенно эффективна для образовательных задач, создания контента и анализа текстов.',
      free: true,
      paid: true,
      icon: '🇷🇺'
    },
    {
      id: 'telegram-bot-api',
      name: 'Telegram Bot API',
      description: 'Платформа для создания ботов в Telegram с возможностью интеграции с российскими AI-решениями.',
      link: 'https://core.telegram.org/bots/api',
      type: 'Платформа для ботов',
      company: 'Telegram',
      details: 'Telegram Bot API позволяет создавать интеллектуальных ботов, которые могут взаимодействовать с пользователями в Telegram. Платформа поддерживает интеграцию с российскими AI-сервисами через API, что делает ее отличным инструментом для создания образовательных и сервисных решений на базе российских нейросетей.',
      free: true,
      paid: false,
      icon: '✈️'
    },
    {
      id: 'silero',
      name: 'Silero',
      description: 'Российские модели для распознавания и синтеза речи с открытым исходным кодом, работающие на множестве языков.',
      link: 'https://silero.ai',
      type: 'Речевые технологии',
      company: 'Silero',
      details: 'Silero предлагает набор моделей с открытым исходным кодом для работы с речью. Модели Silero STT (Speech-to-Text) позволяют распознавать речь на многих языках, включая русский, английский и другие. Силеро может работать как в облаке, так и на локальных устройствах, что обеспечивает конфиденциальность данных. Особенно подходит для образовательных проектов и бизнес-приложений.',
      free: true,
      paid: true,
      icon: '🎤'
    },
    {
      id: 'ruclip',
      name: 'RuCLIP',
      description: 'Мультимодальная модель для соотнесения изображений с текстовыми описаниями на русском языке.',
      link: 'https://github.com/ai-forever/ru-clip',
      type: 'Мультимодальная модель',
      company: 'AI Russia',
      details: 'RuCLIP - это русскоязычная версия модели CLIP, способная понимать взаимосвязи между текстами и изображениями. Модель обучена на русскоязычных данных и может использоваться для поиска изображений по текстовому описанию, классификации изображений и других задач, связанных с обработкой визуального и текстового контента. Модель имеет открытый исходный код и доступна для некоммерческого использования.',
      free: true,
      paid: false,
      icon: '🖼️'
    },
    {
      id: 'vera',
      name: 'Виртуальный рекрутер Вера',
      description: 'Российская AI-система для автоматизации подбора персонала и проведения первичных собеседований.',
      link: 'https://ai.robotvera.com',
      type: 'HR-технология',
      company: 'Stafory',
      details: 'Виртуальный рекрутер Вера использует технологии искусственного интеллекта для автоматизации процессов найма. Система умеет проводить телефонные интервью, анализировать резюме, отвечать на вопросы кандидатов и оценивать соответствие соискателей требованиям вакансии. "Вера" экономит до 80% времени рекрутеров и позволяет обрабатывать большие объемы соискателей.',
      free: false,
      paid: true,
      icon: '👩‍💼'
    },
    {
      id: 'rubert',
      name: 'RuBERT',
      description: 'Русскоязычная версия языковой модели BERT, адаптированная для задач анализа и понимания текста на русском языке.',
      link: 'https://huggingface.co/ai-forever/ruBert-base',
      type: 'Языковая модель',
      company: 'AI Russia',
      details: 'RuBERT - это модель для анализа и понимания текстов на русском языке, основанная на архитектуре BERT. Модель предобучена на большом корпусе русскоязычных текстов и может использоваться для таких задач, как классификация текстов, анализ тональности, извлечение информации и ответы на вопросы. RuBERT показывает высокие результаты в задачах обработки естественного языка для русского языка.',
      free: true,
      paid: false,
      icon: '📊'
    },
    {
      id: 'nalogia',
      name: 'Налогия',
      description: 'Российская AI-система для автоматизации бухгалтерии и налогового учета с применением технологий машинного обучения.',
      link: 'https://nalogia.ru',
      type: 'Финтех',
      company: 'Налогия',
      details: 'Налогия использует искусственный интеллект для автоматизации бухгалтерских и налоговых процессов. Система умеет распознавать и классифицировать документы, извлекать из них информацию, формировать налоговые декларации и отчеты. Налогия учитывает российское законодательство и интегрируется с популярными бухгалтерскими программами. Решение особенно полезно для малого и среднего бизнеса.',
      free: false,
      paid: true,
      icon: '💼'
    }
  ];

  const handleExpandModel = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleOpenLink = (url, event) => {
    event.stopPropagation();
    openLink(url);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-primary-900">Российские нейросети</h1>
        <p className="text-gray-600">
          Обзор наиболее полезных и инновационных отечественных моделей искусственного интеллекта для различных задач.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {models.map((model) => (
          <div key={model.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div 
              className={`p-4 cursor-pointer ${expanded === model.id ? 'border-b border-gray-200' : ''}`}
              onClick={() => handleExpandModel(model.id)}
            >
              <div className="flex items-start">
                <div className="text-3xl mr-4 bg-primary-50 h-12 w-12 flex items-center justify-center rounded-full flex-shrink-0">
                  {model.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-primary-800">{model.name}</h2>
                    <div className={`w-8 h-8 flex items-center justify-center text-primary-500 transition-transform duration-200 ${expanded === model.id ? 'transform rotate-180' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">{model.company} • {model.type}</p>
                  <p className="text-gray-700 mt-2">{model.description}</p>
                </div>
              </div>
            </div>
            
            {expanded === model.id && (
              <div className="p-4 bg-gray-50">
                <div className="mb-4 text-gray-700 leading-relaxed">
                  {model.details}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {model.free && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Бесплатный доступ
                    </span>
                  )}
                  {model.paid && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Платные опции
                    </span>
                  )}
                </div>
                
                <button
                  onClick={(e) => handleOpenLink(model.link, e)}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex justify-center items-center font-medium transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14L21 3"></path>
                  </svg>
                  Перейти на сайт
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
        <h2 className="text-lg font-semibold text-primary-800 mb-2">Развитие российских AI-технологий</h2>
        <p className="text-gray-700">
          Отечественные разработки в сфере искусственного интеллекта активно развиваются и уже сейчас предлагают решения,
          конкурирующие с зарубежными аналогами. Российские модели особенно эффективны для работы с русским языком и 
          учитывают локальные особенности и нормативные требования.
        </p>
      </div>
    </div>
  );
};

export default AIModelsPage; 