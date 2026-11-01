import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RepairCategory, RepairDiagnosis } from './types';
import { Header } from './components/Header';
import { ProblemInputSection } from './components/ProblemInputSection';
import { DiagnosisResultView } from './components/DiagnosisResultView';
import { DiagnosisSkeleton } from './components/DiagnosisSkeleton';
import { HistoryDrawer } from './components/HistoryDrawer';
import { GPSPromptModal } from './components/GPSPromptModal';
import { BottomNavBar, ActiveNavTab } from './components/BottomNavBar';
import { StoreMap } from './components/StoreMap';
import { useGeolocation } from './hooks/useGeolocation';
import { usePWAInstall } from './hooks/usePWAInstall';
import { APP_CONFIG, getApiUrl } from './config/appConfig';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { createClientFallbackDiagnosis } from './utils/clientFallback';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  Sparkles,
  ShieldCheck,
  Hammer,
  AlertCircle,
  TrendingUp,
  MapPin,
} from 'lucide-react';

const LOCAL_STORAGE_HISTORY_KEY = 'repair_assistant_history_v1';
const LOCAL_STORAGE_CITY_KEY = 'repair_assistant_city_v1';

export default function App() {
  const [description, setDescription] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string>(APP_CONFIG.defaultCity);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<RepairDiagnosis | null>(null);
  const [history, setHistory] = useState<RepairDiagnosis[]>([]);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('input');

  // Modals state
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Native GPS hook
  const {
    status: gpsStatus,
    isLocating: isLocatingGPS,
    coords: userCoords,
    errorMessage: gpsError,
    requestLocation: requestGPS,
  } = useGeolocation(currentCity);

  // PWA install hook
  const { canInstall, triggerInstall } = usePWAInstall();

  // Load history and city on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedCity = localStorage.getItem(LOCAL_STORAGE_CITY_KEY);
      if (savedCity) {
        setCurrentCity(savedCity);
      }
    } catch (e) {
      console.error('Failed to load local data:', e);
    }
  }, []);

  const saveToHistory = (newDiag: RepairDiagnosis) => {
    setHistory((prev) => {
      const updated = [newDiag, ...prev.filter((d) => d.id !== newDiag.id)].slice(0, 30);
      try {
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save history:', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  };

  const handleSelectCity = (city: string) => {
    setCurrentCity(city);
    try {
      localStorage.setItem(LOCAL_STORAGE_CITY_KEY, city);
    } catch (e) {
      console.error('Failed to save city:', e);
    }
  };

  const handleGPSRequest = () => {
    requestGPS({
      onSuccess: (cityName) => {
        handleSelectCity(cityName);
      },
      onDenied: () => {
        setIsCityModalOpen(true);
      },
    });
  };

  const handleAnalyze = async () => {
    if (!description.trim() && !imageBase64) {
      setErrorMsg('Пожалуйста, введите описание проблемы или прикрепите фото.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setDiagnosis(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort('timeout');
    }, APP_CONFIG.clientTimeoutMs);

    try {
      const payload = {
        category: 'general' as RepairCategory,
        description,
        imageBase64,
        imageMimeType: imageFile?.type || 'image/jpeg',
        city: currentCity,
      };

      let result: RepairDiagnosis | null = null;
      const primaryUrl = getApiUrl('/api/diagnose');
      const cloudFallbackUrl = 'https://umnyj-remontnyj-pomoshhnik-1.vercel.app/api/diagnose';

      // Tier 1: If on native Android device, use CapacitorHttp (direct native network stack, zero CORS issues)
      if (Capacitor.isNativePlatform()) {
        try {
          const nativeRes = await CapacitorHttp.request({
            method: 'POST',
            url: primaryUrl,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            data: payload,
            connectTimeout: 45000,
            readTimeout: 45000,
          });

          let data = nativeRes.data;
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch {
              data = null;
            }
          }
          if (data && (data.problemTitle || data.unrecognized || data.errorMessage)) {
            result = data as RepairDiagnosis;
          }
        } catch (nativeErr) {
          console.warn('CapacitorHttp native request failed, falling back to browser fetch:', nativeErr);
        }
      }

      // Tier 2: Standard web fetch against primary and cloud fallback URLs
      if (!result || (!result.problemTitle && !result.unrecognized)) {
        const candidateUrls = Array.from(new Set([primaryUrl, cloudFallbackUrl]));

        for (const targetUrl of candidateUrls) {
          try {
            const res = await fetch(targetUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify(payload),
              signal: controller.signal,
            });

            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const data = await res.json();
              if (data && (data.problemTitle || data.unrecognized || data.errorMessage || data.error)) {
                result = data as RepairDiagnosis;
                break;
              }
            }
          } catch (fetchErr: any) {
            if (fetchErr?.name === 'AbortError') {
              throw fetchErr;
            }
            console.warn(`Fetch to ${targetUrl} failed:`, fetchErr?.message || fetchErr);
          }
        }
      }

      if (result) {
        if (result.unrecognized) {
          setDiagnosis(result as RepairDiagnosis);
          setActiveTab('estimate');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if ((result as any).errorMessage || (result as any).error) {
          setErrorMsg((result as any).errorMessage || (result as any).error);
          return;
        }
      }

      // If server failed (e.g., 500, non-JSON or timeout), engage smart client fallback
      if (!result || !result.problemTitle) {
        console.info('Backend unavailable or returned empty response, engaging client-side heuristic engine');
        result = createClientFallbackDiagnosis('general', description, currentCity, Boolean(imageBase64));
      }

      if (imageBase64 && !result.imageUrl) {
        result.imageUrl = imageBase64;
      }

      setDiagnosis(result as RepairDiagnosis);
      saveToHistory(result as RepairDiagnosis);
      setActiveTab('estimate');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Analysis network/timeout error, recovering via client fallback:', err);
      // Even on timeout or network error, provide instant offline diagnosis so user is never stuck
      try {
        const fallbackResult = createClientFallbackDiagnosis('general', description, currentCity, Boolean(imageBase64));
        if (imageBase64) fallbackResult.imageUrl = imageBase64;
        setDiagnosis(fallbackResult);
        saveToHistory(fallbackResult);
        setActiveTab('estimate');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        setErrorMsg('Произошла ошибка при анализе поломки. Попробуйте еще раз.');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDiagnosis(null);
    setDescription('');
    setImageFile(null);
    setImageBase64(null);
    setErrorMsg(null);
    setActiveTab('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavTabChange = (tab: ActiveNavTab) => {
    if (tab === 'history') {
      setIsHistoryDrawerOpen(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans antialiased text-slate-900 pb-20 sm:pb-12">
      {/* App Header */}
      <Header
        currentCity={currentCity}
        onOpenCitySelect={() => setIsCityModalOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        historyCount={history.length}
        onReset={handleReset}
        isLocatingGPS={isLocatingGPS}
        gpsStatus={gpsStatus}
        onRequestGPS={handleGPSRequest}
        canInstallPWA={canInstall}
        onInstallPWA={triggerInstall}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 pt-3 sm:pt-6 space-y-4">
        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start justify-between gap-3 text-xs sm:text-sm shadow-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-700 font-bold hover:text-red-900 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab 1: Direct Stores View (if selected from bottom nav) */}
        {activeTab === 'stores' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h2 className="font-extrabold text-lg text-slate-900">
                  Строительные магазины в г. {currentCity}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCityModalOpen(true)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 min-h-[44px] flex items-center"
              >
                Сменить город
              </button>
            </div>
            <ErrorBoundary fallbackTitle="Не удалось отобразить карту магазинов">
              <StoreMap currentCityName={currentCity} />
            </ErrorBoundary>
          </div>
        )}

        {/* Tab 2: Estimate / Diagnosis View or Skeleton Loading */}
        {isLoading && (
          <DiagnosisSkeleton currentCity={currentCity} />
        )}

        {!isLoading && activeTab === 'estimate' && diagnosis && (
          <DiagnosisResultView
            diagnosis={diagnosis}
            onReset={handleReset}
            currentCity={currentCity}
          />
        )}

        {/* Tab 3: Input / Form View */}
        {!isLoading && (activeTab === 'input' || (activeTab === 'estimate' && !diagnosis)) && (
          <div className="space-y-4">
            {/* Visual Header Strip (Short & Impactful) */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 text-white rounded-3xl p-4 sm:p-5 shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-1.5 max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 text-[11px] font-bold">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>ИИ-оценка поломки по фото</span>
                </div>
                <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
                  Узнайте честную вилку цен за 5 секунд
                </h1>
                <p className="text-xs text-slate-300 leading-snug">
                  Расчет стоимости деталей, вызова мастера и пошаговый DIY-план ремонта для г. {currentCity}
                </p>
              </div>

              {/* Background accent icon */}
              <div className="absolute right-2 -bottom-3 opacity-15 pointer-events-none text-white hidden sm:block">
                <Hammer className="w-28 h-28" />
              </div>
            </div>

            {/* Photo & Description Input Section */}
            <ProblemInputSection
              description={description}
              onChangeDescription={setDescription}
              imageFile={imageFile}
              imageBase64={imageBase64}
              onSetImage={(file, base64) => {
                setImageFile(file);
                setImageBase64(base64);
              }}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />

            {/* 3 Visual Badges (Compact) */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center flex flex-col items-center">
                <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-1">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="font-bold text-[11px] text-slate-900 leading-tight">Вилка цен</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Без скрытых наценок</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center flex flex-col items-center">
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-1">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-bold text-[11px] text-slate-900 leading-tight">Маркетплейсы</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Прямые ссылки</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center flex flex-col items-center">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                  <Hammer className="w-4 h-4" />
                </div>
                <span className="font-bold text-[11px] text-slate-900 leading-tight">DIY-шаги</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Своими руками</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={handleNavTabChange}
        hasDiagnosis={!!diagnosis}
        historyCount={history.length}
      />

      {/* GPS & Location Modal (Native GPS, no IP) */}
      <GPSPromptModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        currentCity={currentCity}
        onSelectCity={handleSelectCity}
        isLocating={isLocatingGPS}
        locationStatus={gpsStatus}
        errorMessage={gpsError}
        onRequestGPS={handleGPSRequest}
        userCoords={userCoords}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={history}
        onSelectDiagnosis={(item) => {
          setDiagnosis(item);
          setActiveTab('estimate');
          setIsHistoryDrawerOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
