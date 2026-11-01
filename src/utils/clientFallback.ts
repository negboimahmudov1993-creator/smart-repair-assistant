import { RepairDiagnosis } from '../types';
import { validateRepairDescription } from './textValidation';
import { getCountryForCity } from '../data/stores';

export function getCityCurrency(city: string) {
  const c = (city || '').trim().toLowerCase();

  if (city) {
    const country = getCountryForCity(city);
    if (country) {
      if (country.id === 'ru') {
        return { currency: '₽', currencyCode: 'RUB', multiplier: 1.05 };
      }
      if (country.id === 'kz') {
        return { currency: '₸', currencyCode: 'KZT', multiplier: 5.3 };
      }
      if (country.id === 'uz') {
        return { currency: 'сум', currencyCode: 'UZS', multiplier: 145 };
      }
      if (country.id === 'tj') {
        return { currency: 'смн', currencyCode: 'TJS', multiplier: 0.12 };
      }
      if (country.id === 'kg') {
        return { currency: 'сом', currencyCode: 'KGS', multiplier: 1.0 };
      }
    }
  }

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
    return { currency: '₽', currencyCode: 'RUB', multiplier: 1.05 };
  }

  if (
    c.includes('алмат') ||
    c.includes('астан') ||
    c.includes('шымкент') ||
    c.includes('казахстан') ||
    c.includes('караганд') ||
    c.includes('актобе')
  ) {
    return { currency: '₸', currencyCode: 'KZT', multiplier: 5.3 };
  }
  if (c.includes('ташкент') || c.includes('самарканд') || c.includes('узбекистан')) {
    return { currency: 'сум', currencyCode: 'UZS', multiplier: 145 };
  }
  if (c.includes('душанбе') || c.includes('худжанд') || c.includes('таджикистан')) {
    return { currency: 'смн', currencyCode: 'TJS', multiplier: 0.12 };
  }

  return { currency: 'сом', currencyCode: 'KGS', multiplier: 1.0 };
}

export function createClientFallbackDiagnosis(
  category: string,
  description: string,
  city: string = 'Бишкек',
  hasImage: boolean = false
): RepairDiagnosis {
  const descLower = (description || '').toLowerCase();
  const id = `diag-${Date.now()}`;
  const now = new Date().toISOString();
  const curr = getCityCurrency(city);

  // 1. If no image, validate whether text is an actual description or random gibberish (e.g. "ормбилгз9н8змза9")
  const validation = validateRepairDescription(description, hasImage);
  if (!validation.isValid) {
    return {
      id: `diag-unrecognized-${Date.now()}`,
      createdAt: now,
      category: 'general',
      unrecognized: true,
      errorMessage: validation.errorMessage || 'Не удалось распознать поломку. Пожалуйста, опишите проблему понятными словами или прикрепите фото.',
      problemTitle: 'Не удалось распознать проблему',
      probableCause: 'Введенный текст похож на случайный набор символов или не содержит описания бытовой неисправности.',
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
      safetyNotice: 'Пожалуйста, укажите, какая техника или сантехника неисправна, либо сделайте фото поломки.',
      stepByStepGuide: ['Опишите проблему словами (например: «течет кран», «искрит розетка»)', 'Или сделайте фото поломки на камеру телефона'],
      proTips: ['Четкое описание позволяет рассчитать точную стоимость деталей и работы мастера'],
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
    if (curr.currencyCode === 'KZT') return Math.round(raw / 50) * 50;
    if (curr.currencyCode === 'UZS') return Math.round(raw / 1000) * 1000;
    return Math.round(raw / 10) * 10;
  };

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
        probableCause: 'Износ силиконовой мембраны клапана или перекос поплавка, вызывающий постоянный перелив воды в чашу.',
        urgency: 'medium',
        urgencyLabel: 'Умеренная (потери воды до 200 л/сутки)',
        urgencyWarning: 'Приводит к постоянному шуму и лишнему расходу воды.',
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
          { name: 'Арматура для бачка унитаза универсальная', priceMin: scale(650), priceMax: scale(1500), searchQuery: 'арматура для бачка унитаза с нижней подводкой универсальная', category: 'Арматура' },
          { name: 'Мембрана донного клапана', priceMin: scale(120), priceMax: scale(300), optional: true, searchQuery: 'мембрана для впускного клапана унитаза', category: 'Расходники' },
        ],
        requiredTools: ['Разводной ключ до 30 мм', 'Пассатижи', 'Емкость для сбора остатков воды'],
        safetyNotice: 'Перекройте кран подачи воды перед бачком унитаза и полностью спустите воду перед разборкой.',
        stepByStepGuide: [
          '1. Перекройте кран подачи воды перед бачком унитаза и полностью спустите воду.',
          '2. Открутите кнопку слива против часовой стрелки и аккуратно снимите керамическую крышку бачка.',
          '3. Осмотрите запорную мембрану и поплавок: удалите ржавчину, известковый налет.',
          '4. При наличии трещин или деформации мембраны замените её или весь механизм арматуры.',
          '5. Отрегулируйте уровень наполнения поплавком (на 2 см ниже трубки перелива).',
          '6. Закройте крышку, прикрутите кнопку и плавно откройте подачу воды.'
        ],
        proTips: ['Арматура Geberit или Alcaplast служит годами без нареканий.', 'Не затягивайте пластиковые гайки слишком сильно.'],
        partsSearchQuery: 'арматура для бачка унитаза',
        masterSearchQuery: 'ремонт замена арматуры бачка унитаза сантехник',
        userDescription: description,
        city: city || 'Бишкек',
        isFallback: true,
      };
    }

    const partsCostMin = scale(400);
    const partsCostMax = scale(1300);
    const laborCostMin = scale(1200);
    const laborCostMax = scale(2400);
    return {
      id,
      createdAt: now,
      category: 'plumbing',
      problemTitle: 'Протечка смесителя: износ керамического картриджа 35мм/40мм',
      probableCause: 'Выработка керамических пластин от жесткой воды и абразивных микрочастиц окалины.',
      urgency: 'medium',
      urgencyLabel: 'Умеренная (капает из излива)',
      urgencyWarning: 'Приводит к образованию известкового налета и закисанию резьбы прижимной гайки.',
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
        { name: 'Силиконовая сантехническая смазка', priceMin: scale(90), priceMax: scale(220), searchQuery: 'силиконовая смазка для смесителей', category: 'Расходники' }
      ],
      requiredTools: ['Шестигранный ключ 2.5 мм', 'Разводной ключ до 32 мм', 'Плоская отвертка'],
      safetyNotice: 'Перекройте краны горячей и холодной воды на вводе перед разборкой смесителя!',
      stepByStepGuide: [
        '1. Перекройте краны горячей и холодной воды на вводе в квартиру.',
        '2. Снимите декоративную сине-красную заглушку под рычагом смесителя тонкой отверткой.',
        '3. Ослабьте внутренний винт шестигранником на 2.5 мм и снимите рычаг вверх.',
        '4. Открутите руками декоративный колпачок и ключом выкрутите латунную гайку.',
        '5. Замените старый картридж на новый, совместив направляющие ножки.',
        '6. Соберите смеситель в обратном порядке и проверьте работу при плавном пуске воды.'
      ],
      proTips: ['Возьмите старый картридж в магазин как образец.', 'Нанесите силиконовую смазку на уплотнители.'],
      partsSearchQuery: 'картридж для смесителя 35мм',
      masterSearchQuery: 'замена картриджа смесителя сантехник вызов',
      userDescription: description,
      city: city || 'Бишкек',
      isFallback: true,
    };
  }

  if (category === 'electrical' || descLower.includes('розетк') || descLower.includes('автомат') || descLower.includes('искр') || descLower.includes('свет')) {
    const partsCostMin = scale(280);
    const partsCostMax = scale(950);
    const laborCostMin = scale(1000);
    const laborCostMax = scale(2200);
    return {
      id,
      createdAt: now,
      category: 'electrical',
      problemTitle: 'Ослабление контакта / подгорание механизма силовой розетки 16А',
      probableCause: 'Высокая нагрузка от мощных электроприборов, вызвавшая нагрев клемм и разрушение контактной группы.',
      urgency: 'critical',
      urgencyLabel: 'Критическая (риск короткого замыкания!)',
      urgencyWarning: 'Немедленно обесточьте данную розетку до устранения неисправности!',
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
        { name: 'Розетка с заземлением 16А', priceMin: scale(250), priceMax: scale(700), searchQuery: 'розетка 16А с заземлением Legrand или Schneider', category: 'Электроустановочные' },
        { name: 'Клеммники WAGO 221-413', priceMin: scale(80), priceMax: scale(250), optional: true, searchQuery: 'клеммы wago 221-413', category: 'Расходники' }
      ],
      requiredTools: ['Индикаторная отвертка', 'Крестовая отвертка PH2', 'Пассатижи с изолированными ручками'],
      safetyNotice: 'ОБЯЗАТЕЛЬНО: Обесточьте автомат в электрощитке и проверьте отсутствие напряжения индикатором!',
      stepByStepGuide: [
        '1. Отключите автоматический выключатель соответствующей розеточной группы в щитке.',
        '2. Проверьте индикаторной отверткой оба гнезда розетки на отсутствие напряжения.',
        '3. Снимите рамку и извлеките механизм розетки из подрозетника.',
        '4. Осмотрите провода. При почернении зачистите провод заново на 10 мм.',
        '5. Подключите фазу, ноль и заземление к новой розетке и надежно затяните клеммы.',
        '6. Закрепите розетку в подрозетнике, включите автомат и проверьте светильником.'
      ],
      proTips: ['Используйте розетки с пружинными самозажимными клеммами.', 'Для мощных приборов избегайте удлинителей.'],
      partsSearchQuery: 'розетка с заземлением 16А',
      masterSearchQuery: 'замена искрящей розетки электрик вызов',
      userDescription: description,
      city: city || 'Бишкек',
      isFallback: true,
    };
  }

  if (category === 'appliances' || descLower.includes('стирал') || descLower.includes('холодиль') || descLower.includes('посудомой')) {
    const partsCostMin = 0;
    const partsCostMax = scale(1900);
    const laborCostMin = scale(1800);
    const laborCostMax = scale(3600);
    return {
      id,
      createdAt: now,
      category: 'appliances',
      problemTitle: 'Засор фильтра слива / блокировка крыльчатки сливного насоса',
      probableCause: 'Попадание постороннего предмета (монета, пуговица, ворс) в улитку сливного фильтра машины.',
      urgency: 'high',
      urgencyLabel: 'Высокая (стирка заблокирована с водой)',
      urgencyWarning: 'Не открывайте дверцу силой — спустите воду через аварийный дренажный шланг.',
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
        { name: 'Сливной насос / помпа универсальная Askoll', priceMin: scale(850), priceMax: scale(1850), optional: true, searchQuery: 'насос сливной для стиральной машины askoll универсальный', category: 'Запчасти' }
      ],
      requiredTools: ['Низкий поддон или емкость для воды', 'Полотенце', 'Плоская отвертка', 'Фонарик'],
      safetyNotice: 'Отключите вилку стиральной машины из электрической розетки перед любыми работами!',
      stepByStepGuide: [
        '1. Обесточьте прибор, вынув вилку из розетки.',
        '2. Откройте сервисную панель/лючок в правом нижнем углу корпуса.',
        '3. Подложите полотенце и слейте воду через аварийный шланжик.',
        '4. Медленно выкрутите пробку фильтра против часовой стрелки.',
        '5. Извлеките посторонние предметы и промойте фильтр под краном.',
        '6. Проверьте пальцем свободное вращение крыльчатки насоса в глубине.',
        '7. Плотно закрутите фильтр и запустите тест на режиме слива.'
      ],
      proTips: ['В 8 из 10 случаев достаточно просто прочистить фильтр без покупки деталей.', 'Чистите фильтр раз в 3 месяца.'],
      partsSearchQuery: 'помпа сливной насос стиральной машины askoll',
      masterSearchQuery: 'ремонт стиральной машины не сливает воду мастер',
      userDescription: description,
      city: city || 'Бишкек',
      isFallback: true,
    };
  }

  // General fallback - only if general repair keywords match or photo was provided
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
    problemTitle: hasImage && !description ? 'Диагностика по фото: повреждение крепления, износ или люфт узла' : 'Люфт фурнитуры, перекос створки или ослабление крепежа',
    probableCause: hasImage && !description ? 'Визуальный осмотр указывает на механическое повреждение, ослабление крепежа или износ подвижного узла.' : 'Естественный износ механических узлов или ослабление регулировочных винтов от постоянных нагрузок.',
    urgency: 'low',
    urgencyLabel: 'Низкая (плановый ремонт)',
    urgencyWarning: 'При длительной эксплуатации с перекосом нагрузка разрушает соседние элементы механизма.',
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
      { name: 'Силиконовая смазка для механизмов', priceMin: scale(180), priceMax: scale(350), optional: true, searchQuery: 'смазка силиконовая спрей для фурнитуры', category: 'Расходники' }
    ],
    requiredTools: ['Отвертка крестовая PH2 / PZ2', 'Шестигранный ключ 4 мм', 'Строительный уровень'],
    safetyNotice: 'Придерживайте створки или двери при откручивании крепежа, чтобы избежать падения.',
    stepByStepGuide: [
      '1. Очистите механизм фурнитуры от пыли и старой загустевшей смазки.',
      '2. Осмотрите посадочные отверстия на наличие люфта.',
      '3. При вырванном крепеже установите стальную ремонтную пластину.',
      '4. Затяните основные несущие винты.',
      '5. Отрегулируйте положение створки соответствующими винтами.',
      '6. Нанесите аэрозольную силиконовую смазку на подвижные узлы.'
    ],
    proTips: ['Ремонтные пластины для петель позволяют восстановить дверцу за 10 минут.', 'Регулярная смазка продлевает жизнь фурнитуры вдвое.'],
    partsSearchQuery: 'ремкомплект фурнитуры ремонтная пластина',
    masterSearchQuery: 'мастер на час мелкий ремонт регулировка фурнитуры',
    userDescription: description,
    city: city || 'Бишкек',
    isFallback: true,
  };
}
