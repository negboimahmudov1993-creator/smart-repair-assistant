import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2, Bot } from 'lucide-react';

interface DiagnosisSkeletonProps {
  currentCity: string;
}

export const DiagnosisSkeleton: React.FC<DiagnosisSkeletonProps> = ({ currentCity }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-4"
    >
      {/* Top AI Status Notice Card */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/15 to-orange-500/10 border border-orange-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 relative">
            <Bot className="w-5 h-5 animate-bounce" />
            <span className="absolute -inset-1 rounded-2xl bg-orange-400/40 animate-ping pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                ИИ Gemini рассчитывает смету ремонта
              </h3>
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Сверяем цены на детали в магазинах г. {currentCity} и тарифы мастеров...
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-orange-200 text-xs font-bold text-orange-800">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600" />
          <span>Анализ...</span>
        </div>

        {/* Shimmer line effect across card */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
      </div>

      {/* 1. Hero Skeleton Card */}
      <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-md shadow-orange-500/5 space-y-4 animate-pulse">
        {/* Badges placeholder */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-24 bg-slate-200 rounded-full" />
          <div className="h-6 w-32 bg-slate-200 rounded-full" />
          <div className="h-6 w-20 bg-slate-200 rounded-full ml-auto" />
        </div>

        {/* Title placeholder */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-slate-200 rounded-xl" />
          <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
        </div>

        {/* Cause block placeholder */}
        <div className="p-3 bg-slate-100/80 rounded-2xl space-y-2">
          <div className="h-3.5 w-full bg-slate-200 rounded-md" />
          <div className="h-3.5 w-4/5 bg-slate-200 rounded-md" />
        </div>
      </div>

      {/* 2. Visual Cost Meter Skeleton */}
      <div className="bg-gradient-to-br from-white via-orange-50/20 to-amber-50/25 rounded-3xl p-4 sm:p-5 border border-orange-200/70 shadow-md shadow-orange-500/5 space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-slate-200 rounded-md" />
            <div className="h-7 w-48 bg-orange-200/70 rounded-xl" />
          </div>
          <div className="h-7 w-36 bg-emerald-100 rounded-full" />
        </div>

        {/* Progress Bar Skeleton */}
        <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-300/50 to-blue-300/50 animate-pulse" />
        </div>

        {/* Legend row */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 w-32 bg-slate-200 rounded-md" />
          <div className="h-4 w-32 bg-slate-200 rounded-md" />
        </div>
      </div>

      {/* 3. Cost Breakdown / Parts Skeleton */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-md shadow-orange-500/5 space-y-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 bg-slate-200 rounded-lg" />
          <div className="h-5 w-24 bg-slate-200 rounded-full" />
        </div>

        <div className="space-y-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl flex items-center justify-between"
            >
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-1/2 bg-slate-200 rounded-md" />
                <div className="h-3 w-1/3 bg-slate-100 rounded-md" />
              </div>
              <div className="h-5 w-20 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
