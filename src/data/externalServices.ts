import { ExternalLinkService } from '../types';

export const PART_MARKETPLACES: ExternalLinkService[] = [
  {
    name: 'Lalafo.kg (Запчасти & Стройматериалы)',
    type: 'parts',
    logoText: 'LL',
    badge: 'Кыргызстан 🇰🇬',
    color: 'from-emerald-500 to-teal-700',
    description: 'Главная доска объявлений Кыргызстана: новые и б/у запчасти, инструменты, сантехника от местных продавцов',
    getUrl: (query: string) => `https://lalafo.kg/kyrgyzstan/q-${encodeURIComponent(query)}`
  },
  {
    name: 'Wildberries KG',
    type: 'parts',
    logoText: 'WB',
    badge: 'Маркетплейс СНГ',
    color: 'from-purple-600 to-fuchsia-700',
    description: 'Огромный выбор деталей для смесителей, ТЭНов, ремкомплектов с пунктами выдачи во всех городах КР',
    getUrl: (query: string) => `https://www.wildberries.kg/catalog/0/search.aspx?search=${encodeURIComponent(query)}`
  },
  {
    name: 'Ozon KG',
    type: 'parts',
    logoText: 'OZ',
    badge: 'Маркетплейс',
    color: 'from-blue-600 to-blue-800',
    description: 'Быстрая доставка запчастей для бытовой техники, оригинальных комплектующих и инструмента',
    getUrl: (query: string) => `https://www.ozon.ru/search/?text=${encodeURIComponent(query)}&from_global=true`
  },
  {
    name: 'ВсеИнструменты.ру',
    type: 'parts',
    logoText: 'ВИ',
    badge: 'Спец. магазин & запчасти',
    color: 'from-amber-500 to-red-600',
    description: 'Профессиональный крепеж, сантехника, электрика, каталожные номера и схемы узлов',
    getUrl: (query: string) => `https://www.vseinstrumenti.ru/search/?what=${encodeURIComponent(query)}`
  },
  {
    name: 'Лемана ПРО (Леруа)',
    type: 'parts',
    logoText: 'LP',
    badge: 'Гипермаркет',
    color: 'from-emerald-500 to-green-700',
    description: 'Строительные материалы, фитинги, трубы, картриджи и электрика для дома',
    getUrl: (query: string) => `https://lemanapro.ru/search/?q=${encodeURIComponent(query)}`
  },
  {
    name: 'Авито (Запчасти)',
    type: 'parts',
    logoText: 'AV',
    badge: 'Запчасти и Б/У',
    color: 'from-teal-500 to-emerald-600',
    description: 'Оригинальные снятые детали, разбор бытовой техники, редкие комплектующие',
    getUrl: (query: string, city?: string) => `https://www.avito.ru/${city ? encodeURIComponent(city.toLowerCase()) : 'rossiya'}?q=${encodeURIComponent(query)}`
  }
];

export const MASTER_PLATFORMS: ExternalLinkService[] = [
  {
    name: 'Lalafo.kg Услуги (Мастера)',
    type: 'masters',
    logoText: 'LALAFO',
    badge: 'Кыргызстан 🇰🇬 Топ',
    color: 'from-emerald-600 to-teal-800',
    description: 'Частные сантехники, электрики и мастера по ремонту техники в Бишкеке, Оше и всех регионах КР',
    getUrl: (query: string) => `https://lalafo.kg/kyrgyzstan/uslugi/q-${encodeURIComponent(query)}`
  },
  {
    name: '2GIS Услуги & Мастера',
    type: 'masters',
    logoText: '2ГИС',
    badge: 'На карте рядом',
    color: 'from-lime-600 to-green-700',
    description: 'Сервисные центры и частные специалисты с рейтингом, номерами WhatsApp и отзывами на карте',
    getUrl: (query: string, city: string = 'Бишкек') => {
      const citySlug = city.toLowerCase().includes('ош') ? 'osh' : 'bishkek';
      return `https://2gis.kg/${citySlug}/search/${encodeURIComponent(query)}`;
    }
  },
  {
    name: 'Профи.ру (Profi)',
    type: 'masters',
    logoText: 'PROFI',
    badge: 'Проверенные профи',
    color: 'from-red-500 to-rose-700',
    description: 'Анкетированные мастера с верификацией, портфолио и реальными отзывами клиентов',
    getUrl: (query: string) => `https://profi.ru/remont/?text=${encodeURIComponent(query)}`
  },
  {
    name: 'Авито Услуги',
    type: 'masters',
    logoText: 'АВИТО',
    badge: 'СНГ биржа',
    color: 'from-teal-600 to-emerald-700',
    description: 'Частные мастера и бригады с фото выполненных работ и прямыми телефонами',
    getUrl: (query: string, city?: string) => `https://www.avito.ru/${city ? encodeURIComponent(city.toLowerCase()) : 'rossiya'}/predlozheniya_uslug?q=${encodeURIComponent(query)}`
  },
  {
    name: 'YouDo (Юду)',
    type: 'masters',
    logoText: 'YOUDO',
    badge: 'Быстрый отклик',
    color: 'from-blue-500 to-cyan-600',
    description: 'Создайте задачу со своей ценой и получайте предложения от свободных мастеров за 10 минут',
    getUrl: (query: string) => `https://youdo.com/search?q=${encodeURIComponent(query)}`
  }
];
