import React, { useState, useMemo } from 'react';
import { StateData, STATES_DATA } from '../data/indiaStatsData';
import { Filter, ArrowUpDown, MapPin, Building, Users, BookOpen, Zap, Sparkles, ChevronRight, Award } from 'lucide-react';

interface StateMapAndGridProps {
  onSelectState: (state: StateData) => void;
  searchQuery: string;
}

type MetricKey = 'gsdpUsdBn' | 'perCapitaInr' | 'literacyRate' | 'population' | 'sdgScore' | 'renewableEnergyMw';

export const StateMapAndGrid: React.FC<StateMapAndGridProps> = ({ onSelectState, searchQuery }) => {
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [activeMetric, setActiveMetric] = useState<MetricKey>('gsdpUsdBn');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);

  const metricConfigs: Record<MetricKey, { label: string; unit: string; format: (v: number) => string; color: string }> = {
    gsdpUsdBn: {
      label: 'GSDP (Economy)',
      unit: 'USD Billion',
      format: (v) => `$${v} Bn`,
      color: 'from-orange-500 to-amber-500'
    },
    perCapitaInr: {
      label: 'Per Capita Income',
      unit: '₹ / year',
      format: (v) => `₹${v.toLocaleString('en-IN')}`,
      color: 'from-emerald-500 to-teal-500'
    },
    literacyRate: {
      label: 'Literacy Rate',
      unit: '%',
      format: (v) => `${v}%`,
      color: 'from-blue-500 to-cyan-500'
    },
    population: {
      label: 'Population',
      unit: 'Million',
      format: (v) => `${v.toFixed(1)} M`,
      color: 'from-purple-500 to-indigo-500'
    },
    sdgScore: {
      label: 'NITI Aayog SDG Score',
      unit: '/100',
      format: (v) => `${v}/100`,
      color: 'from-rose-500 to-pink-500'
    },
    renewableEnergyMw: {
      label: 'Renewable Capacity',
      unit: 'MW',
      format: (v) => `${v.toLocaleString('en-IN')} MW`,
      color: 'from-yellow-500 to-lime-500'
    }
  };

  const regions = ['All', 'North', 'South', 'East', 'West', 'Central', 'North-East', 'UT'];

  // Min and max for heatmapping
  const { minVal, maxVal } = useMemo(() => {
    const vals = STATES_DATA.map(s => s[activeMetric]);
    return {
      minVal: Math.min(...vals),
      maxVal: Math.max(...vals)
    };
  }, [activeMetric]);

  const filteredAndSortedStates = useMemo(() => {
    return STATES_DATA
      .filter((state) => {
        const matchesRegion = activeRegion === 'All' || state.region === activeRegion;
        const matchesSearch = searchQuery === '' ||
          state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          state.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
          state.keySectors.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesRegion && matchesSearch;
      })
      .sort((a, b) => {
        const diff = (a[activeMetric] as number) - (b[activeMetric] as number);
        return sortOrder === 'desc' ? -diff : diff;
      });
  }, [activeRegion, searchQuery, activeMetric, sortOrder]);

  const getHeatmapColor = (val: number) => {
    const ratio = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal || 1)));
    if (ratio > 0.75) return 'bg-orange-500 text-white font-bold border-orange-400';
    if (ratio > 0.5) return 'bg-amber-600/90 text-white font-semibold border-amber-500/50';
    if (ratio > 0.25) return 'bg-slate-700 text-slate-200 border-slate-600';
    return 'bg-slate-800 text-slate-400 border-slate-700/60';
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-400" />
              States &amp; Union Territories Explorer (36 Entities)
            </h3>
            <p className="text-xs text-slate-400">
              Select metric to color-code and rank states. Click any state card to open comprehensive analytical dossier.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-medium mr-1">Active Metric:</span>
            {(Object.keys(metricConfigs) as MetricKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeMetric === key
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {metricConfigs[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Region & Sort Filter */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Region:
            </span>
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setActiveRegion(reg)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeRegion === reg
                    ? 'bg-slate-700 text-orange-400 border border-orange-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {reg} {reg === 'All' ? '(36)' : ''}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort by {metricConfigs[activeMetric].label}:</span>
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-orange-400" />
              {sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Spatial Map & Leaderboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Cartographic Map / Matrix View */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                Geospatial Heatmap ({metricConfigs[activeMetric].label})
              </h4>
              <p className="text-xs text-slate-400">Positioned by geographic relation across India's expanse</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>Low</span>
              <div className="w-16 h-2 rounded bg-gradient-to-r from-slate-800 via-amber-700 to-orange-500"></div>
              <span>High</span>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative w-full aspect-[4/3.4] bg-slate-950/60 rounded-xl border border-slate-800/80 p-3 flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full max-h-[460px] drop-shadow-md select-none"
            >
              {/* Regional connection hints / background contours */}
              <circle cx="50" cy="50" r="44" fill="none" stroke="#1e293b" strokeDasharray="2,2" strokeWidth="0.5" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="#1e293b" strokeWidth="0.5" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="#1e293b" strokeWidth="0.5" />

              {/* State nodes */}
              {STATES_DATA.map((st) => {
                const isHovered = hoveredState?.id === st.id;
                const val = st[activeMetric] as number;
                const ratio = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal || 1)));
                
                // Color ramp from dark blue-slate to golden-orange
                let nodeColor = '#334155';
                if (ratio > 0.7) nodeColor = '#f97316'; // orange-500
                else if (ratio > 0.4) nodeColor = '#d97706'; // amber-600
                else if (ratio > 0.2) nodeColor = '#0284c7'; // sky-600

                return (
                  <g
                    key={st.id}
                    className="cursor-pointer transition-transform duration-150"
                    onMouseEnter={() => setHoveredState(st)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => onSelectState(st)}
                  >
                    <circle
                      cx={st.coordinates.x}
                      cy={st.coordinates.y}
                      r={isHovered ? 5.2 : 3.6}
                      fill={nodeColor}
                      stroke={isHovered ? '#ffffff' : '#0f172a'}
                      strokeWidth={isHovered ? 1.5 : 0.8}
                      className="transition-all duration-150"
                    />
                    <text
                      x={st.coordinates.x}
                      y={st.coordinates.y + 0.9}
                      fontSize="2.1"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#ffffff"
                      pointerEvents="none"
                    >
                      {st.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hovered State Float Card */}
            {hoveredState && (
              <div className="absolute top-4 right-4 bg-slate-900/95 border border-slate-700/80 backdrop-blur rounded-xl p-3 shadow-2xl text-xs max-w-[210px] pointer-events-none z-20 animate-fade-in">
                <div className="flex items-center justify-between font-bold text-slate-100">
                  <span>{hoveredState.name}</span>
                  <span className="text-[10px] text-orange-400 bg-orange-500/10 px-1 rounded">{hoveredState.id}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Capital: {hoveredState.capital}</div>
                <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{metricConfigs[activeMetric].label}:</span>
                    <span className="font-bold text-orange-300">
                      {metricConfigs[activeMetric].format(hoveredState[activeMetric] as number)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Population:</span>
                    <span className="text-slate-200">{hoveredState.population}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Literacy:</span>
                    <span className="text-slate-200">{hoveredState.literacyRate}%</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-emerald-400 font-medium">Click to inspect state →</div>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>💡 Hover over nodes to see quick telemetry, click to inspect.</span>
            <span>Highest: <strong className="text-orange-400">{filteredAndSortedStates[0]?.name}</strong></span>
          </div>
        </div>

        {/* Top 5 Leaderboard & Quick Stats */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Rankings Leaderboard
              </h4>
              <span className="text-xs text-slate-400 font-mono">By {metricConfigs[activeMetric].label}</span>
            </div>

            <div className="space-y-2.5">
              {filteredAndSortedStates.slice(0, 7).map((st, idx) => {
                const val = st[activeMetric] as number;
                const pct = Math.max(8, ((val - minVal) / (maxVal - minVal || 1)) * 100);

                return (
                  <div
                    key={st.id}
                    onClick={() => onSelectState(st)}
                    className="group bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl p-2.5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          idx === 0 ? 'bg-amber-500 text-slate-950' :
                          idx === 1 ? 'bg-slate-300 text-slate-950' :
                          idx === 2 ? 'bg-amber-700 text-white' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-200 group-hover:text-orange-400 transition-colors">
                          {st.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{st.region}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-100">
                        {metricConfigs[activeMetric].format(val)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Showing top 7 of {filteredAndSortedStates.length} entities</span>
            <span className="text-orange-400">Scroll down for full directory ↓</span>
          </div>
        </div>
      </div>

      {/* Comprehensive State Cards Directory Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200">
            Directory ({filteredAndSortedStates.length} States &amp; UTs)
          </h4>
          <span className="text-xs text-slate-400">Click any card to view full dossier</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredAndSortedStates.map((st) => {
            const val = st[activeMetric] as number;
            return (
              <div
                key={st.id}
                onClick={() => onSelectState(st)}
                className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-orange-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-100 text-sm group-hover:text-orange-400 transition-colors">
                          {st.name}
                        </h4>
                        <span className="text-[10px] font-mono px-1 rounded bg-slate-800 text-slate-400">
                          {st.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        {st.capital} • {st.region}
                      </p>
                    </div>

                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                      st.type === 'State' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                    }`}>
                      {st.type}
                    </span>
                  </div>

                  {/* Primary Highlight Metric */}
                  <div className="mt-3 bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                      {metricConfigs[activeMetric].label}
                    </span>
                    <div className="text-base font-extrabold text-orange-400 font-mono mt-0.5">
                      {metricConfigs[activeMetric].format(val)}
                    </div>
                  </div>

                  {/* Quick stats row */}
                  <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs text-slate-300">
                    <div className="bg-slate-800/40 rounded-lg p-1.5">
                      <span className="text-[10px] text-slate-400 block">Per Capita</span>
                      <span className="font-semibold text-slate-200">₹{(st.perCapitaInr / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="bg-slate-800/40 rounded-lg p-1.5">
                      <span className="text-[10px] text-slate-400 block">Literacy</span>
                      <span className="font-semibold text-slate-200">{st.literacyRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200">
                  <span className="truncate max-w-[170px] text-[11px] text-slate-400">
                    {st.keySectors.slice(0, 2).join(', ')}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
