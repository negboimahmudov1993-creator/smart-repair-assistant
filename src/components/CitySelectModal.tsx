import React, { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { X, MapPin, Navigation, Check, ChevronDown, Store } from 'lucide-react';
import { COUNTRIES, getCountryForCity, DEFAULT_CITY, POPULAR_CITIES } from '../data/stores';

interface CitySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  onSelectCity: (city: string) => void;
}

// Haversine distance calculator in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

function findClosestCity(lat: number, lng: number): string {
  let minDistance = Infinity;
  let closestName = DEFAULT_CITY.name;

  for (const city of POPULAR_CITIES) {
    const dist = calculateDistance(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestName = city.name;
    }
  }

  // If closest city is within 400km, use it, otherwise fallback to Bishkek
  return minDistance <= 400 ? closestName : DEFAULT_CITY.name;
}

export const CitySelectModal: React.FC<CitySelectModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const activeCountry = getCountryForCity(currentCity);
      setExpandedCountryId(activeCountry ? activeCountry.id : 'kg');
    }
  }, [isOpen, currentCity]);

  if (!isOpen) return null;

  const toggleCountry = (countryId: string) => {
    setExpandedCountryId((prev) => (prev === countryId ? null : countryId));
  };

  const handleDetectLocation = async () => {
    setIsLocating(true);
    setStatusNote('Определение геопозиции по GPS...');

    // 1. Try Native Capacitor Geolocation (High Accuracy then Coarse)
    try {
      let isPermitted = false;
      try {
        let perm = await Geolocation.checkPermissions();
        if (perm.location === 'granted' || perm.coarseLocation === 'granted') {
          isPermitted = true;
        } else {
          perm = await Geolocation.requestPermissions();
          if (perm.location === 'granted' || perm.coarseLocation === 'granted') {
            isPermitted = true;
          }
        }
      } catch {
        isPermitted = true;
      }

      if (isPermitted) {
        // High accuracy
        try {
          const pos = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 60000,
          });
          if (pos?.coords) {
            setIsLocating(false);
            const detectedCity = findClosestCity(pos.coords.latitude, pos.coords.longitude);
            onSelectCity(detectedCity);
            onClose();
            return;
          }
        } catch {
          // Coarse fallback
        }

        try {
          const posCoarse = await Geolocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 8000,
            maximumAge: 180000,
          });
          if (posCoarse?.coords) {
            setIsLocating(false);
            const detectedCity = findClosestCity(posCoarse.coords.latitude, posCoarse.coords.longitude);
            onSelectCity(detectedCity);
            onClose();
            return;
          }
        } catch {
          // continue to browser
        }
      }
    } catch (nativeErr) {
      console.info('Native geolocation skipped or fallback:', nativeErr);
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const detectedCity = findClosestCity(pos.coords.latitude, pos.coords.longitude);
          onSelectCity(detectedCity);
          onClose();
        },
        () => {
          setIsLocating(false);
          setStatusNote('Не удалось поймать GPS. Выберите город ниже вручную.');
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    } else {
      setIsLocating(false);
      setStatusNote('GPS не поддерживается. Выберите город ниже.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">Выберите город</h3>
              <p className="text-xs text-slate-500">Страна и список городов</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS / IP Auto-detect button */}
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isLocating}
          className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-orange-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-orange-600' : 'text-orange-600'}`} />
          <span>{isLocating ? (statusNote || 'Определяем геопозицию...') : 'Определить автоматически (GPS / IP)'}</span>
        </button>

        {/* Countries with accordion cities */}
        <div className="overflow-y-auto space-y-2 pr-1 flex-1">
          {COUNTRIES.map((country) => {
            const isExpanded = expandedCountryId === country.id;
            const hasSelectedCity = country.cities.some(
              (c) => c.name.toLowerCase() === currentCity.toLowerCase()
            );

            return (
              <div
                key={country.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  hasSelectedCity
                    ? 'border-orange-300 bg-orange-50/20'
                    : isExpanded
                    ? 'border-slate-300 bg-slate-50/40'
                    : 'border-slate-200 bg-slate-50/20 hover:bg-slate-50/60'
                }`}
              >
                {/* Country Header */}
                <button
                  type="button"
                  onClick={() => toggleCountry(country.id)}
                  className="w-full min-h-[48px] px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0 w-8 h-8 rounded-lg bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center">
                      {country.flag}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {country.name}
                        </span>
                        {hasSelectedCity && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-orange-100 text-orange-900 border border-orange-200">
                            {currentCity}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {country.cities.length} гор. • {country.currency}
                      </p>
                    </div>
                  </div>

                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform ${
                    isExpanded ? 'rotate-180 text-orange-600 bg-orange-100' : 'text-slate-400'
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                </button>

                {/* Cities underneath */}
                {isExpanded && (
                  <div className="border-t border-slate-200/80 bg-white p-2 space-y-1">
                    <div className="grid grid-cols-1 gap-1">
                      {country.cities.map((city) => {
                        const isSelected = city.name.toLowerCase() === currentCity.toLowerCase();
                        return (
                          <button
                            key={city.id}
                            type="button"
                            onClick={() => {
                              onSelectCity(city.name);
                              onClose();
                            }}
                            className={`w-full min-h-[40px] flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer border ${
                              isSelected
                                ? 'bg-orange-500 text-white font-bold border-orange-600 shadow-2xs'
                                : 'bg-slate-50/80 hover:bg-orange-50/50 hover:border-orange-200 text-slate-800 border-slate-200/60'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <MapPin className={`w-3 h-3 shrink-0 ${isSelected ? 'text-white' : 'text-orange-500'}`} />
                              <span className="truncate">{city.name}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-white" />
                              ) : (
                                <span className="text-[10px] text-slate-400">
                                  {city.stores.length} маг.
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
