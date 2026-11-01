// Helper utility to detect gibberish, keyboard mashing, and invalid repair descriptions

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

/**
 * Validates whether user-entered text is a meaningful description of a home repair problem.
 * Catches keyboard mash like "ормбилгз9н8змза9", "asdfghjk", repeated letters, random numbers.
 */
export function validateRepairDescription(text: string, hasImage: boolean = false): {
  isValid: boolean;
  errorMessage?: string;
} {
  const trimmed = (text || '').trim();

  // If there's an image, empty or short text is allowed (AI analyzes the photo)
  if (hasImage) {
    return { isValid: true };
  }

  // Without image, text is required
  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: 'Пожалуйста, опишите проблему или сфотографируйте поломку.',
    };
  }

  // Too short
  if (trimmed.length < 4) {
    return {
      isValid: false,
      errorMessage: 'Описание слишком короткое. Укажите хотя бы несколько слов (например: «течет кран», «искрит розетка»).',
    };
  }

  const lower = trimmed.toLowerCase();

  // 1. Check for digits randomly embedded inside Russian or English letters without spaces
  // Example: "ормбилгз9н8змза9" -> contains [a-zа-яё]\d+[a-zа-яё] multiple times
  const embeddedDigitMatches = lower.match(/[а-яa-z]\d+[а-яa-z]/g);
  if (embeddedDigitMatches && embeddedDigitMatches.length >= 1 && trimmed.length < 30) {
    return {
      isValid: false,
      errorMessage: 'Текст выглядит как случайный набор символов («' + trimmed.slice(0, 20) + '...»). Опишите поломку словами (например: «капает кран на кухне») или прикрепите фото.',
    };
  }

  // 2. Check for only digits or only special punctuation characters
  if (/^[\d\s.,!?;:()#$*+=\-_/\\%@]+$/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: 'Описание не может состоять только из цифр или знаков. Пожалуйста, напишите словами, что случилось.',
    };
  }

  // 3. Check for repeated characters (e.g., "аааааааааааа", "111111111", "..........")
  if (/(.)\1{4,}/.test(trimmed)) {
    return {
      isValid: false,
      errorMessage: 'Пожалуйста, введите осмысленное описание поломки, а не повторяющиеся символы.',
    };
  }

  // 4. Check for standard keyboard mashing on Russian or English keyboards
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

  // 5. Check if text has any vowels (Russian: аеёиоуыэюя, English: aeiouy)
  const hasVowels = /[аеёиоуыэюяaeiouy]/i.test(lower);
  if (!hasVowels && trimmed.length >= 4) {
    return {
      isValid: false,
      errorMessage: 'В описании нет гласных букв («' + trimmed.slice(0, 15) + '...»). Напишите понятными словами или прикрепите фото.',
    };
  }

  // 6. Check vowel-to-letter ratio: if text has 8+ letters and very few vowels (< 15%), it's almost certainly gibberish
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

  // 7. Check if at least one repair keyword/stem or common repair symptom is present OR text is a coherent sentence
  const hasRepairStem = REPAIR_KEYWORDS_STEMS.some(stem => lower.includes(stem));

  // If text is a single continuous word longer than 12 characters without spaces and without repair stems
  if (!trimmed.includes(' ') && trimmed.length > 12 && !hasRepairStem) {
    return {
      isValid: false,
      errorMessage: 'Не удалось распознать слово «' + trimmed.slice(0, 18) + '...». Опишите проблему (например: «протекает сифон», «не греет батарея») или сделайте фото.',
    };
  }

  return { isValid: true };
}
