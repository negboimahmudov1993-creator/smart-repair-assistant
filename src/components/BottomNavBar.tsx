import React from 'react';
import { motion } from 'motion/react';
import { Camera, Coins, MapPin, History } from 'lucide-react';

export type ActiveNavTab = 'input' | 'estimate' | 'stores' | 'history';

interface BottomNavBarProps {
  activeTab: ActiveNavTab;
  onChangeTab: (tab: ActiveNavTab) => void;
  hasDiagnosis: boolean;
  historyCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  hasDiagnosis,
  historyCount,
}) => {
  const tabs = [
    {
      id: 'input' as ActiveNavTab,
      label: 'Анализ',
      icon: Camera,
      badge: null,
    },
    {
      id: 'estimate' as ActiveNavTab,
      label: 'Смета',
      icon: Coins,
      badge: hasDiagnosis ? '✓' : null,
      disabled: !hasDiagnosis,
    },
    {
      id: 'stores' as ActiveNavTab,
      label: 'Магазины',
      icon: MapPin,
      badge: null,
    },
    {
      id: 'history' as ActiveNavTab,
      label: 'История',
      icon: History,
      badge: historyCount > 0 ? (historyCount > 9 ? '9+' : String(historyCount)) : null,
    },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl transition-all sm:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
    >
      <div className="flex items-center justify-around px-2 py-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              type="button"
              disabled={tab.disabled}
              whileTap={!tab.disabled ? { scale: 0.9 } : {}}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl transition-colors select-none cursor-pointer ${
                tab.disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : isActive
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <motion.span
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className={`absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-extrabold flex items-center justify-center text-white shadow-xs ${
                      isActive ? 'bg-orange-600' : 'bg-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </motion.span>
                )}
              </div>

              <span className="text-[10px] tracking-tight mt-1 leading-none font-medium">
                {tab.label}
              </span>

              {/* Active Tab Animated Underline Pill */}
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-active-pill"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute bottom-0.5 w-6 h-1 bg-orange-600 rounded-full shadow-xs shadow-orange-600/50"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
