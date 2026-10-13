import React, { useState } from 'react';
import { MACRO_INDICATORS, MacroIndicator } from '../data/indiaStatsData';
import { TrendingUp, ArrowUpRight, Info, ShieldCheck, Zap, DollarSign, Users, Sparkles, BookOpen } from 'lucide-react';

interface MacroMetricsGridProps {
  onSelectIndicator?: (indicator: MacroIndicator) => void;
}

export const MacroMetricsGrid: React.FC<MacroMetricsGridProps> = ({ onSelectIndicator }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const categories = ['All', 'Economy', 'Demographics', 'Digital', 'Energy', 'Social'];

  const filteredIndicators = selectedCategory === 'All'
    ? MACRO_INDICATORS
    : MACRO_INDICATORS.filter(ind => ind.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Economy':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'Demographics':
        return <Users className="w-4 h-4 text-sky-400" />;
      case 'Digital':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Energy':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Social':
        return <BookOpen className="w-4 h-4 text-rose-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Chips */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            National Macro Dashboard
          </h2>
          <p className="text-xs text-slate-400">MoSPI, RBI, NITI Aayog &amp; official departmental estimates</p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredIndicators.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectIndicator && onSelectIndicator(item)}
            className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/90 text-slate-300 border border-slate-700/50">
                {getCategoryIcon(item.category)}
                {item.category}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{item.period}</span>
            </div>

            <div className="mt-1">
              <span className="text-xs font-medium text-slate-400">{item.title}</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-100 tracking-tight group-hover:text-orange-300 transition-colors">
                  {item.value}
                </span>
                <span className="text-xs text-slate-400 font-normal">{item.unit}</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3" />
                {item.change}
              </span>
              <button
                type="button"
                onMouseEnter={() => setActiveTooltip(item.id)}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded"
                title="Details"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hover Tooltip / Description */}
            {activeTooltip === item.id && (
              <div className="absolute left-2 right-2 bottom-full mb-2 bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl text-xs z-20 shadow-xl pointer-events-none">
                <p className="font-semibold text-orange-400 mb-0.5">{item.title}</p>
                <p className="text-slate-300">{item.description}</p>
                <div className="mt-1.5 text-[10px] text-slate-400 italic">Source: {item.source}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
