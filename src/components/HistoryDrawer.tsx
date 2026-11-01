import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Clock, ChevronRight, History } from 'lucide-react';
import { RepairDiagnosis } from '../types';
import { formatPrice } from '../utils/currency';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: RepairDiagnosis[];
  onSelectDiagnosis: (diagnosis: RepairDiagnosis) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectDiagnosis,
  onClearHistory,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop with smooth blur fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
          />

          {/* Drawer Slide-In from Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
                  <History className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                  История расчетов
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {history.length}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* List of past diagnoses */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <History className="w-10 h-10 mx-auto opacity-30" />
                  <p className="text-sm font-bold text-slate-700">История расчетов пуста</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Здесь будут сохраняться все выполненные вами оценки поломок и сметы.
                  </p>
                </div>
              ) : (
                history.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      onSelectDiagnosis(item);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 bg-white transition-all cursor-pointer group space-y-2 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-orange-950 line-clamp-1">
                        {item.problemTitle}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(item.createdAt)}</span>
                      </span>
                      <span className="font-black text-slate-900 tabular-nums">
                        {formatPrice(item.totalCostMin, item.currency, item.city)} – {formatPrice(item.totalCostMax, item.currency, item.city)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {history.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClearHistory}
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Очистить историю
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Закрыть
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
