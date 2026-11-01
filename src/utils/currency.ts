import { getCountryForCity } from '../data/stores';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  multiplier: number;
}

export function getCurrencyForCity(cityName?: string): CurrencyInfo {
  if (cityName) {
    const country = getCountryForCity(cityName);
    if (country) {
      if (country.id === 'ru') {
        return { code: 'RUB', symbol: '₽', name: 'рублях (₽)', multiplier: 1.05 };
      }
      if (country.id === 'kz') {
        return { code: 'KZT', symbol: '₸', name: 'тенге', multiplier: 5.3 };
      }
      if (country.id === 'uz') {
        return { code: 'UZS', symbol: 'сум', name: 'сум', multiplier: 145 };
      }
      if (country.id === 'tj') {
        return { code: 'TJS', symbol: 'смн', name: 'сомони', multiplier: 0.12 };
      }
      if (country.id === 'kg') {
        return { code: 'KGS', symbol: 'сом', name: 'сомах (KGS)', multiplier: 1.0 };
      }
    }
  }

  const c = (cityName || '').toLowerCase();
  if (
    c.includes('алмат') ||
    c.includes('астан') ||
    c.includes('шымкент') ||
    c.includes('казахстан') ||
    c.includes('караганд') ||
    c.includes('актобе')
  ) {
    return { code: 'KZT', symbol: '₸', name: 'тенге', multiplier: 5.3 };
  }
  if (c.includes('ташкент') || c.includes('самарканд') || c.includes('бухар') || c.includes('узбекистан')) {
    return { code: 'UZS', symbol: 'сум', name: 'сум', multiplier: 145 };
  }
  if (c.includes('душанбе') || c.includes('худжанд') || c.includes('таджикистан')) {
    return { code: 'TJS', symbol: 'смн', name: 'сомони', multiplier: 0.12 };
  }
  if (
    c.includes('москв') ||
    c.includes('питер') ||
    c.includes('санкт') ||
    c.includes('росси') ||
    c.includes('новосибирск') ||
    c.includes('екатеринбург') ||
    c.includes('казань') ||
    c.includes('нижний') ||
    c.includes('краснодар') ||
    c.includes('самара') ||
    c.includes('ростов') ||
    c.includes('уфа') ||
    c.includes('омск') ||
    c.includes('красноярск') ||
    c.includes('воронеж') ||
    c.includes('пермь') ||
    c.includes('волгоград') ||
    c.includes('челябинск') ||
    c.includes('тюмень') ||
    c.includes('сочи') ||
    c.includes('саратов') ||
    c.includes('владивосток') ||
    c.includes('иркутск')
  ) {
    return { code: 'RUB', symbol: '₽', name: 'рублях (₽)', multiplier: 1.05 };
  }
  // Default Kyrgyzstan (Bishkek, Osh, Kant, Jalal-Abad, Karakol)
  return { code: 'KGS', symbol: 'сом', name: 'сомах (KGS)', multiplier: 1.0 };
}

export function formatPrice(val: number, currency?: string, city?: string): string {
  const symbol = currency || (city ? getCurrencyForCity(city).symbol : 'сом');
  const formatted = new Intl.NumberFormat('ru-RU').format(Math.round(val));
  if (symbol === '₸') return `${formatted} ₸`;
  if (symbol === '₽' || symbol === 'RUB' || symbol === 'руб.') return `${formatted} ₽`;
  if (symbol === '$' || symbol === 'USD') return `$${formatted}`;
  return `${formatted} ${symbol}`;
}
