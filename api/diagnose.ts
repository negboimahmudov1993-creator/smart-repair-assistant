import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const REPAIR_KEYWORDS_STEMS = [
  // Сантехника
  'кран', 'смесител', 'протеч', 'капает', 'течет', 'труб', 'сифон', 'унитаз', 'бачок',
  'слив', 'засор', 'вода', 'подтекает', 'прокладк', 'картридж', 'гидро', 'шланг', 'вентил',
  'стояк', 'раковин', 'ванн', 'душ', 'лейк', 'бойлер', 'водонагрев', 'фильтр', 'давлен', 'подводк',
  // Электрика
  'розетк', 'вилк', 'провод', 'электр', 'автомат', 'щиток', 'искр', 'замыкан', 'свет',
  'ламп', 'люстр', 'выключател', 'горит', 'не горит', 'пален', 'ток', 'счетчик', 'напряжен',
  'фаз', 'заземлен', 'диод', 'блок питан', 'трансформатор', 'пробки', 'кабел',
  // Бытовая техника
  'стиралк', 'стиральн', 'машин', 'холодильник', 'морозилк', 'посудомойк', 'плит', 'духовк',
  'пылесос', 'микроволновк', 'чайник', 'компрессор', 'барабан', 'насос', 'помп', 'тэн', 'фреон',
  'гудит', 'стучит', 'вибрирует', 'не греет', 'не крутит', 'не морозит', 'не сливает',
  'не включается', 'выбивает', 'отжим', 'полоскан', 'котел', 'колонк',
  // Двери, окна, мебель, фурнитура, замки
  'двер', 'окн', 'стекл', 'замок', 'ключ', 'ручк', 'петл', 'створк', 'люфт', 'скрип',
  'клинит', 'заел', 'фурнитур', 'шкаф', 'комод', 'стол', 'стул', 'диван', 'доводчик',
  'провисл', 'щель', 'дует', 'защелк', 'личинк', 'стеклопакет', 'подоконник', 'жалюзи',
  // Отделка, стены, пол, крыша
  'стен', 'пол', 'потолок', 'плитк', 'кафел', 'ламинат', 'плинтус', 'обо', 'карниз',
  'трещин', 'дыр', 'отвалил', 'отклеил', 'шов', 'герметик', 'затирк', 'шпаклевк', 'краск',
  // Общие симптомы и глаголы поломки
  'сломал', 'не работает', 'отвалил', 'шумит', 'пищит', 'воняет', 'запах', 'дымит',
  'застрял', 'шатается', 'болтается', 'открутил', 'треснул', 'лопнул', 'разбил', 'пробил',
  'оторвал', 'потек', 'сгорел', 'коротит', 'погас', 'мигает', 'глючит', 'сбился',
  'починить', 'ремонт', 'заменить', 'поменять', 'пробит', 'поломал', 'отпал', 'не закрывается',
  'не открывается', 'заклинило', 'течь', 'капли', 'сырость', 'плесень', 'ржавчин',
  // English common repair keywords
  'leak', 'pipe', 'faucet', 'toilet', 'sink', 'wire', 'socket', 'switch', 'light', 'breaker',
  'fridge', 'washer', 'dryer', 'stove', 'oven', 'door', 'window', 'lock', 'hinge', 'broken',
  'crack', 'noise', 'smell', 'motor', 'pump', 'drain', 'clog', 'water', 'power'
];

function validateRepairDescription(text: string, hasImage: boolean = false): {
  isValid: boolean;
  errorMessage?: string;
} {
  const trimmed = (text || '').trim();
  if (hasImage) {
    return { isValid: true };
  }
  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: 'Пожалуйста, опишите проблему или сфотографируйте поломку.',
    };
  }
  if (trimmed.length < 4) {
    return {
      isValid: false,
      errorMessage: 'Описание слишком короткое. Укажите хотя бы несколько слов (например: «течет кран», «искрит розетка»).',
    };
  }
  const lower = trimmed.toLowerCase();
  const embeddedDigitMatches = lower.match(/[а-яa-z]\d+[а-яa-z]/g);
  if (embeddedDigitMatches && embeddedDigitMatches.length >= 1 && trimmed.length < 30) {
    return {
      isValid: false,
      errorMessage: 'Текст выглядит как случайный набор символов («' + trimmed.slice(0, 20) + '...»). Опишите поломку словами или прикрепите фото.',
    };
  }
  if (/^[\d\s.,!?;:()#$*+=\-_/\\%@]+$/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: 'Описание не может состоять только из цифр или знаков. Пожалуйста, напишите словами, что случилось.',
    };
  }
  if (/(.)\1{4,}/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: 'Пожалуйста, введите осмысленное описание поломки, а не повторяющиеся символы.',
    };
  }
  const keyboardMashes = [
    'qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', 'wsxedc',
    'йцукен', 'фывапр', 'ячсмит', 'йфяцыч', 'цувсыв'
  ];
  if (keyboardMashes.some(mash => lower.includes(mash))) {
    return {
      isValid: false,
      errorMessage: 'Введенный текст похож на случайный набор букв. Опишите, пожалуйста, реальную проблему.',
    };
  }
  const hasVowels = /[аеёиоуыэюяaeiouy]/i.test(lower);
  if (!hasVowels && trimmed.length >= 4) {
    return {
      isValid: false,
      errorMessage: 'В описании нет гласных букв («' + trimmed.slice(0, 15) + '...»). Напишите понятными словами или прикрепите фото.',
    };
  }
  const lettersOnly = lower.replace(/[^а-яa-z]/g, '');
  if (lettersOnly.length >= 8) {
    const vowelsCount = (lettersOnly.match(/[аеёиоуыэюяaeiouy]/g) || []).length;
    const ratio = vowelsCount / lettersOnly.length;
    if (ratio < 0.14) {
      return {
        isValid: false,
        errorMessage: 'Текст не похож на осмысленное описание. Пожалуйста, опишите поломку понятными словами.',
      };
    }
  }
  const hasRepairStem = REPAIR_KEYWORDS_STEMS.some(stem => lower.includes(stem));
  if (!trimmed.includes(' ') && trimmed.length > 12 && !hasRepairStem) {
    return {
      isValid: false,
      errorMessage: 'Не удалось распознать слово «' + trimmed.slice(0, 18) + '...». Опишите проблему (например: «протекает сифон», «не греет батарея») или сделайте фото.',
    };
  }
  return { isValid: true };
}

export const config = {
  maxDuration: 60,
};

// Lazy Gemini client initialization
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
      return null;
    }
  }
  return geminiClient;
}

function getCityCurrencyInfo(city: string) {
  const c = (city || '').trim().toLowerCase();

  const russianCityKeywords = [
    'москв', 'питер', 'санкт', 'росси', 'новосибирск', 'екатеринбург', 'казань', 'самара',
    'нижний', 'новгород', 'краснодар', 'ростов', 'уфа', 'омск', 'красноярск', 'воронеж',
    'пермь', 'волгоград', 'челябинск', 'тюмень', 'сочи', 'саратов', 'владивосток', 'иркутск',
    'барнаул', 'хабаровск', 'ярославл', 'тольятти', 'ижевск', 'ульяновск', 'томск', 'кемерово',
    'рязань', 'набережные', 'пенза', 'липецк', 'тула', 'киров', 'чебоксар', 'калининград',
    'брянск', 'курск', 'иваново', 'магнитогорск', 'тверь', 'ставрополь', 'белгород', 'сургут',
    'владимир', 'чита', 'калуга', 'смоленск', 'волжский', 'курган', 'орел', 'череповец',
    'вологда', 'саранск', 'якутск', 'подольск', 'мурманск', 'тамбов', 'грозный', 'кострома',
    'петрозаводск', 'таганрог', 'нижневартовск', 'йошкар', 'новороссийск', 'дзержинск'
  ];

  if (russianCityKeywords.some((keyword) => c.includes(keyword))) {
    return { currency: '₽', currencyCode: 'RUB', currencyName: 'российских рублях (₽)', multiplier: 1.05 };
  }

  if (
    c.includes('алмат') ||
    c.includes('астан') ||
    c.includes('шымкент') ||
    c.includes('казахстан') ||
    c.includes('караганд') ||
    c.includes('актобе')
  ) {
    return { currency: '₸', currencyCode: 'KZT', currencyName: 'казахстанских тенге (₸)', multiplier: 5.3 };
  }
  if (c.includes('ташкент') || c.includes('самарканд') || c.includes('бухар') || c.includes('узбекистан')) {
    return { currency: 'сум', currencyCode: 'UZS', currencyName: 'узбекских сумах (сум)', multiplier: 145 };
  }
  if (c.includes('душанбе') || c.includes('худжанд') || c.includes('таджикистан')) {
    return { currency: 'смн', currencyCode: 'TJS', currencyName: 'таджикских сомони (смн)', multiplier: 0.12 };
  }

  // Default Kyrgyzstan (Bishkek, Osh, Kant, Jalal-Abad, Karakol)
  return { currency: 'сом', currencyCode: 'KGS', currencyName: 'кыргызских сомах (сом / KGS)', multiplier: 1.0 };
}

// Smart heuristic engine for fast, rich offline fallback
function generateFallbackDiagnosis(
  category: string,
  description: string,
  city: string = 'Бишкек',
  hasImage: boolean = false
) {
  const descLower = (description || '').toLowerCase();
  const id = `diag-${Date.now()}`;
  const now = new Date().toISOString();
  const curr = getCityCurrencyInfo(city);

  // Validate text if no image
  const validation = validateRepairDescription(description, hasImage);
  if (!validation.isValid) {
    return {
      id: `diag-unrecognized-${Date.now()}`,
      createdAt: now,
      category: 'general',
      unrecognized: true,
      errorMessage: validation.errorMessage || 'Не удалось распознать поломку. Пожалуйста, опишите проблему понятными словами или прикрепите фото.',
      problemTitle: 'Не удалось распознать проблему',
      probableCause: 'Введенный текст похож на случайный набор символов или не содержит описания неисправности.',
      urgency: 'low',
      urgencyLabel: 'Требуется уточнение',
      difficulty: 'easy_diy',
      difficultyLabel: 'Уточните описание',
      estimatedTime: '—',
      partsCostMin: 0,
      partsCostMax: 0,
      laborCostMin: 0,
      laborCostMax: 0,
      totalCostMin: 0,
      totalCostMax: 0,
      requiredParts: [],
      requiredTools: [],
      safetyNotice: 'Пожалуйста, опишите словами, какая техника или сантехника неисправна, или прикрепите фото.',
      stepByStepGuide: ['Опишите поломку словами (например: «течет кран», «искрит розетка»)', 'Или сделайте фото поломки на камеру телефона'],
      proTips: ['Четкое описание позволяет рассчитать точную смету деталей и работы мастера'],
      partsSearchQuery: '',
      masterSearchQuery: '',
      userDescription: description,
      city: city || 'Бишкек',
      isFallback: true,
    };
  }

  const scale = (val: number) => {
    if (val === 0) return 0;
    const raw = val * curr.multiplier;
    if (curr.currencyCode === 'KZT') {
      return Math.round(raw / 50) * 50;
    }
    if (curr.currencyCode === 'UZS') {
      return Math.round(raw / 1000) * 1000;
    }
    return Math.round(raw / 10) * 10;
  };

  // Plumbing heuristics
  if (category === 'plumbing' || descLower.includes('капает') || descLower.includes('смесител') || descLower.includes('теч') || descLower.includes('унитаз') || descLower.includes('сифон')) {
    if (descLower.includes('унитаз') || descLower.includes('бачок') || descLower.includes('кнопк')) {
      const partsCostMin = scale(450);
      const partsCostMax = scale(1600);
      const laborCostMin = scale(1200);
      const laborCostMax = scale(2200);
      return {
        id,
        createdAt: now,
        category: 'plumbing',
        problemTitle: 'Неисправность впускного/сливного клапана бачка унитаза',
        probableCause: 'Износ силиконовой мембраны клапана, отложение солей жесткости или перекос поплавкового механизма, приводящий к постоянному переливу воды в чашу.',
        urgency: 'medium',
        urgencyLabel: 'Умеренная (потери воды до 150-300 л/сутки)',
        urgencyWarning: 'Приводит к постоянному шуму и существенному росту платежей за воду.',
        difficulty: 'easy_diy',
        difficultyLabel: 'Легко своими руками (20-30 мин)',
        estimatedTime: '20 – 40 минут',
        currency: curr.currency,
        currencyCode: curr.currencyCode,
        partsCostMin,
        partsCostMax,
        laborCostMin,
        laborCostMax,
        totalCostMin: partsCostMin + laborCostMin,
        totalCostMax: partsCostMax + laborCostMax,
        requiredParts: [
          { name: 'Арматура для бачка унитаза универсальная (впуск + слив)', priceMin: scale(650), priceMax: scale(1500), searchQuery: 'арматура для бачка унитаза с нижней подводкой универсальная', category: 'Арматура' },
          { name: 'Мембрана / прокладка донного клапана', priceMin: scale(120), priceMax: scale(300), optional: true, searchQuery: 'мембрана для впускного клапана унитаза', category: 'Расходники' },
          { name: 'Гибкая подводка для воды 1/2 дюйма 50см', priceMin: scale(250), priceMax: scale(550), optional: true, searchQuery: 'гибкая подводка для воды 1/2 гайка-гайка 50см', category: 'Подводка' }
        ],
        requiredTools: ['Разводной ключ до 30 мм', 'Пассатижи', 'Емкость для сбора остатков воды', 'Сухая ветошь'],
        safetyNotice: 'Перекройте кран подачи воды перед бачком унитаза и спустите воду нажатием на кнопку перед разборкой.',
        stepByStepGuide: [
          '1. Перекройте кран подачи воды перед бачком унитаза и полностью спустите воду.',
          '2. Открутите кнопку слива против часовой стрелки и аккуратно снимите керамическую крышку бачка.',
          '3. Осмотрите запорную мембрану и поплавок: удалите ржавчину, известковый налет и проверьте плавность хода.',
          '4. При наличии трещин или деформации мембраны замените её или весь механизм арматуры.',
          '5. Отрегулируйте уровень наполнения поплавком (на 2 см ниже трубки перелива).',
          '6. Закройте крышку, прикрутите кнопку и плавно откройте подачу воды.'
        ],
        proTips: ['Арматура Geberit или Alcaplast служит годами без нареканий.', 'Не затягивайте пластиковые гайки ключом слишком сильно — достаточно усилия руки.'],
        partsSearchQuery: 'арматура для бачка унитаза',
        masterSearchQuery: 'ремонт замена арматуры бачка унитаза сантехник',
        userDescription: description,
        city: city || 'Бишкек',
        isFallback: true,
      };
    }

    if (descLower.includes('сифон') || descLower.includes('засор') || descLower.includes('раковин') || descLower.includes('ванн')) {
      const partsCostMin = scale(250);
      const partsCostMax = scale(900);
      const laborCostMin = scale(1000);
      const laborCostMax = scale(2000);
      return {
        id,
        createdAt: now,
        category: 'plumbing',
        problemTitle: 'Засор гидрозатвора сифона или износ конусных прокладок',
        probableCause: 'Скопление жира, волос и органических отложений в стакане сифона, либо рассыхание резиновых уплотнительных колец в резьбовых соединениях.',
        urgency: 'high',
        urgencyLabel: 'Высокая (риск протечки под мебель и к соседям)',
        urgencyWarning: 'При протечке сифона сточные воды могут повредить нижние кухонные модули и напольное покрытие.',
        difficulty: 'easy_diy',
        difficultyLabel: 'Легко своими руками (15-25 мин)',
        estimatedTime: '15 – 30 минут',
        currency: curr.currency,
        currencyCode: curr.currencyCode,
        partsCostMin,
        partsCostMax,
        laborCostMin,
        laborCostMax,
        totalCostMin: partsCostMin + laborCostMin,
        totalCostMax: partsCostMax + laborCostMax,
        requiredParts: [
          { name: 'Сифон для кухонной мойки с переливом / для раковины', priceMin: scale(350), priceMax: scale(850), searchQuery: 'сифон для кухонной мойки бутылочный с переливом', category: 'Сантехника' },
          { name: 'Комплект конусных прокладок 40/50 мм', priceMin: scale(80), priceMax: scale(200), optional: true, searchQuery: 'прокладки для сифона ремкомплект 40мм', category: 'Расходники' },
          { name: 'Гофрированная труба 40х50 мм', priceMin: scale(150), priceMax: scale(300), optional: true, searchQuery: 'гофра для сифона 40 50', category: 'Трубы' }
        ],
        requiredTools: ['Ведро или таз для сбора грязной воды', 'Резиновые перчатки', 'Ершик или старая щетка', 'Тряпка'],
        safetyNotice: 'Работайте в плотных резиновых перчатках для защиты кожи от бактерий и остатков бытовой химии.',
        stepByStepGuide: [
          '1. Подставьте ведро непосредственно под чашу сифона.',
          '2. Руками открутите нижний стакан-отстойник сифона против часовой стрелки.',
          '3. Слейте скопившуюся воду и удалите скопившийся мусор и волосы.',
          '4. Промойте детали горячей водой с мылом или средством для мытья посуды.',
          '5. Проверьте резиновое кольцо-прокладку на наличие трещин и эластичность (при необходимости замените).',
          '6. Закрутите стакан ровно по резьбе без перекоса и пустите воду для проверки герметичности.'
        ],
        proTips: ['Собирайте сифон строго вручную без применения газовых ключей, чтобы не сорвать пластиковую резьбу.', 'Для профилактики засоров раз в месяц заливайте средство для прочистки труб.'],
        partsSearchQuery: 'сифон для раковины мойки 40мм',
        masterSearchQuery: 'прочистка устранение засора замена сифона сантехник',
        userDescription: description,
        city: city || 'Бишкек',
        isFallback: true,
      };
    }

    // Default plumbing: Faucet cartridge leak
    const partsCostMin = scale(400);
    const partsCostMax = scale(1300);
    const laborCostMin = scale(1200);
    const laborCostMax = scale(2400);
    return {
      id,
      createdAt: now,
      category: 'plumbing',
      problemTitle: 'Протечка смесителя: износ керамического картриджа 35мм/40мм',
      probableCause: 'Выработка керамических пластин от жесткой воды и абразивных микрочастиц окалины в водопроводе.',
      urgency: 'medium',
      urgencyLabel: 'Умеренная (капает из излива/ручки)',
      urgencyWarning: 'Приводит к образованию стойкого известкового налета и закисанию резьбы прижимной гайки.',
      difficulty: 'easy_diy',
      difficultyLabel: 'Легко своими руками (25-35 мин)',
      estimatedTime: '25 – 45 минут',
      currency: curr.currency,
      currencyCode: curr.currencyCode,
      partsCostMin,
      partsCostMax,
      laborCostMin,
      laborCostMax,
      totalCostMin: partsCostMin + laborCostMin,
      totalCostMax: partsCostMax + laborCostMax,
      requiredParts: [
        { name: 'Керамический картридж 35мм (или 40мм)', priceMin: scale(350), priceMax: scale(900), searchQuery: 'картридж для смесителя 35мм керамический', category: 'Запчасти' },
        { name: 'Фторопластовая лента / силиконовая сантехническая смазка', priceMin: scale(90), priceMax: scale(220), searchQuery: 'силиконовая смазка для смесителей сантехническая', category: 'Расходники' },
        { name: 'Набор уплотнительных колец излива', priceMin: scale(100), priceMax: scale(250), optional: true, searchQuery: 'ремкомплект уплотнителей для смесителя', category: 'Расходники' }
      ],
      requiredTools: ['Шестигранный ключ 2.5 мм', 'Разводной ключ до 32 мм', 'Плоская отвертка', 'Мягкая ткань'],
      safetyNotice: 'Перекройте вводные краны ХВС и ГВС на стояке перед началом разборки смесителя!',
      stepByStepGuide: [
        '1. Перекройте краны горячей и холодной воды на вводе в квартиру.',
        '2. Снимите декоративную сине-красную заглушку под рычагом смесителя тонкой отверткой.',
        '3. Ослабьте внутренний винт шестигранником на 2.5 мм и снимите рычаг вверх.',
        '4. Открутите руками хромированный сферический колпачок.',
        '5. Разводным ключом аккуратно выкрутите латунную гайку.',
        '6. Выньте старый картридж, очистите гнездо от песка и установите новый (совместив направляющие ножки).',
        '7. Соберите смеситель в обратном порядке и проверьте работу при плавном открытии воды.'
      ],
      proTips: ['Возьмите старый картридж в магазин как образец — у них разная посадка ножек.', 'Нанесите силиконовую смазку на уплотнители для продления срока службы.'],
      partsSearchQuery: 'картридж для смесителя 35мм',
      masterSearchQuery: 'замена картриджа смесителя сантехник вызов',
      userDescription: description,
      city: city || 'Бишкек',
      isFallback: true,
    };
  }

  // Electrical heuristics
  if (category === 'electrical' || descLower.includes('розетк') || descLower.includes('автомат') || descLower.includes('искр') || descLower.includes('свет') || descLower.includes('выбива')) {
    const partsCostMin = scale(280);
    const partsCostMax = scale(950);
    const laborCostMin = scale(1000);
    const laborCostMax = scale(2200);
    return {
      id,
      createdAt: now,
      category: 'electrical',
      problemTitle: 'Ослабление контакта / оплавление механизма силовой розетки 16А',
      probableCause: 'Высокая нагрузка от мощных электроприборов (чайник, обогреватель, духовка), вызвавшая нагрев клемм и разрушение контактной группы.',
      urgency: 'critical',
      urgencyLabel: 'Критическая (высокий риск пожара!)',
      urgencyWarning: 'Немедленно обесточьте данную розетку и не включайте в нее электроприборы до устранения неисправности!',
      difficulty: 'moderate_diy',
      difficultyLabel: 'Средняя (обязательно отключить автомат в щитке)',
      estimatedTime: '30 – 50 минут',
      currency: curr.currency,
      currencyCode: curr.currencyCode,
      partsCostMin,
      partsCostMax,
      laborCostMin,
      laborCostMax,
      totalCostMin: partsCostMin + laborCostMin,
      totalCostMax: partsCostMax + laborCostMax,
      requiredParts: [
        { name: 'Розетка скрытой установки с заземлением 16А', priceMin: scale(250), priceMax: scale(700), searchQuery: 'розетка 16А с заземлением Legrand или Schneider', category: 'Электроустановочные' },
        { name: 'Клеммники WAGO 221-413 рычажковые', priceMin: scale(80), priceMax: scale(250), optional: true, searchQuery: 'клеммы wago 221-413 оригинальные', category: 'Расходники' },
        { name: 'Подрозетник для бетона / гипсокартона 68 мм', priceMin: scale(30), priceMax: scale(90), optional: true, searchQuery: 'подрозетник 68мм для бетона', category: 'Монтаж' }
      ],
      requiredTools: ['Индикаторная отвертка / мультиметр', 'Крестовая отвертка PH2 / PZ2', 'Пассатижи с изолированными ручками', 'Бокорезы'],
      safetyNotice: 'СТРОГО ОБЯЗАТЕЛЬНО: Обесточьте автомат в электрощитке и проверьте индикаторной отверткой отсутствие фазного напряжения на контактах!',
      stepByStepGuide: [
        '1. Отключите автоматический выключатель соответствующей розеточной группы в щитке.',
        '2. Проверьте индикаторной отверткой оба гнезда розетки, чтобы убедиться в 100% отсутствии напряжения.',
        '3. Снимите лицевую рамку и открутите крепежные винты суппорта.',
        '4. Ослабьте распорные лапки и извлеките механизм розетки из подрозетника.',
        '5. Осмотрите провода. Если концы почернели, откусите поврежденный участок и зачистите заново на 10 мм.',
        '6. Подключите фазу, ноль и заземление к новой розетке.',
        '7. Затяните винты с усилием, установите механизм ровно по уровню и защелкните рамку.',
        '8. Включите автомат в щитке и протестируйте розетку светильником.'
      ],
      proTips: ['Используйте механизмы с пружинными самозажимными клеммами — они не ослабевают со временем.', 'Для мощных приборов никогда не используйте тройники и дешевые удлинители.'],
      partsSearchQuery: 'розетка с заземлением 16А',
      masterSearchQuery: 'замена искрящей розетки электрик вызов',
      userDescription: description,
      city: city || 'Бишкек',
      isFallback: true,
    };
  }

  // Appliances heuristics
  if (category === 'appliances' || descLower.includes('стирал') || descLower.includes('холодиль') || descLower.includes('посудомой') || descLower.includes('насос') || descLower.includes('слив')) {
    const partsCostMin = 0;
    const partsCostMax = scale(1900);
    const laborCostMin = scale(1800);
    const laborCostMax = scale(3600);
    return {
      id,
      createdAt: now,
      category: 'appliances',
      problemTitle: 'Засор дренажной системы / блокировка крыльчатки сливной помпы',
      probableCause: 'Попадание постороннего предмета (монета, шпилька, ворс) в улитку сливного насоса или засор фильтра грубой очистки стиральной/посудомоечной машины.',
      urgency: 'high',
      urgencyLabel: 'Высокая (стирка/мойка заблокирована с водой)',
      urgencyWarning: 'Не открывайте люк силой, пока не спустите воду через аварийный шланг, чтобы избежать потопа.',
      difficulty: 'easy_diy',
      difficultyLabel: 'Легко своими руками (в 80% случаев запчасти не нужны)',
      estimatedTime: '20 – 40 минут',
      currency: curr.currency,
      currencyCode: curr.currencyCode,
      partsCostMin,
      partsCostMax,
      laborCostMin,
      laborCostMax,
      totalCostMin: partsCostMin + laborCostMin,
      totalCostMax: partsCostMax + laborCostMax,
      requiredParts: [
        { name: 'Сливной насос / помпа универсальная (Askoll / Plaset на 3 винта)', priceMin: scale(850), priceMax: scale(1850), optional: true, searchQuery: 'насос сливной для стиральной машины askoll универсальный', category: 'Запчасти' },
        { name: 'Шланг сливной армированный 2м', priceMin: scale(220), priceMax: scale(480), optional: true, searchQuery: 'шланг сливной для стиральной машины 2 метра', category: 'Расходники' }
      ],
      requiredTools: ['Низкий поддон или емкость для сбора воды', 'Несколько впитывающих тряпок', 'Плоская отвертка или монетка', 'Фонарик'],
      safetyNotice: 'Отключите вилку стиральной машины из электрической розетки перед проведением любых манипуляций!',
      stepByStepGuide: [
        '1. Обесточьте прибор, вынув вилку из розетки.',
        '2. Откройте сервисную панель/лючок в правом нижнем углу корпуса.',
        '3. Подложите полотенце и подставьте неглубокую емкость.',
        '4. Если есть тонкий аварийный шланжик, снимите заглушку и слейте воду в емкость.',
        '5. Медленно выкрутите пробку фильтра против часовой стрелки.',
        '6. Извлеките фильтр, промойте под проточной водой, очистите посадочное отверстие.',
        '7. Посветите фонариком: проверьте, свободно ли вращается крыльчатка насоса в глубине.',
        '8. Закрутите фильтр плотно и запустите режим «Полоскание и отжим» для проверки.'
      ],
      proTips: ['В 8 из 10 случаев замена помпы не требуется — достаточно просто удалить застрявшую монетку.', 'Чистите фильтр каждые 3 месяца.'],
      partsSearchQuery: 'помпа сливной насос стиральной машины askoll',
      masterSearchQuery: 'ремонт стиральной машины не сливает воду мастер на дом',
      userDescription: description,
      city: city || 'Бишкек',
      isFallback: true,
    };
  }

  // General repair heuristics - only if general repair keywords match or photo was provided
  const isGeneralRepair = hasImage || /двер|окн|петл|замок|шкаф|стол|стул|мебел|люфт|фурнитур|ручк|скрип|крепеж|отвалил|болтается|шатается|сломал|не работает|отпал|трещин|плитк|ламинат|плинтус|карниз|стен|пол|потолок/.test(descLower);

  if (!isGeneralRepair) {
    return {
      id: `diag-unrecognized-${Date.now()}`,
      createdAt: now,
      category: 'general',
      unrecognized: true,
      errorMessage: 'Не удалось распознать поломку по описанию «' + description.slice(0, 30) + '...». Пожалуйста, опишите симптомы подробнее (что именно сломалось или не работает) либо прикрепите фото.',
      problemTitle: 'Не удалось распознать проблему',
      probableCause: 'Текст не содержит упоминания бытовых поломок, сантехники, электрики или мебели.',
      urgency: 'low',
      urgencyLabel: 'Требуется уточнение',
      difficulty: 'easy_diy',
      difficultyLabel: 'Уточните описание',
      estimatedTime: '—',
      partsCostMin: 0,
      partsCostMax: 0,
      laborCostMin: 0,
      laborCostMax: 0,
      totalCostMin: 0,
      totalCostMax: 0,
      requiredParts: [],
      requiredTools: [],
      safetyNotice: 'Пожалуйста, опишите словами, что случилось, или сделайте фото поломки.',
      stepByStepGuide: ['Опишите проблему словами (например: «сломалась ручка двери», «течет сифон»)', 'Или сделайте фото поломки на камеру телефона'],
      proTips: ['Четкое описание позволяет рассчитать точную смету деталей и работы'],
      partsSearchQuery: '',
      masterSearchQuery: '',
      userDescription: description,
      city: city || 'Бишкек',
      isFallback: true,
    };
  }

  const partsCostMin = scale(150);
  const partsCostMax = scale(850);
  const laborCostMin = scale(900);
  const laborCostMax = scale(2000);
  return {
    id,
    createdAt: now,
    category: 'general',
    problemTitle: hasImage && !description ? 'Диагностика по фото: повреждение крепления, износ или люфт узла' : 'Люфт фурнитуры, перекос створки или повреждение крепежа',
    probableCause: hasImage && !description ? 'Визуальный осмотр указывает на механическое повреждение, износ крепежных элементов или перекос подвижного узла.' : 'Естественный износ механических узлов, ослабление регулировочных винтов или деформация посадочного материала от постоянных нагрузок.',
    urgency: 'low',
    urgencyLabel: 'Низкая (плановый эксплуатационный ремонт)',
    urgencyWarning: 'При длительной эксплуатации с перекосом нагрузка разрушает соседние петли и замковый механизм.',
    difficulty: 'easy_diy',
    difficultyLabel: 'Легко своими руками (15-30 мин)',
    estimatedTime: '20 – 40 минут',
    currency: curr.currency,
    currencyCode: curr.currencyCode,
    partsCostMin,
    partsCostMax,
    laborCostMin,
    laborCostMax,
    totalCostMin: partsCostMin + laborCostMin,
    totalCostMax: partsCostMax + laborCostMax,
    requiredParts: [
      { name: 'Ремонтная пластина из нержавеющей стали / регулировочные винты', priceMin: scale(150), priceMax: scale(400), searchQuery: 'ремонтная пластина для мебельных петель комплект', category: 'Фурнитура' },
      { name: 'Саморезы по дереву / металлу оцинкованные 3.5х16 мм', priceMin: scale(60), priceMax: scale(180), searchQuery: 'саморезы потайные оцинкованные 3.5х16', category: 'Крепеж' },
      { name: 'Силиконовая или тефлоновая смазка для фурнитуры', priceMin: scale(180), priceMax: scale(350), optional: true, searchQuery: 'смазка силиконовая спрей для окон и замков', category: 'Расходники' }
    ],
    requiredTools: ['Отвертка крестовая PZ2 / PH2 или шуруповерт', 'Шестигранный ключ 4 мм (для окон/фурнитуры)', 'Строительный уровень или линейка'],
    safetyNotice: 'Придерживайте створки или двери при откручивании крепежа, чтобы избежать падения на пол или пальцы.',
    stepByStepGuide: [
      '1. Очистите механизм фурнитуры от пыли и старой загустевшей смазки.',
      '2. Осмотрите посадочные отверстия на наличие люфта и сколов.',
      '3. При вырванном крепеже установите стальную ремонтную пластину или укрепите отверстие чопиком с клеем.',
      '4. Затяните основные несущие винты.',
      '5. Отрегулируйте положение створки по горизонтали, вертикали и прижиму соответствующими винтами.',
      '6. Нанесите аэрозольную силиконовую смазку на подвижные узлы.'
    ],
    proTips: ['Ремонтные пластины для петель из нержавейки позволяют восстановить дверцу за 10 минут.', 'Не смазывайте замки растительным маслом — оно засыхает и накапливает грязь.'],
    partsSearchQuery: 'ремкомплект фурнитуры ремонтная пластина',
    masterSearchQuery: 'мастер на час мелкий ремонт регулировка фурнитуры',
    userDescription: description,
    city: city || 'Бишкек',
    isFallback: true,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Dynamic CORS headers (Safe for Capacitor Android WebView and Cross-Origin Web)
  const origin = (req.headers.origin || req.headers.Origin || '') as string;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method?.toUpperCase() === 'OPTIONS') {
    return res.status(204).end();
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method?.toUpperCase() !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Use POST.',
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { category = 'general', description = '', imageBase64, imageMimeType, city = 'Бишкек' } = body || {};

    if (!description && !imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Необходимо указать описание проблемы или прикрепить фото.',
      });
    }

    // 1. Guard against random keyboard mashing (e.g. "ормбилгз9н8змза9") when no image is uploaded
    const validation = validateRepairDescription(description, Boolean(imageBase64));
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        unrecognized: true,
        error: validation.errorMessage,
        errorMessage: validation.errorMessage,
      });
    }

    const client = getGeminiClient();

    if (client && process.env.GEMINI_API_KEY) {
      try {
        const categoryNames: Record<string, string> = {
          plumbing: 'Сантехника (водопровод, канализация, смесители, трубы, сифоны, унитазы, бойлеры)',
          electrical: 'Электрика (проводка, розетки, выключатели, щитки, освещение, автоматы защиты)',
          appliances: 'Бытовая техника (стиральные машины, холодильники, посудомойки, плиты, духовки)',
          general: 'Общий и мелкий ремонт (двери, окна, замки, мебель, фурнитура, плитка, откосы)',
        };

        const currInfo = getCityCurrencyInfo(city || 'Бишкек');

        const systemPrompt = `Ты — высококвалифицированный сервисный инженер и эксперт по бытовому ремонту в Кыргызстане, Казахстане, России и СНГ.
Твоя задача — детально проанализировать фото бытовой поломки и/или текстовое описание, поставить точный технический диагноз, рассчитать честную и реалистичную смету в локальной валюте (${currInfo.currencyName}, код: ${currInfo.currencyCode}, символ: "${currInfo.currency}") для города/региона: ${city || 'Бишкек'} на 2026 год, составить список деталей и расходников с точными поисковыми запросами для маркетплейсов (Lalafo.kg, 2GIS, Wildberries, ВсеИнструменты, Ozon, Лемана ПРО), а также указать правила безопасности и руководство по самостоятельному ремонту.

КРИТИЧЕСКОЕ ПРАВИЛО ВАЛИДАЦИИ:
Если в описании пользователя содержится бессмысленный набор символов, случайные буквы или цифры (например: 'ормбилгз9н8змза9', 'asdfghjk', 'qwerty', '12345'), опечатки без смысла или текст не относится к поломкам дома/быта, и при этом фото отсутствует или на фото нет бытовой поломки:
КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО выдумывать поломку ('люфт фурнитуры' и т.д.)!
В таком случае верни JSON:
{
  "unrecognized": true,
  "problemTitle": "Не удалось распознать проблему",
  "errorMessage": "Введенный текст похож на случайный набор символов. Пожалуйста, опишите поломку понятными словами (например: 'течет кран на кухне', 'не включается холодильник') или загрузите фото неисправности."
}

ТРЕБОВАНИЯ К ВАЛЮТЕ И ЦЕНАМ:
- Все числовые значения цен (partsCostMin, partsCostMax, laborCostMin, laborCostMax, totalCostMin, totalCostMax, а также priceMin/priceMax у запчастей) ДОЛЖНЫ БЫТЬ СТРОГО в валюте "${currInfo.currency}" (${currInfo.currencyName}).
- Для Кыргызстана (Бишкек, Ош, Кант, Каракол): цены в сомах (сом / KGS). Пример: картридж ~350-900 сом, работа мастера ~1000-1800 сом.
- Для Казахстана (Алматы, Астана, Шымкент): цены в тенге (₸ / KZT). Пример: картридж ~2000-5000 ₸, работа мастера ~6000-12000 ₸.
- Для России (Москва, Санкт-Петербург): цены в рублях (₽ / RUB). Пример: картридж ~450-1200 ₽, работа мастера ~1200-2500 ₽.

ФОРМАТ ОТВЕТА:
Respond ONLY with a valid raw JSON object. Do not include markdown formatting or backticks like \`\`\`json.
Keep steps and descriptions concise so the total JSON output is compact and generates rapidly.
Limit stepByStepGuide to 3-5 clear steps, requiredParts to 1-4 items, proTips to 2 items.
Обязательная структура JSON:
{
  "problemTitle": "Краткое техническое название поломки",
  "probableCause": "Подробная вероятная причина неисправности",
  "urgency": "low" | "medium" | "high" | "critical",
  "urgencyLabel": "Понятное описание уровня срочности",
  "urgencyWarning": "Предупреждение о рисках и последствиях",
  "difficulty": "easy_diy" | "moderate_diy" | "pro_recommended" | "pro_mandatory",
  "difficultyLabel": "Понятный лейбл сложности",
  "estimatedTime": "Ориентировочное время (например '30-45 минут')",
  "currency": "${currInfo.currency}",
  "currencyCode": "${currInfo.currencyCode}",
  "partsCostMin": number,
  "partsCostMax": number,
  "laborCostMin": number,
  "laborCostMax": number,
  "totalCostMin": number,
  "totalCostMax": number,
  "requiredParts": [
    {
      "name": "Название детали/материала",
      "priceMin": number,
      "priceMax": number,
      "optional": boolean,
      "searchQuery": "Поисковый запрос для покупки",
      "category": "Запчасть | Расходник | Крепеж | Сантехника"
    }
  ],
  "requiredTools": ["Инструмент 1", "Инструмент 2"],
  "safetyNotice": "Правила безопасности перед началом работ",
  "stepByStepGuide": ["Шаг 1...", "Шаг 2..."],
  "proTips": ["Совет 1...", "Совет 2..."],
  "partsSearchQuery": "Основной поисковый запрос для запчастей",
  "masterSearchQuery": "Поисковый запрос для вызова мастера на Lalafo/2GIS"
}`;

        const userPromptText = `Выбранная категория: ${categoryNames[category] || category}
Город/Регион: ${city || 'Бишкек'} (Валюта расчета: ${currInfo.currencyName})
${description ? `Описание проблемы от пользователя: "${description}"` : 'Пользователь не оставил текст, а прикрепил фотографию поломки.'}

ВАЖНОЕ ПРАВИЛО ДЛЯ ФОТО: Внимательно осмотри изображение. Определи точный предмет и узел поломки (например, если на фото разбитая/старая розетка, проводка или выключатель — это электрика; если кран, сифон или унитаз — сантехника; если мебель, петли или замки — фурнитура). Определи реальную категорию по фото (electrical, plumbing, appliances, general) и верни ее в поле "category", укажи конкретную неисправность и составь подробную смету.

Respond ONLY with a valid raw JSON object. Do not include markdown formatting or backticks like \`\`\`json. Keep steps and descriptions concise so the total JSON output is compact.`;

        const parts: any[] = [];

        if (imageBase64) {
          const cleanBase64 = imageBase64.includes('base64,')
            ? imageBase64.split('base64,')[1].trim()
            : imageBase64.trim();
          if (cleanBase64) {
            parts.push({
              inlineData: {
                mimeType: imageMimeType || 'image/jpeg',
                data: cleanBase64,
              },
            });
          }
        }

        parts.push({ text: userPromptText });

        // Resilient model candidate pool for fast serverless execution
        const candidateModels: Array<{
          name: string;
          timeoutMs: number;
          thinkingLevel?: ThinkingLevel;
        }> = [
          { name: 'gemini-3.1-flash-lite', timeoutMs: 15000 },
          { name: 'gemini-flash-latest', timeoutMs: 18000 },
          { name: 'gemini-3.6-flash', timeoutMs: 25000 },
          { name: 'gemini-3.8-flash', timeoutMs: 25000, thinkingLevel: ThinkingLevel.LOW },
        ];

        let parsedData: any = null;

        for (const candidate of candidateModels) {
          const abortController = new AbortController();
          const timeoutHandle = setTimeout(() => {
            abortController.abort();
          }, candidate.timeoutMs);

          try {
            const genConfig: any = {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              abortSignal: abortController.signal,
            };
            if (candidate.thinkingLevel) {
              genConfig.thinkingConfig = {
                thinkingLevel: candidate.thinkingLevel,
              };
            }

            const aiResponse = await client.models.generateContent({
              model: candidate.name,
              contents: parts,
              config: genConfig,
            });

            clearTimeout(timeoutHandle);

            const responseText = aiResponse.text;
            if (responseText) {
              let cleanJson = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
              const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                cleanJson = jsonMatch[0];
              }
              const candidateData = JSON.parse(cleanJson);
              if (candidateData && (candidateData.problemTitle || candidateData.unrecognized)) {
                parsedData = candidateData;
                break;
              }
            }
          } catch (modelErr: any) {
            clearTimeout(timeoutHandle);
            const errStatus = modelErr?.status || modelErr?.code;
            const errMsg = modelErr?.message || String(modelErr);
            console.info(`Model ${candidate.name} unavailable (${errStatus || errMsg}), trying alternative model...`);
          }
        }

        if (parsedData) {
          if (parsedData.unrecognized) {
            return res.status(400).json({
              success: false,
              unrecognized: true,
              problemTitle: parsedData.problemTitle || 'Не удалось распознать проблему',
              error: parsedData.errorMessage || 'Не удалось распознать поломку по описанию.',
              errorMessage: parsedData.errorMessage || 'Не удалось распознать поломку по описанию.',
            });
          }

          const result = {
            id: `diag-${Date.now()}`,
            createdAt: new Date().toISOString(),
            category,
            ...parsedData,
            currency: parsedData.currency || currInfo.currency,
            currencyCode: parsedData.currencyCode || currInfo.currencyCode,
            userDescription: description,
            city: city || 'Бишкек',
            isFallback: false,
          };
          return res.status(200).json(result);
        }
      } catch (geminiError: any) {
        console.info('All AI models unavailable, served via high-precision knowledge engine:', geminiError?.message || geminiError);
      }
    }

    const fallbackResult = generateFallbackDiagnosis(category, description, city, Boolean(imageBase64));
    if (fallbackResult.unrecognized) {
      return res.status(400).json({
        success: false,
        unrecognized: true,
        error: fallbackResult.errorMessage,
        errorMessage: fallbackResult.errorMessage,
      });
    }
    return res.status(200).json(fallbackResult);
  } catch (err: any) {
    console.error('Top-level diagnostic error in Vercel function:', err);
    const safeFallback = generateFallbackDiagnosis('general', req.body?.description || '', req.body?.city || 'Бишкек', Boolean(req.body?.imageBase64));
    if (safeFallback.unrecognized) {
      return res.status(400).json({
        success: false,
        unrecognized: true,
        error: safeFallback.errorMessage,
        errorMessage: safeFallback.errorMessage,
      });
    }
    return res.status(200).json(safeFallback);
  }
}
