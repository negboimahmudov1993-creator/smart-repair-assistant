import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Navigation,
  Check,
  Search,
  AlertCircle,
  Compass,
  RefreshCw,
  Satellite,
  ShieldAlert,
  ChevronDown,
  Globe,
  Store,
  MapPin,
} from 'lucide-react';
import { COUNTRIES, CountryGroup, getCountryForCity, POPULAR_CITIES } from '../data/stores';
import { GeolocationStatus, GeolocationCoords } from '../hooks/useGeolocation';

interface GPSPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  onSelectCity: (city: string) => void;
  isLocating: boolean;
  locationStatus: GeolocationStatus;
  errorMessage: string | null;
  onRequestGPS: () => void;
  userCoords: GeolocationCoords | null;
}

export const GPSPromptModal: React.FC<GPSPromptModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
  isLocating,
  locationStatus,
  errorMessage,
  onRequestGPS,
  userCoords,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>(null);

  // Auto-expand the country corresponding to the current city on open
  useEffect(() => {
    if (isOpen) {
      const activeCountry = getCountryForCity(currentCity);
      setExpandedCountryId(activeCountry ? activeCountry.id : 'kg');
      setSearchQuery('');
    }
  }, [isOpen, currentCity]);

  // Filter countries and cities by search query
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return COUNTRIES.map((c) => ({
        ...c,
        matchedCities: c.cities,
      }));
    }

    return COUNTRIES.map((country) => {
      const countryMatches = country.name.toLowerCase().includes(q);
      const matchedCities = country.cities.filter(
        (city) =>
          countryMatches ||
          city.name.toLowerCase().includes(q) ||
          city.country.toLowerCase().includes(q)
      );

      return {
        ...country,
        matchedCities,
      };
    }).filter((c) => c.matchedCities.length > 0);
  }, [searchQuery]);

  // If user is searching, automatically open countries that contain matches
  const effectiveExpandedId = useMemo(() => {
    if (searchQuery.trim()) {
      return filteredCountries.length > 0 ? filteredCountries[0].id : null;
    }
    return expandedCountryId;
  }, [searchQuery, filteredCountries, expandedCountryId]);

  const toggleCountry = (countryId: string) => {
    setExpandedCountryId((prev) => (prev === countryId ? null : countryId));
  };

  const isServicesOff =
    locationStatus === 'services_disabled' ||
    (locationStatus === 'denied' && (errorMessage?.toLowerCase().includes('шторке') || errorMessage?.toLowerCase().includes('выключена')));

  const isPermissionBlocked =
    locationStatus === 'permission_denied' ||
    (locationStatus === 'denied' && !isServicesOff);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop with Fade-In Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Card with Spring Slide-Up / Scale */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative z-10 bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200/90 space-y-4 max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    Локация и магазины
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Выберите страну и город для расчета цен
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* GPS Action Button & Prompts */}
            <div className="space-y-3">
              <motion.button
                id="gps-auto-detect-btn"
                type="button"
                whileHover={!isLocating ? { scale: 1.01 } : {}}
                whileTap={!isLocating ? { scale: 0.98 } : {}}
                onClick={onRequestGPS}
                disabled={isLocating}
                className={`w-full min-h-[48px] px-4 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all relative overflow-hidden cursor-pointer ${
                  isLocating
                    ? 'bg-orange-100 text-orange-800 cursor-wait border border-orange-300'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-orange-600/20'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Navigation
                    className={`w-4 h-4 ${
                      isLocating ? 'animate-spin text-orange-600' : 'text-white'
                    }`}
                  />
                  {isLocating && (
                    <>
                      <span className="absolute w-5 h-5 rounded-full bg-orange-400/50 animate-radar-wave-1 pointer-events-none" />
                      <span className="absolute w-5 h-5 rounded-full bg-amber-400/40 animate-radar-wave-2 pointer-events-none" />
                    </>
                  )}
                </div>
                <span>
                  {isLocating
                    ? 'Поиск спутников GPS...'
                    : 'Определить точное местоположение (GPS)'}
                </span>
              </motion.button>

              {/* Location Services Disabled on Phone */}
              {isServicesOff && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-slate-900 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Satellite className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-amber-950 leading-tight">
                        Включите геолокацию на телефоне
                      </h4>
                      <p className="text-[11px] sm:text-xs text-amber-900/80 mt-0.5 leading-relaxed">
                        В шторке настроек телефона выключена служба GPS. Включите ее, как в 2ГИС:
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-amber-200/80 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-[11px] shrink-0">
                        1
                      </span>
                      <span>Смахните шторку быстрых настроек сверху экрана</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-[11px] shrink-0">
                        2
                      </span>
                      <span className="flex items-center gap-1 flex-wrap">
                        Нажмите значок <strong className="text-amber-950 font-bold">«Местоположение» (GPS)</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-[11px] shrink-0">
                        3
                      </span>
                      <span>Нажмите кнопку ниже для подтверждения:</span>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={onRequestGPS}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Я включил GPS — повторить поиск</span>
                  </motion.button>
                </motion.div>
              )}

              {/* Permission Blocked Prompt */}
              {isPermissionBlocked && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-slate-900 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-rose-950 leading-tight">
                        Разрешите доступ к геолокации
                      </h4>
                      <p className="text-[11px] sm:text-xs text-rose-900/80 mt-0.5 leading-relaxed">
                        Приложению нужен доступ к местоположению для поиска строительных магазинов рядом.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/90 rounded-xl p-3 border border-rose-200/80 text-xs text-slate-700 space-y-1.5">
                    <p className="font-medium text-slate-900">Если системное окно не появилось:</p>
                    <p>1. Откройте <strong>Настройки телефона</strong> → <strong>Приложения</strong></p>
                    <p>2. Найдите <strong>JOL-Remont</strong> → <strong>Разрешения</strong></p>
                    <p>3. Включите <strong>Местоположение</strong> → «При использовании»</p>
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={onRequestGPS}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Запросить разрешение снова</span>
                  </motion.button>
                </motion.div>
              )}

              {/* Success Badge */}
              {userCoords && locationStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>GPS зафиксирован: <strong>{currentCity}</strong></span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    ±{Math.round(userCoords.accuracy)}м
                  </span>
                </motion.div>
              )}
            </div>

            {/* Search Input for filtering countries and cities */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="city-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск страны или города..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200/80 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Countries and Expandable Cities List */}
            <div className="overflow-y-auto space-y-2 pr-1 max-h-60 sm:max-h-72">
              <div className="flex items-center justify-between px-1 pb-1">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-orange-600" />
                  <span>Страны и города:</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  нажмите на страну для выбора
                </span>
              </div>

              {filteredCountries.map((country) => {
                const isExpanded = effectiveExpandedId === country.id || !!searchQuery.trim();
                const hasSelectedCity = country.cities.some(
                  (c) => c.name.toLowerCase() === currentCity.toLowerCase()
                );

                return (
                  <div
                    key={country.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      hasSelectedCity
                        ? 'border-orange-300 bg-orange-50/20 shadow-2xs'
                        : isExpanded
                        ? 'border-slate-300 bg-slate-50/40 shadow-2xs'
                        : 'border-slate-200/80 bg-slate-50/20 hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Country Header Button */}
                    <button
                      type="button"
                      onClick={() => toggleCountry(country.id)}
                      className="w-full min-h-[50px] px-3.5 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0 w-9 h-9 rounded-xl bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {country.flag}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900 group-hover:text-orange-950 transition-colors">
                              {country.name}
                            </span>
                            {hasSelectedCity && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-900 border border-orange-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                                {currentCity}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {country.matchedCities.length} {country.matchedCities.length === 1 ? 'город' : country.matchedCities.length < 5 ? 'города' : 'городов'} • {country.currency} ({country.currencyCode})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                          isExpanded
                            ? 'bg-orange-100 text-orange-700 rotate-180'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70'
                        }`}>
                          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                        </span>
                      </div>
                    </button>

                    {/* Cities List (Appears Underneath the Country) */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key={`cities-${country.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-slate-200/80 bg-white/95 px-3 py-2 space-y-1.5"
                        >
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1 pt-1">
                            Города ({country.name}):
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {country.matchedCities.map((city) => {
                              const isSelected = city.name.toLowerCase() === currentCity.toLowerCase();
                              return (
                                <motion.button
                                  key={city.id}
                                  type="button"
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    onSelectCity(city.name);
                                    onClose();
                                  }}
                                  className={`min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer border ${
                                    isSelected
                                      ? 'bg-orange-500 text-white font-bold border-orange-600 shadow-xs'
                                      : 'bg-slate-50/80 hover:bg-orange-50/60 hover:border-orange-200 text-slate-800 border-slate-200/70'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-orange-500'}`} />
                                    <span className="truncate">{city.name}</span>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                    {isSelected ? (
                                      <Check className="w-4 h-4 text-white shrink-0" />
                                    ) : (
                                      <span className="text-[10px] text-slate-400 bg-white/80 px-1.5 py-0.5 rounded-md border border-slate-200/60 flex items-center gap-1">
                                        <Store className="w-2.5 h-2.5 text-slate-400" />
                                        {city.stores.length}
                                      </span>
                                    )}
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {filteredCountries.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <p className="font-semibold text-slate-600">Город или страна не найдены</p>
                  <p className="text-[11px] text-slate-400">Попробуйте изменить поисковый запрос</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

