import React, { useState } from 'react';
import {
  ExternalLink,
  ShoppingCart,
  UserCheck,
  Search,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { PART_MARKETPLACES, MASTER_PLATFORMS } from '../data/externalServices';

interface ExternalLinksSectionProps {
  partsSearchQuery: string;
  masterSearchQuery: string;
  currentCity?: string;
}

export const ExternalLinksSection: React.FC<ExternalLinksSectionProps> = ({
  partsSearchQuery,
  masterSearchQuery,
  currentCity = 'Москва',
}) => {
  const [activeTab, setActiveTab] = useState<'parts' | 'masters'>('parts');
  const [customPartsQuery, setCustomPartsQuery] = useState(partsSearchQuery);
  const [customMasterQuery, setCustomMasterQuery] = useState(masterSearchQuery);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-orange-600" />
            <span>Прямые ссылки на сторонние площадки</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Переходите на проверенные маркетплейсы и сервисы без переплат и посредников
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('parts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'parts'
                ? 'bg-white text-orange-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
            <span>Где купить детали ({PART_MARKETPLACES.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('masters')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'masters'
                ? 'bg-white text-orange-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Где найти мастера ({MASTER_PLATFORMS.length})</span>
          </button>
        </div>
      </div>

      {/* Parts Marketplace Tab */}
      {activeTab === 'parts' && (
        <div className="space-y-3">
          {/* Query search modifier */}
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-amber-950 font-medium">
                Поисковый запрос для запчастей:
              </span>
            </div>
            <div className="flex-1 max-w-sm">
              <input
                type="text"
                value={customPartsQuery}
                onChange={(e) => setCustomPartsQuery(e.target.value)}
                placeholder="Запрос для каталогов..."
                className="w-full px-2.5 py-1 text-xs rounded-lg bg-white border border-amber-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PART_MARKETPLACES.map((service, idx) => {
              const url = service.getUrl(customPartsQuery || partsSearchQuery, currentCity);
              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 hover:border-orange-400 hover:bg-orange-50/30 bg-white transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${service.color} text-white font-black text-xs flex items-center justify-center shadow-xs`}
                        >
                          {service.logoText}
                        </div>
                        <span className="font-bold text-sm text-slate-900 group-hover:text-orange-900 transition-colors">
                          {service.name}
                        </span>
                      </div>
                      {service.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-orange-600 group-hover:text-orange-700">
                    <span>Открыть каталог</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Masters Platforms Tab */}
      {activeTab === 'masters' && (
        <div className="space-y-3">
          {/* Query search modifier */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/70 text-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-700 shrink-0" />
              <span className="text-blue-950 font-medium">
                Поисковый запрос для поиска мастера:
              </span>
            </div>
            <div className="flex-1 max-w-sm">
              <input
                type="text"
                value={customMasterQuery}
                onChange={(e) => setCustomMasterQuery(e.target.value)}
                placeholder="Запрос для бирж услуг..."
                className="w-full px-2.5 py-1 text-xs rounded-lg bg-white border border-blue-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {MASTER_PLATFORMS.map((service, idx) => {
              const url = service.getUrl(customMasterQuery || masterSearchQuery, currentCity);
              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 bg-white transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${service.color} text-white font-bold text-[10px] tracking-tight flex items-center justify-center shadow-xs`}
                        >
                          {service.logoText}
                        </div>
                        <span className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                          {service.name}
                        </span>
                      </div>
                      {service.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                    <span>Искать исполнителей</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              );
            })}
          </div>

          {/* Master hiring safety checklist */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Советы при заказе мастера на сторонних сервисах:</span>
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
              <li>Согласуйте окончательную цену ДО начала работ, опираясь на нашу вилку цен.</li>
              <li>Никогда не вносите предоплату незнакомым частным мастерам.</li>
              <li>Проверяйте отзывы с реальными фото выполненных заказов.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
