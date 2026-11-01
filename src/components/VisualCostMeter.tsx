import React from 'react';
import { motion } from 'motion/react';
import { TrendingDown } from 'lucide-react';
import { RepairDiagnosis } from '../types';
import { formatPrice } from '../utils/currency';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface VisualCostMeterProps {
  diagnosis: RepairDiagnosis;
}

export const VisualCostMeter: React.FC<VisualCostMeterProps> = ({ diagnosis }) => {
  const cur = diagnosis.currency || 'сом';
  const city = diagnosis.city;

  // Animated numbers
  const animatedTotalMin = useAnimatedCounter(diagnosis.totalCostMin, 900);
  const animatedTotalMax = useAnimatedCounter(diagnosis.totalCostMax, 1000);
  const animatedPartsMin = useAnimatedCounter(diagnosis.partsCostMin, 800);
  const animatedLaborMin = useAnimatedCounter(diagnosis.laborCostMin, 850);
  const animatedDiySavings = useAnimatedCounter(diagnosis.laborCostMin, 950);

  const partsAvg = (diagnosis.partsCostMin + diagnosis.partsCostMax) / 2;
  const laborAvg = (diagnosis.laborCostMin + diagnosis.laborCostMax) / 2;
  const totalAvg = Math.max(1, partsAvg + laborAvg);

  const partsPercent = Math.round((partsAvg / totalAvg) * 100);
  const laborPercent = Math.max(0, 100 - partsPercent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-gradient-to-br from-white via-orange-50/25 to-amber-50/35 rounded-3xl p-4 sm:p-5 border border-orange-200/80 shadow-md shadow-orange-500/5 space-y-4 hover:shadow-lg hover:border-orange-300 transition-all duration-300"
    >
      {/* Top row: Total sum & DIY savings pill */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Итоговая смета ремонта
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight tabular-nums flex items-baseline gap-1">
            <span>{formatPrice(animatedTotalMin, cur, city)}</span>
            <span className="text-slate-400 font-semibold text-lg">–</span>
            <span>{formatPrice(animatedTotalMax, cur, city)}</span>
          </div>
        </div>

        {diagnosis.laborCostMax > 0 && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.35, ease: 'easeOut' }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-extrabold shadow-2xs hover:bg-emerald-500/15 transition-colors"
          >
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="tabular-nums">
              Экономия DIY: ~{formatPrice(animatedDiySavings, cur, city)}
            </span>
          </motion.div>
        )}
      </div>

      {/* Visual Proportion Bar with Animated Fill */}
      <div className="space-y-2">
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 shadow-inner">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${Math.max(8, partsPercent)}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-l-full relative"
            title={`Запчасти: ${partsPercent}%`}
          />
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${Math.max(8, laborPercent)}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-r-full relative"
            title={`Работа мастера: ${laborPercent}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-2xs" />
            <span className="text-slate-800 font-semibold tabular-nums">
              Детали: {formatPrice(animatedPartsMin, cur, city)}
            </span>
            <span className="text-slate-400 text-[10px] font-bold">({partsPercent}%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 shadow-2xs" />
            <span className="text-slate-800 font-semibold tabular-nums">
              Мастер: {formatPrice(animatedLaborMin, cur, city)}
            </span>
            <span className="text-slate-400 text-[10px] font-bold">({laborPercent}%)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
