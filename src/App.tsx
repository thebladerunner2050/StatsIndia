import React, { useState } from 'react';
import { Header } from './components/Header';
import { MacroMetricsGrid } from './components/MacroMetricsGrid';
import { StateMapAndGrid } from './components/StateMapAndGrid';
import { StateComparator } from './components/StateComparator';
import { DomainExplorer } from './components/DomainExplorer';
import { GrowthSimulator } from './components/GrowthSimulator';
import { DataTableTab } from './components/DataTableTab';
import { StateDetailModal } from './components/StateDetailModal';
import { StateData, MacroIndicator, STATES_DATA, INDIA_FACTS } from './data/indiaStatsData';
import {
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  MapPin,
  Sparkles,
  ArrowRight,
  Database,
  BarChart3,
  ExternalLink,
  Layers,
  Activity
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'states' | 'compare' | 'domains' | 'simulator' | 'table'>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalState, setModalState] = useState<StateData | null>(null);

  // Top 3 economic states for quick hero cards
  const topGsdpStates = [...STATES_DATA].sort((a, b) => b.gsdpUsdBn - a.gsdpUsdBn).slice(0, 3);
  const topLiteracyStates = [...STATES_DATA].sort((a, b) => b.literacyRate - a.literacyRate).slice(0, 3);
  const topCleanEnergyStates = [...STATES_DATA].sort((a, b) => b.renewableEnergyMw - a.renewableEnergyMw).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold">
                  <Activity className="w-3.5 h-3.5" />
                  India Economic Survey &amp; Statistical Observatory
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight leading-tight">
                  Discover the Data Powering{' '}
                  <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
                    1.44 Billion Lives
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Interactive real-time data repository of India’s economic engines, demographic shifts, 
                  state-by-state governance metrics, renewable energy transition, and digital public infrastructure.
                </p>

                {/* Quick Action Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('states')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 transition-all"
                  >
                    <MapPin className="w-4 h-4" />
                    Explore 36 States &amp; UTs
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-all"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Run $5T Economy Simulator
                  </button>

                  <button
                    onClick={() => setActiveTab('compare')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-all"
                  >
                    <Layers className="w-4 h-4 text-purple-400" />
                    Compare States Side-by-Side
                  </button>
                </div>
              </div>
            </div>

            {/* Macro Metrics Section */}
            <MacroMetricsGrid onSelectIndicator={() => setActiveTab('domains')} />

            {/* Tri-Pillar State Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pillar 1: Top Economies */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5 uppercase">
                    <TrendingUp className="w-4 h-4" /> Top State Economies
                  </span>
                  <span className="text-[10px] text-slate-500">Nominal GSDP</span>
                </div>
                <div className="space-y-2">
                  {topGsdpStates.map((st, i) => (
                    <div
                      key={st.id}
                      onClick={() => setModalState(st)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">{st.name}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-orange-400">${st.gsdpUsdBn} Bn</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 2: Literacy & Human Capital */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase">
                    <BookOpen className="w-4 h-4" /> Education &amp; Literacy
                  </span>
                  <span className="text-[10px] text-slate-500">Total Rate %</span>
                </div>
                <div className="space-y-2">
                  {topLiteracyStates.map((st, i) => (
                    <div
                      key={st.id}
                      onClick={() => setModalState(st)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">{st.name}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-sky-400">{st.literacyRate}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 3: Clean Power */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                    <Zap className="w-4 h-4" /> Green Energy Capacity
                  </span>
                  <span className="text-[10px] text-slate-500">Renewable MW</span>
                </div>
                <div className="space-y-2">
                  {topCleanEnergyStates.map((st, i) => (
                    <div
                      key={st.id}
                      onClick={() => setModalState(st)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">{st.name}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {st.renewableEnergyMw.toLocaleString('en-IN')} MW
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive State Map and Directory Preview */}
            <StateMapAndGrid
              onSelectState={(st) => setModalState(st)}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* TAB 2: STATES & UTS */}
        {activeTab === 'states' && (
          <StateMapAndGrid
            onSelectState={(st) => setModalState(st)}
            searchQuery={searchQuery}
          />
        )}

        {/* TAB 3: STATE COMPARATOR */}
        {activeTab === 'compare' && (
          <StateComparator />
        )}

        {/* TAB 4: DOMAINS */}
        {activeTab === 'domains' && (
          <DomainExplorer />
        )}

        {/* TAB 5: SIMULATOR */}
        {activeTab === 'simulator' && (
          <GrowthSimulator />
        )}

        {/* TAB 6: DATA TABLE */}
        {activeTab === 'table' && (
          <DataTableTab
            onSelectState={(st) => setModalState(st)}
            searchQuery={searchQuery}
          />
        )}
      </main>

      {/* State Detail Modal */}
      {modalState && (
        <StateDetailModal
          state={modalState}
          onClose={() => setModalState(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-16 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">StatsIndia Data Platform</span>
            <span>•</span>
            <span>Empowering open data visualization for Indian citizens &amp; researchers</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Primary Sources: MoSPI, RBI, Census, NITI Aayog, NPCI, MNRE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
