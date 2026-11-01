import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  History,
  Sparkles,
  Navigation,
  DownloadCloud,
} from 'lucide-react';
import { GeolocationStatus } from '../hooks/useGeolocation';

interface HeaderProps {
  currentCity: string;
  onOpenCitySelect: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onReset: () => void;
  isLocatingGPS?: boolean;
  gpsStatus?: GeolocationStatus;
  onRequestGPS?: () => void;
  canInstallPWA?: boolean;
  onInstallPWA?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onOpenCitySelect,
  onOpenHistory,
  historyCount,
  onReset,
  isLocatingGPS = false,
  canInstallPWA = false,
  onInstallPWA,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo & Title */}
        <motion.button
          id="app-header-home-btn"
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
          className="flex items-center gap-2.5 text-left group min-h-[44px] cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shadow-md shadow-orange-500/20 flex items-center justify-center text-white shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Wrench className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
                JOL-Remont
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80">
                <Sparkles className="w-2.5 h-2.5 text-amber-600 animate-pulse" /> AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
              Оценка поломок и расчет цен
            </p>
          </div>
        </motion.button>

        {/* Action buttons: GPS Location, Install PWA, & History */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Install Button (if eligible) */}
          {canInstallPWA && onInstallPWA && (
            <motion.button
              id="header-pwa-install-btn"
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={onInstallPWA}
              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shadow-orange-600/20 transition-colors cursor-pointer"
              title="Установить приложение на телефон"
            >
              <DownloadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Установить</span>
            </motion.button>
          )}

          {/* Interactive GPS Location Button */}
          <motion.button
            id="header-city-select-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenCitySelect}
            className={`min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
              isLocatingGPS
                ? 'bg-orange-100/90 text-orange-900 border-orange-300 ring-2 ring-orange-400/30'
                : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-800 border-slate-200/80'
            }`}
            title="Определить местоположение по GPS или сменить город"
          >
            <div className="relative flex items-center justify-center">
              <Navigation
                className={`w-3.5 h-3.5 text-orange-600 ${
                  isLocatingGPS ? 'animate-spin' : ''
                }`}
              />
              {isLocatingGPS && (
                <>
                  <span className="absolute w-4 h-4 rounded-full bg-orange-400/50 animate-radar-wave-1 pointer-events-none" />
                  <span className="absolute w-4 h-4 rounded-full bg-amber-400/40 animate-radar-wave-2 pointer-events-none" />
                </>
              )}
            </div>
            <span className="max-w-[85px] sm:max-w-[120px] truncate">
              {isLocatingGPS ? 'Поиск GPS...' : currentCity}
            </span>
          </motion.button>

          {/* History button */}
          <motion.button
            id="header-history-btn"
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={onOpenHistory}
            className="min-h-[44px] min-w-[44px] relative flex items-center justify-center rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 transition-colors border border-slate-200/80 cursor-pointer"
            title="История проверок"
            aria-label="История проверок"
          >
            <History className="w-4 h-4" />
            <AnimatePresence>
              {historyCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs"
                >
                  {historyCount > 9 ? '9+' : historyCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
