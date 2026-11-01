import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Wrench,
  ShieldAlert,
  Lightbulb,
  Trophy,
} from 'lucide-react';
import { RepairDiagnosis } from '../types';

interface StepProgressGuideProps {
  diagnosis: RepairDiagnosis;
}

export const StepProgressGuide: React.FC<StepProgressGuideProps> = ({ diagnosis }) => {
  const steps = diagnosis.stepByStepGuide || [];
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const progressPercent =
    steps.length > 0 ? Math.round((completedSteps.length / steps.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-md shadow-orange-500/5 space-y-4"
    >
      {/* Header with Animated Progress Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 font-black text-xs flex items-center justify-center shadow-xs">
              DIY
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-none tracking-tight">
                Интерактивный степпер ремонта
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Отмечайте выполненные шаги по мере починки
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-orange-600 tabular-nums">
              {completedSteps.length} / {steps.length}
            </span>
            <span className="text-[10px] text-slate-400 block font-bold tabular-nums">
              {progressPercent}% выполнено
            </span>
          </div>
        </div>

        {/* Visual Progress Track with Smooth Ease-Out Fill */}
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Safety Alert */}
      {diagnosis.safetyNotice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-3 rounded-2xl bg-red-50/90 border border-red-200/80 text-red-950 flex items-start gap-2.5 text-xs shadow-2xs"
        >
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="font-bold text-red-900 block">Безопасность:</span>
            <span className="text-red-800 leading-tight">{diagnosis.safetyNotice}</span>
          </div>
        </motion.div>
      )}

      {/* Tools required (Visual Chips with Hover Micro-Animation) */}
      {diagnosis.requiredTools && diagnosis.requiredTools.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-slate-500" />
            <span>Инструменты ({diagnosis.requiredTools.length}):</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {diagnosis.requiredTools.map((tool, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors shadow-2xs"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Stepper Checklist with Interactive Pop Checkboxes */}
      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isDone = completedSteps.includes(idx);
          const cleanText = step.replace(/^\d+\.\s*/, '');

          return (
            <motion.button
              key={idx}
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => toggleStep(idx)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3 min-h-[44px] cursor-pointer ${
                isDone
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs'
                  : 'bg-slate-50/80 hover:bg-white hover:border-slate-300 border-slate-200 text-slate-800 shadow-2xs'
              }`}
            >
              <div className="mt-0.5 shrink-0 relative">
                {isDone ? (
                  <motion.div
                    key="checked"
                    initial={{ scale: 0.6, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="relative"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    {/* Expanding ripple pulse */}
                    <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="unchecked"
                    whileHover={{ scale: 1.1 }}
                    className="w-5 h-5 rounded-full border-2 border-slate-400 hover:border-orange-500 flex items-center justify-center text-[10px] font-black text-slate-600 transition-colors"
                  >
                    {idx + 1}
                  </motion.div>
                )}
              </div>
              <div className="flex-1">
                <span
                  className={`text-xs sm:text-sm font-medium leading-relaxed block transition-all duration-200 ${
                    isDone ? 'line-through text-emerald-800/80' : 'text-slate-800'
                  }`}
                >
                  {cleanText}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Completion Trophy with Pop Animation when 100% */}
      <AnimatePresence>
        {steps.length > 0 && completedSteps.length === steps.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 border border-emerald-500/30 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-md shadow-emerald-500/10"
          >
            <motion.div
              animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <Trophy className="w-5 h-5 text-emerald-600 shrink-0" />
            </motion.div>
            <span>Отличная работа! Все шаги ремонта выполнены своими руками.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro Tips with Soft Float Badge */}
      {diagnosis.proTips && diagnosis.proTips.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold">
            <Lightbulb className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Совет эксперта:</span>
          </div>
          <p className="text-amber-800 leading-relaxed text-[11px] font-medium">
            {diagnosis.proTips[0]}
          </p>
        </div>
      )}
    </motion.div>
  );
};
