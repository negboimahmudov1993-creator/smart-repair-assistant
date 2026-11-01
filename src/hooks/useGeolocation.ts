import { useState, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { POPULAR_CITIES, DEFAULT_CITY, CityPreset } from '../data/stores';
import { APP_CONFIG } from '../config/appConfig';

export type GeolocationStatus =
  | 'idle'
  | 'locating'
  | 'success'
  | 'services_disabled'
  | 'permission_denied'
  | 'denied'
  | 'unavailable'
  | 'timeout'
  | 'unsupported';

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface UseGeolocationReturn {
  status: GeolocationStatus;
  isLocating: boolean;
  coords: GeolocationCoords | null;
  detectedCity: string;
  distanceKm: number | null;
  errorMessage: string | null;
  requestLocation: (callbacks?: {
    onSuccess?: (cityName: string, coords: GeolocationCoords) => void;
    onDenied?: () => void;
    onError?: (msg: string) => void;
  }) => void;
  resetState: () => void;
}

/**
 * Calculates Haversine distance in kilometers between two geo coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Resolves the closest city from the known database
 */
export function resolveClosestCity(lat: number, lng: number): { city: CityPreset; distanceKm: number } {
  let minDistance = Infinity;
  let closest: CityPreset = DEFAULT_CITY;

  for (const city of POPULAR_CITIES) {
    const dist = calculateDistanceKm(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  return { city: closest, distanceKm: minDistance };
}

export function useGeolocation(initialCity: string = APP_CONFIG.defaultCity): UseGeolocationReturn {
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [detectedCity, setDetectedCity] = useState<string>(initialCity);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  const requestLocation = useCallback(
    async (callbacks?: {
      onSuccess?: (cityName: string, coords: GeolocationCoords) => void;
      onDenied?: () => void;
      onError?: (msg: string) => void;
    }) => {
      setStatus('locating');
      setErrorMessage(null);

      const handleSuccess = (userCoords: GeolocationCoords) => {
        setCoords(userCoords);
        const { city, distanceKm: dist } = resolveClosestCity(
          userCoords.latitude,
          userCoords.longitude
        );

        setDistanceKm(dist);
        setDetectedCity(city.name);
        setStatus('success');
        setErrorMessage(null);

        callbacks?.onSuccess?.(city.name, userCoords);
      };

      // Helper to detect if GPS/location services are turned off on the device
      const isServicesDisabled = (err: any): boolean => {
        if (!err) return false;
        const msg = String(err?.message || err).toLowerCase();
        return (
          msg.includes('disabled') ||
          msg.includes('location service') ||
          msg.includes('location services') ||
          msg.includes('provider') ||
          err?.code === 2
        );
      };

      // Helper to detect if app permission was denied by user/system
      const isPermissionDenied = (err: any): boolean => {
        if (!err) return false;
        const msg = String(err?.message || err).toLowerCase();
        return (
          msg.includes('denied') ||
          msg.includes('not permitted') ||
          msg.includes('permission') ||
          err?.code === 1
        );
      };

      // 1. First Attempt: Native Capacitor Geolocation plugin
      let hasNativeAccess = false;
      try {
        // Step 1A: Check current permission status
        let perm = await Geolocation.checkPermissions();

        // Step 1B: If not granted, trigger the native Android permission dialog
        if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') {
          perm = await Geolocation.requestPermissions();
        }

        if (perm.location === 'granted' || perm.coarseLocation === 'granted') {
          hasNativeAccess = true;
        } else if (perm.location === 'denied') {
          setStatus('permission_denied');
          const errMsg = 'Доступ к геолокации отклонен. Разрешите доступ в настройках приложения или выберите ваш город из списка ниже.';
          setErrorMessage(errMsg);
          callbacks?.onDenied?.();
          callbacks?.onError?.(errMsg);
          return;
        }
      } catch (permErr: any) {
        if (isServicesDisabled(permErr)) {
          setStatus('services_disabled');
          const errMsg = 'Служба геолокации (GPS) выключена в телефоне. Включите геолокацию в шторке быстрых настроек.';
          setErrorMessage(errMsg);
          callbacks?.onDenied?.();
          callbacks?.onError?.(errMsg);
          return;
        }
        if (isPermissionDenied(permErr)) {
          setStatus('permission_denied');
          const errMsg = 'Доступ к геолокации заблокирован. Разрешите доступ в настройках устройства.';
          setErrorMessage(errMsg);
          callbacks?.onDenied?.();
          callbacks?.onError?.(errMsg);
          return;
        }
        console.warn('Capacitor check/requestPermissions exception, trying position:', permErr);
      }

      if (hasNativeAccess) {
        // Attempt 1C: High Accuracy (GPS Satellites)
        try {
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000,
          });

          if (position?.coords) {
            handleSuccess({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy || 10,
            });
            return;
          }
        } catch (highErr: any) {
          if (isServicesDisabled(highErr)) {
            setStatus('services_disabled');
            const errMsg = 'Служба геолокации (GPS) выключена в телефоне. Включите геолокацию в шторке быстрых настроек.';
            setErrorMessage(errMsg);
            callbacks?.onDenied?.();
            callbacks?.onError?.(errMsg);
            return;
          }
          console.info('GPS satellite fix failed or timed out, trying coarse/network location:', highErr);
        }

        // Attempt 1D: Coarse Accuracy (Network / Wi-Fi / Cell tower - works indoors reliably)
        try {
          const positionCoarse = await Geolocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 9000,
            maximumAge: 180000,
          });

          if (positionCoarse?.coords) {
            handleSuccess({
              latitude: positionCoarse.coords.latitude,
              longitude: positionCoarse.coords.longitude,
              accuracy: positionCoarse.coords.accuracy || 35,
            });
            return;
          }
        } catch (coarseErr: any) {
          if (isServicesDisabled(coarseErr)) {
            setStatus('services_disabled');
            const errMsg = 'Служба геолокации (GPS) выключена в телефоне. Включите геолокацию в шторке быстрых настроек.';
            setErrorMessage(errMsg);
            callbacks?.onDenied?.();
            callbacks?.onError?.(errMsg);
            return;
          }
          console.info('Coarse location attempt failed:', coarseErr);
        }
      }

      // 2. Second Attempt: Browser Geolocation
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        const tryBrowserGeo = (highAccuracy: boolean): Promise<GeolocationPosition> =>
          new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: highAccuracy,
              timeout: 8000,
              maximumAge: 180000,
            });
          });

        try {
          const browserPos = await tryBrowserGeo(false);
          if (browserPos?.coords) {
            handleSuccess({
              latitude: browserPos.coords.latitude,
              longitude: browserPos.coords.longitude,
              accuracy: browserPos.coords.accuracy || 30,
            });
            return;
          }
        } catch (browserErr: any) {
          if (browserErr?.code === 1 || isPermissionDenied(browserErr)) {
            setStatus('permission_denied');
            const errMsg = 'Доступ к геолокации отклонен в браузере. Разрешите доступ или выберите город из списка.';
            setErrorMessage(errMsg);
            callbacks?.onDenied?.();
            callbacks?.onError?.(errMsg);
            return;
          }
          if (browserErr?.code === 2 || isServicesDisabled(browserErr)) {
            setStatus('services_disabled');
            const errMsg = 'Служба геолокации (GPS) выключена в телефоне. Включите геолокацию в шторке быстрых настроек.';
            setErrorMessage(errMsg);
            callbacks?.onDenied?.();
            callbacks?.onError?.(errMsg);
            return;
          }
          console.info('Browser geolocation attempt failed:', browserErr);
        }
      }

      // If all GPS/device mechanisms failed:
      // In 95% of cases on mobile when all location providers return no fix, GPS is disabled in the notification shade
      setStatus('services_disabled');
      const errorMsg = 'Служба геолокации (GPS) выключена в телефоне или слабый сигнал. Включите геолокацию в шторке телефона или выберите ваш город вручную из списка ниже.';
      setErrorMessage(errorMsg);
      callbacks?.onDenied?.();
      callbacks?.onError?.(errorMsg);
    },
    []
  );

  return {
    status,
    isLocating: status === 'locating',
    coords,
    detectedCity,
    distanceKm,
    errorMessage,
    requestLocation,
    resetState,
  };
}
