import React from 'react';
import { StateData } from '../data/indiaStatsData';
import { X, Building, Users, TrendingUp, BookOpen, Zap, Award, MapPin, HeartHandshake, Compass } from 'lucide-react';

interface StateDetailModalProps {
  state: StateData | null;
  onClose: () => void;
}

export const StateDetailModal: React.FC<StateDetailModalProps> = ({ state, onClose }) => {
  if (!state) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-orange-600/30 via-slate-800 to-emerald-600/30 border-b border-slate-800 p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {state.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {state.type}
              </span>
              <span className="text-xs text-slate-400">
                {state.region} Region
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight mt-1">
              {state.name}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <Building className="w-3.5 h-3.5 text-orange-400" />
              Capital: <strong className="text-slate-100">{state.capital}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary Box */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Strategic Profile &amp; Role
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {state.summary}
            </p>
          </div>

          {/* Key Indicators Grid */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
              Core Socio-Economic Indicators
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">GSDP (Economy)</span>
                <span className="text-lg font-bold font-mono text-orange-300 mt-0.5 block">
                  ${state.gsdpUsdBn} Bn
                </span>
                <span className="text-[10px] text-slate-400">₹{state.gsdpLakhCr} Lakh Cr</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Per Capita GSDP</span>
                <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
                  ₹{state.perCapitaInr.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400">Annual Avg</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Literacy Rate</span>
                <span className="text-lg font-bold font-mono text-sky-400 mt-0.5 block">
                  {state.literacyRate}%
                </span>
                <span className="text-[10px] text-slate-400">Female: {state.femaleLiteracy}%</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Population</span>
                <span className="text-lg font-bold font-mono text-purple-400 mt-0.5 block">
                  {state.population.toFixed(1)} M
                </span>
                <span className="text-[10px] text-slate-400">Rank #{state.populationRank}</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">SDG Index Score</span>
                <span className="text-lg font-bold font-mono text-amber-400 mt-0.5 block">
                  {state.sdgScore} / 100
                </span>
                <span className="text-[10px] text-slate-400">NITI Aayog</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Sex Ratio</span>
                <span className="text-lg font-bold font-mono text-rose-400 mt-0.5 block">
                  {state.sexRatio}
                </span>
                <span className="text-[10px] text-slate-400">Females / 1,000 M</span>
              </div>
            </div>
          </div>

          {/* Additional Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="font-semibold text-slate-300 block mb-1">Geography &amp; Urban Spread</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Geographic Area:</span>
                <span className="font-mono text-slate-200">{state.areaSqKm.toLocaleString()} sq km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Population Density:</span>
                <span className="font-mono text-slate-200">{state.density} persons / km²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Urbanization Level:</span>
                <span className="font-mono text-slate-200">{state.urbanizationRate}%</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="font-semibold text-slate-300 block mb-1">Sustainability &amp; Equity</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Clean Power Capacity:</span>
                <span className="font-mono text-emerald-400 font-bold">{state.renewableEnergyMw.toLocaleString()} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MPI Poverty Headcount:</span>
                <span className="font-mono text-slate-200">{state.povertyRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Female Literacy Gap:</span>
                <span className="font-mono text-slate-200">{(state.literacyRate - state.femaleLiteracy).toFixed(1)}% pts</span>
              </div>
            </div>
          </div>

          {/* Key Sectors & Industry Highlights */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Key Industrial &amp; Economic Strengths
            </h4>
            <div className="flex flex-wrap gap-2">
              {state.keySectors.map((sec) => (
                <span
                  key={sec}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 text-orange-300 border border-slate-700"
                >
                  {sec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950/90 border-t border-slate-800 p-4 flex items-center justify-between text-xs text-slate-400">
          <span>Official Data Source: MoSPI, RBI State Finances &amp; NITI Aayog</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
