import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Printer,
  RotateCcw,
  Share2,
  Sparkles,
  Info,
  ShieldCheck,
  Package,
  MapPin,
  ListOrdered,
  ExternalLink,
} from 'lucide-react';
import { RepairDiagnosis } from '../types';
import { formatPrice } from '../utils/currency';
import { VisualCostMeter } from './VisualCostMeter';
import { CostBreakdownCard } from './CostBreakdownCard';
import { StoreMap } from './StoreMap';
import { ExternalLinksSection } from './ExternalLinksSection';
import { StepProgressGuide } from './StepProgressGuide';
import { ErrorBoundary } from './ErrorBoundary';

interface DiagnosisResultViewProps {
  diagnosis: RepairDiagnosis;
  onReset: () => void;
  currentCity: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export const DiagnosisResultView: React.FC<DiagnosisResultViewProps> = ({
  diagnosis,
  onReset,
  currentCity,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'cost' | 'steps' | 'links' | 'map'>('all');

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return {
          bg: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-bounce" />,
          label: 'Критично',
        };
      case 'high':
        return {
          bg: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />,
          label: 'Срочно',
        };
      case 'medium':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Info className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Средняя срочность',
        };
      case 'low':
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Планово',
        };
    }
  };

  const urgencyInfo = getUrgencyBadge(diagnosis.urgency);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const cur = diagnosis.currency || 'сом';
    const totalMin = formatPrice(diagnosis.totalCostMin, cur, currentCity);
    const totalMax = formatPrice(diagnosis.totalCostMax, cur, currentCity);
    const partsMin = formatPrice(diagnosis.partsCostMin, cur, currentCity);
    const partsMax = formatPrice(diagnosis.partsCostMax, cur, currentCity);
    const laborMin = formatPrice(diagnosis.laborCostMin, cur, currentCity);
    const laborMax = formatPrice(diagnosis.laborCostMax, cur, currentCity);

    const shareTitle = `Оценка ремонта: ${diagnosis.problemTitle}`;
    const shareText = `Оценка ремонта: ${diagnosis.problemTitle}\nВилка цен: ${totalMin} – ${totalMax}\nДетали: ${partsMin} – ${partsMax}\nМастер: ${laborMin} – ${laborMax}\nГород: ${currentCity || 'Бишкек'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Смета ремонта: ${totalMin} – ${totalMax}. Поломка: ${diagnosis.problemTitle}`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Смета скопирована в буфер обмена!');
    }
  };

  if (diagnosis.unrecognized) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-lg space-y-5 text-center max-w-xl mx-auto my-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center text-amber-600 mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {diagnosis.problemTitle || 'Не удалось распознать проблему'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {diagnosis.errorMessage || 'Введенный текст не содержит описания неисправности или похож на случайный набор символов.'}
          </p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-left text-xs sm:text-sm text-slate-700 space-y-2">
          <p className="font-bold text-slate-900">Как получить точный расчет:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Опишите неисправность словами (например: «течет кран на кухне», «не греет бойлер»)</li>
            <li>Или сделайте четкое фото поломки на камеру телефона</li>
          </ul>
        </div>

        <button
          onClick={onReset}
          className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm sm:text-base transition shadow-md shadow-orange-600/20 active:scale-[0.98]"
        >
          Описать поломку заново
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* 1. Compact Hero Summary Card (Cascade Item 1) */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-md shadow-orange-500/5 space-y-3"
      >
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${urgencyInfo.bg} shadow-2xs`}
            >
              {urgencyInfo.icon}
              <span>{diagnosis.urgencyLabel || urgencyInfo.label}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 shadow-2xs">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              <span>{diagnosis.difficultyLabel}</span>
            </span>

            {diagnosis.isFallback ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                <ShieldCheck className="w-3 h-3 text-amber-600" />
                <span>База знаний</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>ИИ Gemini</span>
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>~{diagnosis.estimatedTime}</span>
          </div>
        </div>

        {/* Diagnosis Title & Cause Pill */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug tracking-tight">
            {diagnosis.problemTitle}
          </h2>

          <div className="flex items-start gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
            <span className="font-bold text-slate-900 shrink-0">Причина:</span>
            <span className="leading-relaxed">{diagnosis.probableCause}</span>
          </div>
        </div>

        {/* Optional Image thumbnail */}
        {diagnosis.imageUrl && (
          <div className="rounded-2xl overflow-hidden max-h-40 border border-slate-200 bg-slate-950 flex items-center justify-center shadow-inner">
            <img
              src={diagnosis.imageUrl}
              alt="Фото поломки"
              className="max-h-40 w-auto object-contain"
            />
          </div>
        )}
      </motion.div>

      {/* 2. Visual Cost Breakdown Meter (Cascade Item 2) */}
      <motion.div variants={itemVariants}>
        <VisualCostMeter diagnosis={diagnosis} />
      </motion.div>

      {/* Section View Tabs for Fast Navigation (Cascade Item 3) */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-1 p-1 rounded-2xl bg-slate-200/70 overflow-x-auto text-xs font-bold no-print"
      >
        <button
          type="button"
          onClick={() => setActiveSection('all')}
          className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-xl transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
            activeSection === 'all'
              ? 'bg-white text-orange-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Все
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('cost')}
          className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
            activeSection === 'cost'
              ? 'bg-white text-orange-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-amber-600" />
          <span>Смета & Запчасти</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('steps')}
          className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
            activeSection === 'steps'
              ? 'bg-white text-orange-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5 text-orange-600" />
          <span>DIY-план</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('links')}
          className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
            activeSection === 'links'
              ? 'bg-white text-orange-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          <span>Где купить & Мастера</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('map')}
          className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
            activeSection === 'map'
              ? 'bg-white text-orange-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-red-600" />
          <span>Магазины</span>
        </button>
      </motion.div>

      {/* 3. Detailed Cost Breakdown & Parts */}
      {(activeSection === 'all' || activeSection === 'cost') && (
        <motion.div variants={itemVariants}>
          <CostBreakdownCard diagnosis={diagnosis} />
        </motion.div>
      )}

      {/* 4. Interactive Step-by-Step DIY Guide */}
      {(activeSection === 'all' || activeSection === 'steps') && (
        <motion.div variants={itemVariants}>
          <StepProgressGuide diagnosis={diagnosis} />
        </motion.div>
      )}

      {/* 5. Direct External Marketplace Links for Parts and Masters */}
      {(activeSection === 'all' || activeSection === 'links') && (
        <motion.div variants={itemVariants}>
          <ExternalLinksSection
            partsSearchQuery={diagnosis.partsSearchQuery}
            masterSearchQuery={diagnosis.masterSearchQuery}
            currentCity={currentCity}
          />
        </motion.div>
      )}

      {/* 6. Interactive Store Map */}
      {(activeSection === 'all' || activeSection === 'map') && (
        <motion.div variants={itemVariants}>
          <ErrorBoundary fallbackTitle="Не удалось загрузить карту магазинов">
            <StoreMap currentCityName={currentCity} />
          </ErrorBoundary>
        </motion.div>
      )}

      {/* Sticky Action Footer */}
      <motion.div
        variants={itemVariants}
        className="sticky bottom-16 sm:bottom-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between gap-2 no-print"
      >
        <motion.button
          id="btn-new-calculation"
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="min-h-[44px] flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-600" />
          <span>Новый расчет</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            title="Распечатать смету"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Печать</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="min-h-[44px] flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-black transition-all shadow-sm shadow-orange-600/20 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Поделиться</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
