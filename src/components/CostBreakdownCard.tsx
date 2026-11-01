import React, { useState } from 'react';
import {
  Coins,
  Wrench,
  Package,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { RepairDiagnosis, PartItem } from '../types';
import { formatPrice } from '../utils/currency';

interface CostBreakdownCardProps {
  diagnosis: RepairDiagnosis;
  onSearchPart?: (query: string) => void;
}

export const CostBreakdownCard: React.FC<CostBreakdownCardProps> = ({ diagnosis, onSearchPart }) => {
  const [showAllParts, setShowAllParts] = useState(true);

  const formatItemPrice = (val: number) => {
    return formatPrice(val, diagnosis.currency, diagnosis.city);
  };

  const diySavingsMin = Math.max(0, diagnosis.laborCostMin);
  const diySavingsMax = Math.max(0, diagnosis.laborCostMax);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-none">
              Прозрачный расчет стоимости
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ориентировочная смета ({diagnosis.currency || 'сом'}) для {diagnosis.city || 'г. Бишкек'}
            </p>
          </div>
        </div>

        {/* DIY savings badge */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          <span>Экономия своими руками: ~{formatItemPrice(diySavingsMin)}</span>
        </div>
      </div>

      {/* 3 Main Price Metrics in Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Parts Price */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-600" /> Детали и материалы
            </span>
            <span className="text-[11px] text-slate-400">вилка цен</span>
          </div>
          <div>
            <div className="font-bold text-base sm:text-lg text-slate-900">
              {diagnosis.partsCostMin === 0 && diagnosis.partsCostMax === 0
                ? `${formatItemPrice(0)} (не требуются)`
                : `${formatItemPrice(diagnosis.partsCostMin)} – ${formatItemPrice(diagnosis.partsCostMax)}`}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {diagnosis.requiredParts.length} {diagnosis.requiredParts.length === 1 ? 'позиция' : 'позиции'}
            </p>
          </div>
        </div>

        {/* 2. Master's Labor Price */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-600" /> Работа мастера
            </span>
            <span className="text-[11px] text-slate-400">вызов + услуга</span>
          </div>
          <div>
            <div className="font-bold text-base sm:text-lg text-slate-900">
              {formatItemPrice(diagnosis.laborCostMin)} – {formatItemPrice(diagnosis.laborCostMax)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Ориентир: {diagnosis.estimatedTime}
            </p>
          </div>
        </div>

        {/* 3. Total Price */}
        <div className="p-3.5 rounded-xl bg-orange-50/80 border border-orange-200 ring-1 ring-orange-400/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-orange-950 mb-1">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-orange-600" /> Итоговая смета
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-200/70 text-orange-900 font-semibold">
              всего
            </span>
          </div>
          <div>
            <div className="font-extrabold text-lg sm:text-xl text-orange-900">
              {formatItemPrice(diagnosis.totalCostMin)} – {formatItemPrice(diagnosis.totalCostMax)}
            </div>
            <p className="text-[11px] text-orange-700/80 mt-0.5">
              Детали + вызов специалиста
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Required Parts Breakdown */}
      {diagnosis.requiredParts && diagnosis.requiredParts.length > 0 && (
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAllParts(!showAllParts)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-orange-600 transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>Необходимые запчасти и расходные материалы ({diagnosis.requiredParts.length})</span>
              {showAllParts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[11px] text-slate-500">Средние цены розницы</span>
          </div>

          {showAllParts && (
            <div className="space-y-1.5">
              {diagnosis.requiredParts.map((part, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                >
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-500 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{part.name}</span>
                          {part.optional && (
                            <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-slate-200 text-slate-600">
                              опционально
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">{part.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {part.priceMin === 0 && part.priceMax === 0
                          ? 'Бесплатно'
                          : `${formatItemPrice(part.priceMin)} – ${formatItemPrice(part.priceMax)}`}
                      </span>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

