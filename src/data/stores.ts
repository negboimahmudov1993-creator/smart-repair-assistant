import { StoreLocation } from '../types';

export interface CityPreset {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  stores: StoreLocation[];
}

export interface CountryGroup {
  id: string;
  name: string;
  flag: string;
  code: string;
  currency: string;
  currencyCode: string;
  cities: CityPreset[];
}

export const COUNTRIES: CountryGroup[] = [
  {
    id: 'kg',
    name: 'Кыргызстан',
    flag: '🇰🇬',
    code: 'KG',
    currency: 'сом',
    currencyCode: 'KGS',
    cities: [
      {
        id: 'bishkek',
        name: 'Бишкек',
        country: 'Кыргызстан 🇰🇬',
        lat: 42.8746,
        lng: 74.5698,
        stores: [
          {
            id: 'bsh1',
            name: 'Строймаркет «Комфорт»',
            type: 'hypermarket',
            address: 'ул. Ибраимова, 152 / ул. Кулатова',
            distanceKm: 1.2,
            lat: 42.8625,
            lng: 74.6185,
            phone: '+996 (312) 90-11-22',
            workingHours: '08:30 – 20:00',
            rating: 4.8,
            features: ['Сантехника', 'Электрика', 'Сухие смеси', 'Инструменты', 'Доставка']
          },
          {
            id: 'bsh2',
            name: 'ТРК «Дордой» (Строительный рынок / Ак-Суу)',
            type: 'hypermarket',
            address: 'ул. Кожобергенова / Объездная трасса',
            distanceKm: 4.5,
            lat: 42.9284,
            lng: 74.6291,
            phone: '+996 (555) 78-90-12',
            workingHours: '08:00 – 17:30',
            rating: 4.7,
            features: ['Оптовые и розничные цены', 'Любые редкие запчасти', 'Трубы и фитинги', 'Крепеж']
          },
          {
            id: 'bsh3',
            name: 'Гипермаркет «Баумаркет (Baumarket)»',
            type: 'hypermarket',
            address: 'ул. Анкара, 1/1 (Горького)',
            distanceKm: 2.8,
            lat: 42.8552,
            lng: 74.6432,
            phone: '+996 (312) 53-00-00',
            workingHours: '08:00 – 21:00',
            rating: 4.8,
            features: ['Электроинструмент', 'Сантехника', 'Краски', 'Парковка']
          },
          {
            id: 'bsh4',
            name: 'ТЦ «Таатан» (Стройматериалы & Сантехника)',
            type: 'specialized',
            address: 'ул. Лермонтова, 35А',
            distanceKm: 3.6,
            lat: 42.8835,
            lng: 74.6712,
            phone: '+996 (312) 69-55-55',
            workingHours: '09:00 – 19:00',
            rating: 4.7,
            features: ['Смесители', 'Картриджи', 'Сифоны', 'Фильтры для воды', 'Кабели']
          },
          {
            id: 'bsh5',
            name: 'Сеть инструментов «МегаМастер / Мастер KG»',
            type: 'tools',
            address: 'ул. Юнусалиева, 177 / пр. Чуй',
            distanceKm: 1.5,
            lat: 42.8421,
            lng: 74.6195,
            phone: '+996 (700) 12-34-56',
            workingHours: '08:30 – 19:30',
            rating: 4.9,
            features: ['Оригинальные расходники', 'Сверла', 'Ключи', 'Мультиметры', 'Диски']
          },
          {
            id: 'bsh6',
            name: 'Хозмаг у дома «Сантехника & Крепеж»',
            type: 'neighborhood',
            address: 'мкр. Асанбай, 52/1',
            distanceKm: 0.6,
            lat: 42.8294,
            lng: 74.6152,
            phone: '+996 (550) 44-55-66',
            workingHours: '08:00 – 21:00',
            rating: 4.6,
            features: ['Прокладки', 'Фум-лента', 'Клей', 'Лампочки', 'Крепеж поштучно']
          }
        ]
      },
      {
        id: 'osh',
        name: 'Ош',
        country: 'Кыргызстан 🇰🇬',
        lat: 40.5283,
        lng: 72.7985,
        stores: [
          {
            id: 'osh1',
            name: 'ТК «Келечек» (Строительные ряды)',
            type: 'hypermarket',
            address: 'ул. Ленина, 312',
            distanceKm: 1.5,
            lat: 40.5312,
            lng: 72.8021,
            phone: '+996 (3222) 5-67-89',
            workingHours: '08:00 – 18:00',
            rating: 4.7,
            features: ['Сантехника', 'Трубы ПВХ/ППР', 'Электрика', 'Крепеж']
          },
          {
            id: 'osh2',
            name: 'Строймаркет «Нур & Сантехника»',
            type: 'specialized',
            address: 'ул. Навои, 42',
            distanceKm: 0.9,
            lat: 40.5225,
            lng: 72.7912,
            phone: '+996 (555) 33-44-55',
            workingHours: '08:30 – 19:30',
            rating: 4.8,
            features: ['Картриджи', 'Смесители', 'Краны', 'Фильтры', 'Фитинги']
          },
          {
            id: 'osh3',
            name: 'Центр инструментов «Мастер Ош»',
            type: 'tools',
            address: 'ул. Курманжан Датка, 118',
            distanceKm: 1.1,
            lat: 40.5265,
            lng: 72.8085,
            phone: '+996 (700) 88-99-00',
            workingHours: '09:00 – 19:00',
            rating: 4.8,
            features: ['Электроинструмент', 'Расходники', 'Спецодежда']
          },
          {
            id: 'osh4',
            name: 'Хозмаг «Темир & Крепеж»',
            type: 'neighborhood',
            address: 'ул. Зайнабетдинова, 15',
            distanceKm: 0.5,
            lat: 40.5195,
            lng: 72.7952,
            phone: '+996 (552) 11-22-33',
            workingHours: '08:00 – 20:00',
            rating: 4.6,
            features: ['Метизы', 'Герметики', 'Клеммы', 'Лампочки']
          }
        ]
      },
      {
        id: 'kant',
        name: 'Кант',
        country: 'Кыргызстан 🇰🇬',
        lat: 42.8911,
        lng: 74.8508,
        stores: [
          {
            id: 'knt1',
            name: '«Кант-Строймаркет»',
            type: 'hypermarket',
            address: 'ул. Ленина, 54',
            distanceKm: 0.8,
            lat: 42.8925,
            lng: 74.8532,
            phone: '+996 (3132) 5-12-34',
            workingHours: '08:00 – 19:00',
            rating: 4.7,
            features: ['Цемент', 'Трубы', 'Провода', 'Крепеж', 'Инструменты']
          },
          {
            id: 'knt2',
            name: 'Магазин сантехники и электрики «Уста»',
            type: 'specialized',
            address: 'ул. Гагарина, 12',
            distanceKm: 0.4,
            lat: 42.8895,
            lng: 74.8485,
            phone: '+996 (550) 99-88-77',
            workingHours: '08:30 – 19:30',
            rating: 4.8,
            features: ['Смесители', 'Фитинги ППР', 'Автоматы', 'Кабели', 'Прокладки']
          },
          {
            id: 'knt3',
            name: 'Хозтовары & Крепеж «Береке»',
            type: 'neighborhood',
            address: 'ул. Центральная, 88',
            distanceKm: 0.3,
            lat: 42.8915,
            lng: 74.8512,
            phone: '+996 (708) 22-33-44',
            workingHours: '08:00 – 20:00',
            rating: 4.6,
            features: ['Фум-лента', 'Клей', 'Саморезы', 'Удлинители']
          }
        ]
      },
      {
        id: 'tokmok',
        name: 'Токмок',
        country: 'Кыргызстан 🇰🇬',
        lat: 42.8419,
        lng: 75.3015,
        stores: [
          {
            id: 'tkm1',
            name: 'Строймаркет «Токмок Сити»',
            type: 'hypermarket',
            address: 'ул. Ленина, 185',
            distanceKm: 0.9,
            lat: 42.8432,
            lng: 75.3034,
            phone: '+996 (3138) 6-12-34',
            workingHours: '08:30 – 19:00',
            rating: 4.7,
            features: ['Сантехника', 'Трубы', 'Инструменты', 'Электрика']
          },
          {
            id: 'tkm2',
            name: 'Магазин сантехники «Ак-Тилек»',
            type: 'specialized',
            address: 'ул. Дубовицкого, 42',
            distanceKm: 0.5,
            lat: 42.8405,
            lng: 75.2995,
            phone: '+996 (550) 11-22-99',
            workingHours: '08:00 – 19:30',
            rating: 4.8,
            features: ['Смесители', 'Фитинги', 'Картриджи', 'Прокладки']
          }
        ]
      },
      {
        id: 'jalalabad',
        name: 'Джалал-Абад',
        country: 'Кыргызстан 🇰🇬',
        lat: 40.9333,
        lng: 72.9833,
        stores: [
          {
            id: 'jab1',
            name: 'ТЦ «Азия Строй»',
            type: 'hypermarket',
            address: 'ул. Ленина, 150',
            distanceKm: 1.0,
            lat: 40.9352,
            lng: 72.9865,
            phone: '+996 (3722) 7-11-22',
            workingHours: '08:00 – 19:00',
            rating: 4.8,
            features: ['Сантехника', 'Электрика', 'Стройматериалы', 'Инструменты']
          },
          {
            id: 'jab2',
            name: 'Магазин «ЭлектроСантехника»',
            type: 'specialized',
            address: 'ул. Токтогула, 28',
            distanceKm: 0.7,
            lat: 40.9312,
            lng: 72.9795,
            phone: '+996 (555) 66-77-88',
            workingHours: '08:30 – 19:00',
            rating: 4.7,
            features: ['Картриджи', 'Шланги', 'Розетки', 'Автоматы защиты']
          },
          {
            id: 'jab3',
            name: 'Центр «Инструмент плюс KG»',
            type: 'tools',
            address: 'ул. Манаса, 45',
            distanceKm: 0.9,
            lat: 40.9341,
            lng: 72.9812,
            phone: '+996 (702) 33-44-55',
            workingHours: '09:00 – 19:00',
            rating: 4.8,
            features: ['Расходники', 'Сверла', 'Ключи', 'Герметики']
          }
        ]
      },
      {
        id: 'karakol',
        name: 'Каракол',
        country: 'Кыргызстан 🇰🇬',
        lat: 42.4907,
        lng: 78.3936,
        stores: [
          {
            id: 'krk1',
            name: 'Строймаркет «Иссык-Куль Строй»',
            type: 'hypermarket',
            address: 'ул. Торгоева, 65',
            distanceKm: 1.2,
            lat: 42.4925,
            lng: 78.3965,
            phone: '+996 (3922) 5-43-21',
            workingHours: '08:30 – 19:00',
            rating: 4.7,
            features: ['Трубы', 'Сантехника', 'Кабель', 'Утеплитель', 'Инструменты']
          },
          {
            id: 'krk2',
            name: '«Сантехник & Электрик Каракол»',
            type: 'specialized',
            address: 'ул. Ленина, 120',
            distanceKm: 0.6,
            lat: 42.4891,
            lng: 78.3912,
            phone: '+996 (557) 12-34-56',
            workingHours: '09:00 – 19:00',
            rating: 4.8,
            features: ['Запчасти к смесителям', 'Прокладки', 'Сифоны', 'Выключатели']
          },
          {
            id: 'krk3',
            name: 'Хозмаг «Мастер KG»',
            type: 'neighborhood',
            address: 'ул. Кутманалиева, 34',
            distanceKm: 0.4,
            lat: 42.4902,
            lng: 78.3945,
            phone: '+996 (703) 99-00-11',
            workingHours: '08:00 – 20:00',
            rating: 4.6,
            features: ['Крепеж', 'Фум-лента', 'Клей', 'Батарейки', 'Лампочки']
          }
        ]
      },
      {
        id: 'naryn',
        name: 'Нарын',
        country: 'Кыргызстан 🇰🇬',
        lat: 41.4286,
        lng: 75.9911,
        stores: [
          {
            id: 'nrn1',
            name: 'Строймаркет «Нарын-Ордо»',
            type: 'hypermarket',
            address: 'ул. Ленина, 88',
            distanceKm: 0.9,
            lat: 41.4312,
            lng: 75.9945,
            phone: '+996 (3522) 5-11-22',
            workingHours: '08:30 – 18:30',
            rating: 4.7,
            features: ['Отопление', 'Трубы', 'Сантехника', 'Утеплители', 'Электрика']
          },
          {
            id: 'nrn2',
            name: 'Магазин сантехники «Тенир-Тоо»',
            type: 'specialized',
            address: 'ул. Орозбакова, 45',
            distanceKm: 0.5,
            lat: 41.4278,
            lng: 75.9882,
            phone: '+996 (702) 44-55-66',
            workingHours: '09:00 – 19:00',
            rating: 4.6,
            features: ['Краны', 'Фитинги', 'Прокладки', 'Инструменты']
          }
        ]
      },
      {
        id: 'talas',
        name: 'Талас',
        country: 'Кыргызстан 🇰🇬',
        lat: 42.5228,
        lng: 72.2425,
        stores: [
          {
            id: 'tls1',
            name: 'Строймаркет «Талас-Мастер»',
            type: 'hypermarket',
            address: 'ул. Бердике Баатыра, 120',
            distanceKm: 0.8,
            lat: 42.5245,
            lng: 72.2458,
            phone: '+996 (3422) 5-22-33',
            workingHours: '08:30 – 19:00',
            rating: 4.7,
            features: ['Сантехника', 'Электрика', 'Сухие смеси', 'Крепеж']
          },
          {
            id: 'tls2',
            name: 'Магазин сантехники «Манас»',
            type: 'specialized',
            address: 'ул. Сарыгулова, 34',
            distanceKm: 0.4,
            lat: 42.5212,
            lng: 72.2405,
            phone: '+996 (558) 12-34-56',
            workingHours: '08:30 – 19:00',
            rating: 4.8,
            features: ['Смесители', 'Трубы ППР', 'Радиаторы', 'Картриджи']
          }
        ]
      },
      {
        id: 'batken',
        name: 'Баткен',
        country: 'Кыргызстан 🇰🇬',
        lat: 40.0553,
        lng: 70.8194,
        stores: [
          {
            id: 'btk1',
            name: 'Строймаркет «Баткен-Строй»',
            type: 'hypermarket',
            address: 'ул. Сайдимана, 56',
            distanceKm: 0.7,
            lat: 40.0568,
            lng: 70.8221,
            phone: '+996 (3622) 5-01-02',
            workingHours: '08:00 – 19:00',
            rating: 4.6,
            features: ['Сантехника', 'Трубы', 'Насосы', 'Электрика']
          },
          {
            id: 'btk2',
            name: 'Магазин сантехники и инструмента «Айгуль»',
            type: 'specialized',
            address: 'ул. Ленина, 29',
            distanceKm: 0.4,
            lat: 40.0542,
            lng: 70.8175,
            phone: '+996 (707) 33-22-11',
            workingHours: '08:30 – 19:30',
            rating: 4.7,
            features: ['Картриджи', 'Краны', 'Фильтры', 'Крепеж']
          }
        ]
      }
    ]
  },
  {
    id: 'kz',
    name: 'Казахстан',
    flag: '🇰🇿',
    code: 'KZ',
    currency: 'тенге',
    currencyCode: 'KZT',
    cities: [
      {
        id: 'almaty',
        name: 'Алматы',
        country: 'Казахстан 🇰🇿',
        lat: 43.2389,
        lng: 76.8897,
        stores: [
          {
            id: 'alm1',
            name: 'Леруа Мерлен (Лемана ПРО) Саина',
            type: 'hypermarket',
            address: 'пр-т Райымбека, 516',
            distanceKm: 2.8,
            lat: 43.2592,
            lng: 76.8421,
            phone: '+7 (727) 355-88-88',
            workingHours: '08:00 – 22:00',
            rating: 4.8,
            features: ['Сантехника', 'Электрика', 'Инструменты', 'Доставка']
          },
          {
            id: 'alm2',
            name: 'ТК «Саламат» (Строительный комплекс)',
            type: 'hypermarket',
            address: 'ул. Шевченко, 204',
            distanceKm: 1.6,
            lat: 43.2421,
            lng: 76.8912,
            phone: '+7 (727) 378-00-00',
            workingHours: '09:00 – 19:00',
            rating: 4.7,
            features: ['Смесители', 'Запчасти', 'Трубы', 'Фитинги', 'Кабель']
          }
        ]
      },
      {
        id: 'astana',
        name: 'Астана',
        country: 'Казахстан 🇰🇿',
        lat: 51.1694,
        lng: 71.4491,
        stores: [
          {
            id: 'ast1',
            name: 'Лемана ПРО (Леруа Мерлен) Астана',
            type: 'hypermarket',
            address: 'трасса Астана-Караганда, 40',
            distanceKm: 3.2,
            lat: 51.1852,
            lng: 71.4812,
            phone: '+7 (7172) 79-55-00',
            workingHours: '08:00 – 22:00',
            rating: 4.8,
            features: ['Сантехника', 'Отопление', 'Инструменты', 'Крепеж']
          },
          {
            id: 'ast2',
            name: 'ТД «Эталон» (Строительный рынок)',
            type: 'hypermarket',
            address: 'ул. Алаш, 22',
            distanceKm: 2.1,
            lat: 51.1942,
            lng: 71.4358,
            phone: '+7 (7172) 54-11-22',
            workingHours: '09:00 – 19:00',
            rating: 4.7,
            features: ['Трубы', 'Фитинги', 'Картриджи', 'Провода']
          }
        ]
      },
      {
        id: 'shymkent',
        name: 'Шымкент',
        country: 'Казахстан 🇰🇿',
        lat: 42.3417,
        lng: 69.5901,
        stores: [
          {
            id: 'shm1',
            name: 'Стройцентр «Аль-Фараби»',
            type: 'hypermarket',
            address: 'Тамерлановское шоссе, 19',
            distanceKm: 1.8,
            lat: 42.3385,
            lng: 69.5792,
            phone: '+7 (7252) 45-12-34',
            workingHours: '08:30 – 19:30',
            rating: 4.7,
            features: ['Сантехника', 'Кафель', 'Краски', 'Инструмент']
          },
          {
            id: 'shm2',
            name: 'Магазин сантехники «Су-Мастер»',
            type: 'specialized',
            address: 'ул. Байтурсынова, 88',
            distanceKm: 0.9,
            lat: 42.3452,
            lng: 69.6012,
            phone: '+7 (701) 55-44-33',
            workingHours: '09:00 – 19:00',
            rating: 4.8,
            features: ['Смесители', 'Прокладки', 'Шланги', 'Фильтры']
          }
        ]
      }
    ]
  },
  {
    id: 'uz',
    name: 'Узбекистан',
    flag: '🇺🇿',
    code: 'UZ',
    currency: 'сум',
    currencyCode: 'UZS',
    cities: [
      {
        id: 'tashkent',
        name: 'Ташкент',
        country: 'Узбекистан 🇺🇿',
        lat: 41.2995,
        lng: 69.2401,
        stores: [
          {
            id: 'tsh1',
            name: 'Стройцентр «Урикзор» (Urikzor)',
            type: 'hypermarket',
            address: 'Учтепинский р-н, ул. Фозилтепа',
            distanceKm: 3.5,
            lat: 41.2825,
            lng: 69.1712,
            phone: '+998 (71) 200-11-22',
            workingHours: '08:00 – 18:30',
            rating: 4.7,
            features: ['Все для ремонта', 'Оптом и в розницу', 'Сантехника', 'Электрика']
          },
          {
            id: 'tsh2',
            name: 'ТК «Джами» (Строительный рынок)',
            type: 'hypermarket',
            address: 'Алмазарский р-н, ул. Уста Ширин',
            distanceKm: 2.4,
            lat: 41.3412,
            lng: 69.2312,
            phone: '+998 (71) 248-00-00',
            workingHours: '08:30 – 19:00',
            rating: 4.8,
            features: ['Сантехника', 'Крепеж', 'Инструменты', 'Кабели']
          }
        ]
      },
      {
        id: 'samarkand',
        name: 'Самарканд',
        country: 'Узбекистан 🇺🇿',
        lat: 39.6542,
        lng: 66.9597,
        stores: [
          {
            id: 'smr1',
            name: 'Строительный комплекс «Сиаб Строй»',
            type: 'hypermarket',
            address: 'ул. Дагбитская, 42',
            distanceKm: 1.5,
            lat: 39.6585,
            lng: 66.9652,
            phone: '+998 (66) 233-11-22',
            workingHours: '08:00 – 19:00',
            rating: 4.7,
            features: ['Сантехника', 'Трубы', 'Инструменты', 'Электрика']
          },
          {
            id: 'smr2',
            name: 'Магазин сантехники «Уста Ремонт»',
            type: 'specialized',
            address: 'ул. Рудаки, 80',
            distanceKm: 0.8,
            lat: 39.6512,
            lng: 66.9534,
            phone: '+998 (90) 123-45-67',
            workingHours: '08:30 – 19:30',
            rating: 4.8,
            features: ['Смесители', 'Фитинги', 'Картриджи', 'Прокладки']
          }
        ]
      },
      {
        id: 'bukhara',
        name: 'Бухара',
        country: 'Узбекистан 🇺🇿',
        lat: 39.7747,
        lng: 64.4286,
        stores: [
          {
            id: 'bkh1',
            name: 'ТЦ «Бухоро Строй Маркет»',
            type: 'hypermarket',
            address: 'ул. Б. Накшбанди, 145',
            distanceKm: 1.2,
            lat: 39.7782,
            lng: 64.4325,
            phone: '+998 (65) 221-55-44',
            workingHours: '08:30 – 19:00',
            rating: 4.7,
            features: ['Сантехника', 'Кабель', 'Крепеж', 'Инструменты']
          }
        ]
      }
    ]
  },
  {
    id: 'ru',
    name: 'Россия',
    flag: '🇷🇺',
    code: 'RU',
    currency: 'руб.',
    currencyCode: 'RUB',
    cities: [
      {
        id: 'moscow',
        name: 'Москва',
        country: 'Россия 🇷🇺',
        lat: 55.7558,
        lng: 37.6173,
        stores: [
          {
            id: 'm1',
            name: 'Лемана ПРО (Леруа Мерлен) Сокольники',
            type: 'hypermarket',
            address: 'ул. Верхняя Красносельская, 3А',
            distanceKm: 1.4,
            lat: 55.7865,
            lng: 37.6658,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 23:00',
            rating: 4.8,
            features: ['Сантехника', 'Электрика', 'Распил', 'Парковка', 'Доставка']
          },
          {
            id: 'm2',
            name: 'ВсеИнструменты.ру Экспресс',
            type: 'tools',
            address: 'пр-т Мира, 112',
            distanceKm: 0.8,
            lat: 55.8085,
            lng: 37.6398,
            phone: '+7 (495) 730-35-00',
            workingHours: '08:00 – 21:00',
            rating: 4.9,
            features: ['Выдача за 15 мин', 'Запчасти в наличии', 'Крепеж', 'Инструмент']
          },
          {
            id: 'm3',
            name: 'СТД Петрович',
            type: 'hypermarket',
            address: 'ул. Докукина, 18, стр. 1',
            distanceKm: 2.3,
            lat: 55.8364,
            lng: 37.6578,
            phone: '+7 (499) 334-88-88',
            workingHours: 'Круглосуточно 24/7',
            rating: 4.9,
            features: ['Круглосуточно', 'Быстрая погрузка', 'Трубы и фитинги', 'Кабели']
          }
        ]
      },
      {
        id: 'spb',
        name: 'Санкт-Петербург',
        country: 'Россия 🇷🇺',
        lat: 59.9343,
        lng: 30.3351,
        stores: [
          {
            id: 'spb1',
            name: 'Лемана ПРО (Леруа Мерлен) Пулковское',
            type: 'hypermarket',
            address: 'Пулковское ш., 25, корп. 1',
            distanceKm: 2.5,
            lat: 59.8152,
            lng: 30.3185,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 23:00',
            rating: 4.8,
            features: ['Сантехника', 'Электрика', 'Инструменты', 'Доставка']
          },
          {
            id: 'spb2',
            name: 'Максидом Московский',
            type: 'hypermarket',
            address: 'Московский пр-т, 131',
            distanceKm: 1.2,
            lat: 59.8895,
            lng: 30.3212,
            phone: '+7 (812) 324-55-55',
            workingHours: '08:00 – 22:00',
            rating: 4.7,
            features: ['Товары для дома', 'Сантехника', 'Крепеж', 'Электрика']
          }
        ]
      },
      {
        id: 'novosibirsk',
        name: 'Новосибирск',
        country: 'Россия 🇷🇺',
        lat: 55.0084,
        lng: 82.9357,
        stores: [
          {
            id: 'nsk1',
            name: 'Лемана ПРО Фабричная',
            type: 'hypermarket',
            address: 'ул. Фабричная, 25',
            distanceKm: 1.6,
            lat: 55.0212,
            lng: 82.9124,
            phone: '+7 (800) 700-00-99',
            workingHours: '08:00 – 22:00',
            rating: 4.8,
            features: ['Сантехника', 'Отопление', 'Инструменты', 'Крепеж']
          },
          {
            id: 'nsk2',
            name: 'ВсеИнструменты.ру Красный Проспект',
            type: 'tools',
            address: 'Красный пр-т, 220, корп. 1',
            distanceKm: 2.1,
            lat: 55.0682,
            lng: 82.9158,
            phone: '+7 (383) 363-22-33',
            workingHours: '08:00 – 21:00',
            rating: 4.9,
            features: ['Электроинструмент', 'Крепеж', 'Запчасти', 'Расходники']
          }
        ]
      },
      {
        id: 'ekaterinburg',
        name: 'Екатеринбург',
        country: 'Россия 🇷🇺',
        lat: 56.8389,
        lng: 60.6057,
        stores: [
          {
            id: 'ekb1',
            name: 'Лемана ПРО Металлургов',
            type: 'hypermarket',
            address: 'ул. Металлургов, 70',
            distanceKm: 3.2,
            lat: 56.8245,
            lng: 60.4952,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 23:00',
            rating: 4.8,
            features: ['Сантехника', 'Отопление', 'Электрика', 'Инструмент']
          },
          {
            id: 'ekb2',
            name: 'ТК «Новомосковский» (Стройрынок)',
            type: 'hypermarket',
            address: 'ул. Металлургов, 70/1',
            distanceKm: 3.4,
            lat: 56.8228,
            lng: 60.4921,
            phone: '+7 (343) 243-55-66',
            workingHours: '09:00 – 19:00',
            rating: 4.7,
            features: ['Трубы', 'Фитинги', 'Смесители', 'Кровля', 'Кабели']
          },
          {
            id: 'ekb3',
            name: 'ВсеИнструменты.ру Малышева',
            type: 'tools',
            address: 'ул. Малышева, 145',
            distanceKm: 1.1,
            lat: 56.8412,
            lng: 60.6485,
            phone: '+7 (343) 384-55-00',
            workingHours: '08:00 – 21:00',
            rating: 4.9,
            features: ['Крепеж', 'Сантехника', 'Инструмент', 'Быстрая выдача']
          }
        ]
      },
      {
        id: 'kazan',
        name: 'Казань',
        country: 'Россия 🇷🇺',
        lat: 55.7961,
        lng: 49.1064,
        stores: [
          {
            id: 'kzn1',
            name: 'Лемана ПРО Амирхана',
            type: 'hypermarket',
            address: 'ул. Фатыха Амирхана, 3',
            distanceKm: 2.3,
            lat: 55.8215,
            lng: 49.1352,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 23:00',
            rating: 4.8,
            features: ['Сантехника', 'Краски', 'Плитка', 'Электрика']
          },
          {
            id: 'kzn2',
            name: 'Мегастрой Гаврилова',
            type: 'hypermarket',
            address: 'ул. Гаврилова, 5',
            distanceKm: 2.8,
            lat: 55.8362,
            lng: 49.1512,
            phone: '+7 (843) 299-02-02',
            workingHours: '08:00 – 22:00',
            rating: 4.7,
            features: ['Все для ремонта', 'Смесители', 'Трубы ППР', 'Инструменты']
          }
        ]
      },
      {
        id: 'nizhny-novgorod',
        name: 'Нижний Новгород',
        country: 'Россия 🇷🇺',
        lat: 56.3269,
        lng: 44.0059,
        stores: [
          {
            id: 'nn1',
            name: 'Лемана ПРО Московское шоссе',
            type: 'hypermarket',
            address: 'Московское ш., 352А',
            distanceKm: 3.5,
            lat: 56.3312,
            lng: 43.8615,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 23:00',
            rating: 4.8,
            features: ['Сантехника', 'Отопление', 'Инструменты', 'Доставка']
          },
          {
            id: 'nn2',
            name: 'Максидом Комсомольская площадь',
            type: 'hypermarket',
            address: 'Комсомольская пл., 2',
            distanceKm: 1.8,
            lat: 56.3025,
            lng: 43.9482,
            phone: '+7 (831) 212-11-11',
            workingHours: '08:00 – 22:00',
            rating: 4.7,
            features: ['Крепеж', 'Электрика', 'Смесители', 'Строительные смеси']
          }
        ]
      },
      {
        id: 'krasnodar',
        name: 'Краснодар',
        country: 'Россия 🇷🇺',
        lat: 45.0355,
        lng: 38.9753,
        stores: [
          {
            id: 'krd1',
            name: 'Бауцентр Ростовское шоссе',
            type: 'hypermarket',
            address: 'Ростовское ш., 28/7',
            distanceKm: 2.9,
            lat: 45.0882,
            lng: 38.9892,
            phone: '+7 (861) 228-88-00',
            workingHours: '08:00 – 22:00',
            rating: 4.8,
            features: ['Сантехника', 'Инструмент', 'Сад', 'Отопление', 'Крепеж']
          },
          {
            id: 'krd2',
            name: 'Лемана ПРО Новороссийская',
            type: 'hypermarket',
            address: 'ул. Новороссийская, 234',
            distanceKm: 3.1,
            lat: 45.0315,
            lng: 39.0628,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 23:00',
            rating: 4.8,
            features: ['Сантехника', 'Электрика', 'Плитка', 'Распил']
          }
        ]
      },
      {
        id: 'samara',
        name: 'Самара',
        country: 'Россия 🇷🇺',
        lat: 53.1959,
        lng: 50.1002,
        stores: [
          {
            id: 'smr_ru1',
            name: 'Лемана ПРО Дыбенко',
            type: 'hypermarket',
            address: 'ул. Дыбенко, 30',
            distanceKm: 2.1,
            lat: 53.2085,
            lng: 50.1985,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 23:00',
            rating: 4.8,
            features: ['Сантехника', 'Электрика', 'Инструмент', 'Парковка']
          },
          {
            id: 'smr_ru2',
            name: 'СатурнСтройМаркет Самара',
            type: 'hypermarket',
            address: 'Заводское ш., 11',
            distanceKm: 3.0,
            lat: 53.1912,
            lng: 50.2458,
            phone: '+7 (846) 279-22-22',
            workingHours: '08:00 – 20:00',
            rating: 4.7,
            features: ['Трубы', 'Профиль', 'Сухие смеси', 'Фитинги']
          }
        ]
      },
      {
        id: 'rostov-on-don',
        name: 'Ростов-на-Дону',
        country: 'Россия 🇷🇺',
        lat: 47.2357,
        lng: 39.7015,
        stores: [
          {
            id: 'rnd1',
            name: 'Лемана ПРО Аксай (МЕГА)',
            type: 'hypermarket',
            address: 'г. Аксай, Аксайский пр-т, 23',
            distanceKm: 4.1,
            lat: 47.2815,
            lng: 39.8542,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 23:00',
            rating: 4.8,
            features: ['Сантехника', 'Инструмент', 'Отопление', 'Крепеж']
          },
          {
            id: 'rnd2',
            name: 'ХДМ-Юг Строительный гипермаркет',
            type: 'hypermarket',
            address: 'ул. Доватора, 148',
            distanceKm: 3.2,
            lat: 47.2412,
            lng: 39.6328,
            phone: '+7 (863) 237-77-77',
            workingHours: '08:30 – 20:30',
            rating: 4.7,
            features: ['Смесители', 'Керамика', 'Электрика', 'Лаки']
          }
        ]
      },
      {
        id: 'ufa',
        name: 'Уфа',
        country: 'Россия 🇷🇺',
        lat: 54.7388,
        lng: 55.9721,
        stores: [
          {
            id: 'ufa1',
            name: 'Лемана ПРО Рубежная (МЕГА)',
            type: 'hypermarket',
            address: 'ул. Рубежная, 172',
            distanceKm: 3.8,
            lat: 54.6742,
            lng: 55.9312,
            phone: '+7 (800) 700-00-99',
            workingHours: '08:00 – 22:00',
            rating: 4.8,
            features: ['Сантехника', 'Инструменты', 'Кабели', 'Крепеж']
          },
          {
            id: 'ufa2',
            name: 'ТВК «Радуга Экспо»',
            type: 'hypermarket',
            address: 'Индустриальное ш., 44/1',
            distanceKm: 3.0,
            lat: 54.8012,
            lng: 56.0954,
            phone: '+7 (347) 292-28-00',
            workingHours: '09:00 – 20:00',
            rating: 4.7,
            features: ['Сантехника', 'Отопление', 'Двери', 'Плитка']
          }
        ]
      },
      {
        id: 'omsk',
        name: 'Омск',
        country: 'Россия 🇷🇺',
        lat: 54.9885,
        lng: 73.3242,
        stores: [
          {
            id: 'omsk1',
            name: 'Лемана ПРО Бульвар Архитекторов',
            type: 'hypermarket',
            address: 'бульвар Архитекторов, 35',
            distanceKm: 3.2,
            lat: 54.9652,
            lng: 73.2845,
            phone: '+7 (800) 700-00-99',
            workingHours: '08:00 – 22:00',
            rating: 4.8,
            features: ['Сантехника', 'Отопление', 'Инструменты', 'Электрика']
          },
          {
            id: 'omsk2',
            name: 'Бауцентр 10 лет Октября',
            type: 'hypermarket',
            address: 'ул. 10 лет Октября, 190',
            distanceKm: 2.7,
            lat: 54.9825,
            lng: 73.4358,
            phone: '+7 (3812) 77-72-22',
            workingHours: '08:00 – 22:00',
            rating: 4.7,
            features: ['Крепеж', 'Сантехника', 'Краски', 'Сад и огород']
          }
        ]
      },
      {
        id: 'krasnoyarsk',
        name: 'Красноярск',
        country: 'Россия 🇷🇺',
        lat: 56.0153,
        lng: 92.8932,
        stores: [
          {
            id: 'kras1',
            name: 'Лемана ПРО 9 Мая',
            type: 'hypermarket',
            address: 'ул. 9 Мая, 77',
            distanceKm: 2.8,
            lat: 56.0642,
            lng: 92.9158,
            phone: '+7 (800) 700-00-99',
            workingHours: '08:00 – 22:00',
            rating: 4.8,
            features: ['Сантехника', 'Отопление', 'Кабели', 'Инструменты']
          },
          {
            id: 'kras2',
            name: 'Сеть гипермаркетов «Вираж»',
            type: 'tools',
            address: 'ул. Северо-Енисейская, 40',
            distanceKm: 1.5,
            lat: 56.0312,
            lng: 92.8542,
            phone: '+7 (391) 290-20-00',
            workingHours: '08:00 – 21:00',
            rating: 4.9,
            features: ['Огромный выбор крепежа', 'Специнструмент', 'Электрика']
          }
        ]
      },
      {
        id: 'voronezh',
        name: 'Воронеж',
        country: 'Россия 🇷🇺',
        lat: 51.6608,
        lng: 39.2003,
        stores: [
          {
            id: 'vrn1',
            name: 'Лемана ПРО Сити-парк «Град»',
            type: 'hypermarket',
            address: 'пос. Солнечный, ул. Парковая, 3',
            distanceKm: 4.5,
            lat: 51.7852,
            lng: 39.2058,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 22:30',
            rating: 4.8,
            features: ['Сантехника', 'Электрика', 'Инструмент', 'Парковка']
          },
          {
            id: 'vrn2',
            name: 'СТД Петрович Воронеж',
            type: 'hypermarket',
            address: 'ул. Димитрова, 140',
            distanceKm: 3.1,
            lat: 51.6425,
            lng: 39.2812,
            phone: '+7 (473) 206-55-55',
            workingHours: 'Круглосуточно 24/7',
            rating: 4.9,
            features: ['Круглосуточно', 'Быстрая отгрузка', 'Сантехника', 'Трубы']
          }
        ]
      },
      {
        id: 'perm',
        name: 'Пермь',
        country: 'Россия 🇷🇺',
        lat: 58.0105,
        lng: 56.2502,
        stores: [
          {
            id: 'prm1',
            name: 'Лемана ПРО Шоссе Космонавтов',
            type: 'hypermarket',
            address: 'ш. Космонавтов, 393Б',
            distanceKm: 3.8,
            lat: 57.9452,
            lng: 56.1285,
            phone: '+7 (800) 700-00-99',
            workingHours: '08:00 – 22:00',
            rating: 4.8,
            features: ['Сантехника', 'Инструменты', 'Электрика', 'Сухие смеси']
          },
          {
            id: 'prm2',
            name: 'ТЦ «Евразия» Строймаркет',
            type: 'hypermarket',
            address: 'ул. Героев Хасана, 56',
            distanceKm: 2.4,
            lat: 57.9785,
            lng: 56.2742,
            phone: '+7 (342) 214-41-44',
            workingHours: '09:00 – 20:00',
            rating: 4.7,
            features: ['Смесители', 'Крепеж', 'Кабели', 'Плитка']
          }
        ]
      },
      {
        id: 'volgograd',
        name: 'Волгоград',
        country: 'Россия 🇷🇺',
        lat: 48.7080,
        lng: 44.5133,
        stores: [
          {
            id: 'vlg1',
            name: 'Лемана ПРО Университетский',
            type: 'hypermarket',
            address: 'пр-т Университетский, 107',
            distanceKm: 3.2,
            lat: 48.6521,
            lng: 44.4295,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 22:30',
            rating: 4.8,
            features: ['Сантехника', 'Отопление', 'Инструменты', 'Доставка']
          },
          {
            id: 'vlg2',
            name: 'ВсеИнструменты.ру Ленина',
            type: 'tools',
            address: 'пр-т им. В.И. Ленина, 65К',
            distanceKm: 1.5,
            lat: 48.7352,
            lng: 44.5412,
            phone: '+7 (8442) 43-44-00',
            workingHours: '08:00 – 21:00',
            rating: 4.9,
            features: ['Быстрая выдача', 'Крепеж', 'Сантехника', 'Кабель']
          }
        ]
      },
      {
        id: 'chelyabinsk',
        name: 'Челябинск',
        country: 'Россия 🇷🇺',
        lat: 55.1644,
        lng: 61.4368,
        stores: [
          {
            id: 'chlb1',
            name: 'Лемана ПРО Копейское шоссе',
            type: 'hypermarket',
            address: 'Копейское ш., 64',
            distanceKm: 3.6,
            lat: 55.1215,
            lng: 61.4785,
            phone: '+7 (800) 700-00-99',
            workingHours: '08:00 – 22:00',
            rating: 4.8,
            features: ['Сантехника', 'Электрика', 'Инструменты', 'Крепеж']
          },
          {
            id: 'chlb2',
            name: 'ТК «Перекресток» Строительный',
            type: 'hypermarket',
            address: 'Свердловский тракт, 5/1',
            distanceKm: 2.5,
            lat: 55.2012,
            lng: 61.3854,
            phone: '+7 (351) 791-55-22',
            workingHours: '09:00 – 19:30',
            rating: 4.7,
            features: ['Трубы', 'Фитинги', 'Смесители', 'Инструмент']
          }
        ]
      },
      {
        id: 'tyumen',
        name: 'Тюмень',
        country: 'Россия 🇷🇺',
        lat: 57.1530,
        lng: 65.5343,
        stores: [
          {
            id: 'tmn1',
            name: 'Лемана ПРО Менделеева',
            type: 'hypermarket',
            address: 'ул. Дмитрия Менделеева, 1',
            distanceKm: 2.6,
            lat: 57.1185,
            lng: 65.5582,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 23:00',
            rating: 4.8,
            features: ['Сантехника', 'Отопление', 'Инструменты', 'Электрика']
          },
          {
            id: 'tmn2',
            name: 'Сеть «Крепыж» Тюмень',
            type: 'tools',
            address: 'ул. 30 лет Победы, 33',
            distanceKm: 2.1,
            lat: 57.1265,
            lng: 65.5785,
            phone: '+7 (3452) 39-39-99',
            workingHours: '08:00 – 20:00',
            rating: 4.9,
            features: ['Все виды крепежа', 'Инструмент', 'Сантехника', 'Спецодежда']
          }
        ]
      },
      {
        id: 'sochi',
        name: 'Сочи',
        country: 'Россия 🇷🇺',
        lat: 43.6028,
        lng: 39.7342,
        stores: [
          {
            id: 'sochi1',
            name: 'ТЦ «СтройСити» на Донской',
            type: 'hypermarket',
            address: 'ул. Донская, 28',
            distanceKm: 1.8,
            lat: 43.6152,
            lng: 39.7215,
            phone: '+7 (862) 296-00-55',
            workingHours: '08:30 – 20:00',
            rating: 4.8,
            features: ['Сантехника', 'Плитка', 'Смесители', 'Фитинги', 'Инструменты']
          },
          {
            id: 'sochi2',
            name: 'Баумаркет Сочи',
            type: 'hypermarket',
            address: 'ул. Пластунская, 81',
            distanceKm: 2.2,
            lat: 43.6212,
            lng: 39.7358,
            phone: '+7 (862) 290-11-22',
            workingHours: '08:00 – 19:30',
            rating: 4.7,
            features: ['Электрика', 'Трубы ППР', 'Сухие смеси', 'Крепеж']
          },
          {
            id: 'sochi3',
            name: 'ВсеИнструменты.ру Сочи Центр',
            type: 'tools',
            address: 'ул. Транспортная, 28',
            distanceKm: 2.5,
            lat: 43.6095,
            lng: 39.7512,
            phone: '+7 (862) 225-88-00',
            workingHours: '08:00 – 21:00',
            rating: 4.9,
            features: ['Быстрая выдача за 15 мин', 'Расходники', 'Запчасти']
          }
        ]
      },
      {
        id: 'saratov',
        name: 'Саратов',
        country: 'Россия 🇷🇺',
        lat: 51.5335,
        lng: 46.0342,
        stores: [
          {
            id: 'sar1',
            name: 'Лемана ПРО Саратов',
            type: 'hypermarket',
            address: 'Усть-Курдюмское ш., 50',
            distanceKm: 3.5,
            lat: 51.5852,
            lng: 46.0954,
            phone: '+7 (800) 700-00-99',
            workingHours: '07:30 – 22:30',
            rating: 4.8,
            features: ['Сантехника', 'Инструменты', 'Кабели', 'Плитка']
          },
          {
            id: 'sar2',
            name: 'Стройбери Саратов',
            type: 'hypermarket',
            address: 'ул. им. Чернышевского Н.Г., 88',
            distanceKm: 1.6,
            lat: 51.5185,
            lng: 45.9985,
            phone: '+7 (8452) 29-44-00',
            workingHours: '08:30 – 20:00',
            rating: 4.7,
            features: ['Смесители', 'Фитинги', 'Крепеж', 'Краски']
          }
        ]
      },
      {
        id: 'vladivostok',
        name: 'Владивосток',
        country: 'Россия 🇷🇺',
        lat: 43.1155,
        lng: 131.8855,
        stores: [
          {
            id: 'vld1',
            name: 'ТЦ «Багратион» Строительный',
            type: 'hypermarket',
            address: 'ул. Русская, 87В',
            distanceKm: 3.2,
            lat: 43.1685,
            lng: 131.9312,
            phone: '+7 (423) 234-55-11',
            workingHours: '09:00 – 19:30',
            rating: 4.8,
            features: ['Сантехника', 'Электрика', 'Инструменты', 'Крепеж']
          },
          {
            id: 'vld2',
            name: 'ВсеИнструменты.ру Владивосток',
            type: 'tools',
            address: 'пр-т 100-летия Владивостока, 57Г',
            distanceKm: 2.8,
            lat: 43.1552,
            lng: 131.9125,
            phone: '+7 (423) 202-55-00',
            workingHours: '08:00 – 21:00',
            rating: 4.9,
            features: ['Инструмент', 'Расходники', 'Запчасти', 'Смесители']
          }
        ]
      },
      {
        id: 'irkutsk',
        name: 'Иркутск',
        country: 'Россия 🇷🇺',
        lat: 52.2870,
        lng: 104.3050,
        stores: [
          {
            id: 'irk1',
            name: 'Лемана ПРО Набережная',
            type: 'hypermarket',
            address: 'ул. Набережная Иркута, 1/1',
            distanceKm: 2.2,
            lat: 52.2985,
            lng: 104.2542,
            phone: '+7 (800) 700-00-99',
            workingHours: '08:00 – 22:00',
            rating: 4.8,
            features: ['Сантехника', 'Отопление', 'Инструменты', 'Электрика']
          },
          {
            id: 'irk2',
            name: 'Гипермаркет «Метр»',
            type: 'hypermarket',
            address: 'ул. Баррикад, 60/1',
            distanceKm: 2.5,
            lat: 52.3052,
            lng: 104.3285,
            phone: '+7 (3952) 48-77-77',
            workingHours: '08:30 – 20:00',
            rating: 4.7,
            features: ['Крепеж', 'Трубы ППР', 'Смесители', 'Сухие смеси']
          }
        ]
      }
    ]
  },
  {
    id: 'tj',
    name: 'Таджикистан',
    flag: '🇹🇯',
    code: 'TJ',
    currency: 'сомони',
    currencyCode: 'TJS',
    cities: [
      {
        id: 'dushanbe',
        name: 'Душанбе',
        country: 'Таджикистан 🇹🇯',
        lat: 38.5598,
        lng: 68.787,
        stores: [
          {
            id: 'dsh1',
            name: 'Строительный комплекс «Султони Кабир»',
            type: 'hypermarket',
            address: 'пр-т Н. Карабаева, 45',
            distanceKm: 2.1,
            lat: 38.5412,
            lng: 68.7695,
            phone: '+992 (44) 600-11-22',
            workingHours: '08:00 – 18:30',
            rating: 4.7,
            features: ['Сантехника', 'Трубы', 'Инструменты', 'Кабели']
          },
          {
            id: 'dsh2',
            name: 'ТЦ «Корвон Строй»',
            type: 'hypermarket',
            address: 'ул. Борбад, 102',
            distanceKm: 3.2,
            lat: 38.5285,
            lng: 68.7512,
            phone: '+992 (90) 777-88-99',
            workingHours: '08:30 – 18:00',
            rating: 4.6,
            features: ['Смесители', 'Фитинги', 'Картриджи', 'Прокладки']
          }
        ]
      },
      {
        id: 'khujand',
        name: 'Худжанд',
        country: 'Таджикистан 🇹🇯',
        lat: 40.2826,
        lng: 69.6222,
        stores: [
          {
            id: 'khj1',
            name: 'Строймаркет «Панджшанбе»',
            type: 'hypermarket',
            address: 'ул. Ленина, 158',
            distanceKm: 1.1,
            lat: 40.2852,
            lng: 69.6265,
            phone: '+992 (92) 888-33-44',
            workingHours: '08:00 – 19:00',
            rating: 4.7,
            features: ['Сантехника', 'Электрика', 'Инструменты', 'Крепеж']
          }
        ]
      }
    ]
  }
];

export const POPULAR_CITIES: CityPreset[] = COUNTRIES.flatMap((c) => c.cities);

export const DEFAULT_CITY = POPULAR_CITIES[0]; // Bishkek

export function getCountryForCity(cityName: string): CountryGroup | undefined {
  return COUNTRIES.find((country) =>
    country.cities.some((c) => c.name.toLowerCase() === cityName.toLowerCase())
  );
}

export function getCountryForStore(store: StoreLocation): CountryGroup | undefined {
  return COUNTRIES.find((country) =>
    country.cities.some((city) => city.stores.some((s) => s.id === store.id))
  );
}

export function getMapsNavigationUrl(store: StoreLocation, mapType: 'yandex' | 'gis' | 'google' = 'yandex'): string {
  if (mapType === 'gis') {
    const country = getCountryForStore(store);
    const domain = country?.id === 'ru' ? '2gis.ru' : country?.id === 'kz' ? '2gis.kz' : country?.id === 'uz' ? '2gis.uz' : '2gis.kg';
    return `https://${domain}/search/${encodeURIComponent(`${store.name} ${store.address}`)}`;
  }
  if (mapType === 'yandex') {
    return `https://yandex.ru/maps/?text=${encodeURIComponent(`${store.name} ${store.address}`)}&ll=${store.lng},${store.lat}&z=16`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
}

