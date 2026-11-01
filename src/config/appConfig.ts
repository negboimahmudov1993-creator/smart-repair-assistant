/**
 * Centralized App Configuration & Environment Variables
 * Safe for both client-side and server-side modular referencing
 */

export interface AppConfig {
  name: string;
  shortName: string;
  fullName: string;
  version: string;
  geminiModel: string;
  clientTimeoutMs: number;
  serverTimeoutMs: number;
  defaultCity: string;
  defaultCountry: string;
  gpsTimeoutMs: number;
  maxPhotoDim: number;
  photoQuality: number;
  maps: {
    googleApiKey: string;
    yandexApiKey: string;
  };
}

export const APP_CONFIG: AppConfig = {
  name: 'JOL-Remont',
  shortName: 'JOL-Remont',
  fullName: 'JOL-Remont — оценка поломок и расчет цен',
  version: '2.1.0',
 geminiModel: 'gemini-3.6-flash',
  clientTimeoutMs: 50000,
  serverTimeoutMs: 45000,
  defaultCity: 'Бишкек',
  defaultCountry: 'Кыргызстан',
  gpsTimeoutMs: 8000,
  maxPhotoDim: 800,
  photoQuality: 0.75,
  maps: {
    googleApiKey: ((import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY as string) || '',
    yandexApiKey: ((import.meta as any)?.env?.VITE_YANDEX_MAPS_API_KEY as string) || 'fe45751b-875c-4d3e-bed2-f72918cfa534',
  },
};

export function getApiUrl(path: string): string {
  if (typeof window !== 'undefined') {
    const isNative =
      (window as any)?.Capacitor?.isNativePlatform?.() ||
      window.location.protocol === 'capacitor:' ||
      window.location.hostname === 'localhost' && window.location.port === '';
    if (isNative) {
      const baseUrl = ((import.meta as any)?.env?.VITE_API_URL as string) || 'https://umnyj-remontnyj-pomoshhnik-1.vercel.app';
      return `${baseUrl.replace(/\/$/, '')}${path}`;
    }
  }
  return path;
}

