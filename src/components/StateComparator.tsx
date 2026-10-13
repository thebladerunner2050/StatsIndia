import React, { useState } from 'react';
import { StateData, STATES_DATA } from '../data/indiaStatsData';
import { Scale, CheckCircle2, TrendingUp, Award, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

export const StateComparator: React.FC = () => {
  const [state1Id, setState1Id] = useState<string>('MH'); // Maharashtra
  const [state2Id, setState2Id] = useState<string>('KA'); // Karnataka
  const [state3Id, setState3Id] = useState<string>('TN'); // Tamil Nadu

  const state1 = STATES_DATA.find((s) => s.id === state1Id) || STATES_DATA[0];
  const state2 = STATES_DATA.find((s) => s.id === state2Id) || STATES_DATA[1];
  const state3 = state3Id ? STATES_DATA.find((s) => s.id === state3Id) : undefined;

  const states = [state1, state2, ...(state3 ? [state3] : [])];

  const comparisonMetrics: Array<{
    label: string;
    key: keyof StateData;
    unit: string;
    format: (val: any) => string;
    higherIsBetter: boolean;
    description: string;
  }> = [
    {
      label: 'Gross State Domestic Product (GSDP)',
      key: 'gsdpUsdBn',
      unit: 'USD Billion',
      format: (v) => `$${v} Bn`,
      higherIsBetter: true,
      description: 'Overall economic output and state economic power.'
    },
    {
      label: 'Per Capita GSDP',
      key: 'perCapitaInr',
      unit: '₹ / Year',
      format: (v) => `₹${Number(v).toLocaleString('en-IN')}`,
      higherIsBetter: true,
      description: 'Average annual economic production per citizen.'
    },
    {
      label: 'Total Literacy Rate',
      key: 'literacyRate',
      unit: '%',
      format: (v) => `${v}%`,
      higherIsBetter: true,
      description: 'Percentage of population age 7+ literate.'
    },
    {
      label: 'Female Literacy Rate',
      key: 'femaleLiteracy',
      unit: '%',
      format: (v) => `${v}%`,
      higherIsBetter: true,
      description: 'Crucial metric for gender parity and human development.'
    },
    {
      label: 'NITI Aayog SDG Index',
      key: 'sdgScore',
      unit: '/100',
      format: (v) => `${v} / 100`,
      higherIsBetter: true,
      description: 'Composite Sustainable Development Goal score by NITI Aayog.'
    },
    {
      label: 'Multidimensional Poverty Rate',
      key: 'povertyRate',
      unit: '%',
      format: (v) => `${v}%`,
      higherIsBetter: false,
      description: 'Health, education, and standard of living deprivation (lower is better).'
    },
    {
      label: 'Sex Ratio',
      key: 'sexRatio',
      unit: 'F per 1,000 M',
      format: (v) => `${v}`,
      higherIsBetter: true,
      description: 'Females per 1,000 males in the population.'
    },
    {
      label: 'Urbanization Rate',
      key: 'urbanizationRate',
      unit: '%',
      format: (v) => `${v}%`,
      higherIsBetter: true,
      description: 'Proportion of population dwelling in urban municipal centres.'
    },
    {
      label: 'Renewable Power Capacity',
      key: 'renewableEnergyMw',
      unit: 'MW',
      format: (v) => `${Number(v).toLocaleString('en-IN')} MW`,
      higherIsBetter: true,
      description: 'Installed solar, wind, and green energy generation.'
    },
    {
      label: 'Population',
      key: 'population',
      unit: 'Million',
      format: (v) => `${Number(v).toFixed(1)} M`,
      higherIsBetter: true,
      description: 'Total estimated resident population.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Comparator Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-orange-400" />
              Head-to-Head State &amp; UT Comparator
            </h2>
            <p className="text-xs text-slate-400">
              Select 2 or 3 states to analyze socio-economic trajectories, governance indices, and industrial strength.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Presets:</span>
            <button
              onClick={() => { setState1Id('MH'); setState2Id('TN'); setState3Id('GJ'); }}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              Economic Powerhouses
            </button>
            <button
              onClick={() => { setState1Id('KL'); setState2Id('UK'); setState3Id('HP'); }}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              High SDG Leaders
            </button>
            <button
              onClick={() => { setState1Id('KA'); setState2Id('TG'); setState3Id('DL'); }}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              Tech &amp; Innovation
            </button>
          </div>
        </div>

        {/* State Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-orange-400 mb-1">State / UT 1</label>
            <select
              value={state1Id}
              onChange={(e) => setState1Id(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {STATES_DATA.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-1">State / UT 2</label>
            <select
              value={state2Id}
              onChange={(e) => setState2Id(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {STATES_DATA.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-400 mb-1">State / UT 3 (Optional)</label>
            <select
              value={state3Id}
              onChange={(e) => setState3Id(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- None (Compare 2) --</option>
              {STATES_DATA.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* State Overview Snapshot Cards */}
      <div className={`grid grid-cols-1 ${states.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
        {states.map((st, idx) => {
          const accentColor = idx === 0 ? 'border-orange-500/50' : idx === 1 ? 'border-emerald-500/50' : 'border-purple-500/50';
          const badgeColor = idx === 0 ? 'bg-orange-500/10 text-orange-400' : idx === 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400';

          return (
            <div key={st.id} className={`bg-slate-900 border ${accentColor} rounded-2xl p-4 shadow-md`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-extrabold text-base text-slate-100">{st.name}</h3>
                  <p className="text-xs text-slate-400">{st.capital} • {st.region} Region</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                  {st.type}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">{st.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {st.keySectors.map((sec) => (
                  <span key={sec} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                    {sec}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Metrics Table & Visual Bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200">Dimension-by-Dimension Breakdown</h3>
          <span className="text-xs text-slate-400">Green highlight denotes highest performer</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {comparisonMetrics.map((metric) => {
            // Find best performer
            const values = states.map((s) => s[metric.key] as number);
            const bestVal = metric.higherIsBetter ? Math.max(...values) : Math.min(...values);

            return (
              <div key={metric.key} className="p-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                  <div>
                    <span className="text-xs font-bold text-slate-200">{metric.label}</span>
                    <span className="text-[11px] text-slate-400 block sm:inline sm:ml-2">
                      ({metric.description})
                    </span>
                  </div>
                </div>

                {/* Values & Comparative Bar Chart */}
                <div className={`grid grid-cols-1 ${states.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3 mt-2`}>
                  {states.map((st, idx) => {
                    const val = st[metric.key] as number;
                    const isWinner = val === bestVal;
                    const barPct = Math.max(10, (val / Math.max(...values)) * 100);

                    const colorClass = idx === 0 ? 'bg-orange-500' : idx === 1 ? 'bg-emerald-500' : 'bg-purple-500';

                    return (
                      <div
                        key={st.id}
                        className={`p-2.5 rounded-xl border ${
                          isWinner ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-950/60 border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-400 font-medium">{st.name}</span>
                          <div className="flex items-center gap-1.5 font-bold font-mono text-slate-100">
                            {metric.format(val)}
                            {isWinner && (
                              <Award className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                        </div>

                        {/* Relative Bar */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colorClass} rounded-full transition-all duration-300`}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
