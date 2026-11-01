import React from 'react';
import { Droplets, Zap, Tv, Hammer, ChevronRight } from 'lucide-react';
import { RepairCategory } from '../types';
import { REPAIR_CATEGORIES } from '../data/categories';

interface CategorySelectorProps {
  selectedCategory: RepairCategory;
  onSelectCategory: (category: RepairCategory) => void;
  disabled?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  disabled = false,
}) => {
  const getCategoryIcon = (iconName: string, active: boolean) => {
    const className = `w-5 h-5 ${active ? 'text-orange-600' : 'text-slate-600'}`;
    switch (iconName) {
      case 'Droplets':
        return <Droplets className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Tv':
        return <Tv className={className} />;
      case 'Hammer':
      default:
        return <Hammer className={className} />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <span>1. Выберите категорию поломки</span>
        </label>
        <span className="text-xs text-slate-500">4 направления</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {REPAIR_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`category-btn-${cat.id}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 active:scale-98 ${
                isSelected
                  ? 'bg-orange-50/80 border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                  isSelected ? 'bg-orange-100' : 'bg-slate-100'
                }`}
              >
                {getCategoryIcon(cat.icon, isSelected)}
              </div>
              <div className="font-semibold text-xs sm:text-sm text-slate-900 leading-tight">
                {cat.name}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {cat.subcategories[0]}, {cat.subcategories[1]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
