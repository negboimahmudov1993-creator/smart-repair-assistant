import React, { useState } from 'react';
import {
  ShieldAlert,
  Wrench,
  CheckCircle2,
  Lightbulb,
  ListOrdered,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { RepairDiagnosis } from '../types';

interface DIYGuideSectionProps {
  diagnosis: RepairDiagnosis;
}

export const DIYGuideSection: React.FC<DIYGuideSectionProps> = ({ diagnosis }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-none">
              Пошаговая инструкция и техника безопасности
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Сложность: {diagnosis.difficultyLabel} • Время: {diagnosis.estimatedTime}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Safety Notice Warning Banner */}
      {diagnosis.safetyNotice && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-2.5 text-xs">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-red-900">Правило безопасности:</span>
            <span className="text-red-800 leading-relaxed">{diagnosis.safetyNotice}</span>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-3 pt-1">
          {/* Required Tools */}
          {diagnosis.requiredTools && diagnosis.requiredTools.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5 mb-2">
                <Wrench className="w-3.5 h-3.5 text-slate-600" />
                <span>Необходимые инструменты:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {diagnosis.requiredTools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium text-[11px]"
                  >
                    • {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step numbered list */}
          {diagnosis.stepByStepGuide && diagnosis.stepByStepGuide.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Алгоритм действий своими руками:
              </span>
              <div className="space-y-2">
                {diagnosis.stepByStepGuide.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 text-xs text-slate-800"
                  >
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pro Tips */}
          {diagnosis.proTips && diagnosis.proTips.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1.5">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Советы мастера:</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-amber-900 text-[11px] leading-relaxed">
                {diagnosis.proTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
