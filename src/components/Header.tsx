import React from 'react';
import { BarChart3, TrendingUp, Search, Database, Globe, Compass, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'states' | 'compare' | 'domains' | 'simulator' | 'table';
  setActiveTab: (tab: 'overview' | 'states' | 'compare' | 'domains' | 'simulator' | 'table') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      {/* Live Ticker Bar */}
      <div className="bg-gradient-to-r from-orange-600/20 via-slate-900 to-emerald-600/20 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 whitespace-nowrap min-w-max mx-auto max-w-7xl">
          <span className="flex items-center gap-1.5 font-semibold text-orange-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            LIVE INDICATORS
          </span>
          <span className="text-slate-400">
            Nominal GDP: <strong className="text-slate-100">$3.95 Trillion</strong> <span className="text-emerald-400">(+7.2% YoY)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Forex Reserves: <strong className="text-slate-100">$692.3 Billion</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Monthly UPI Volume: <strong className="text-slate-100">15.04 Billion</strong> <span className="text-emerald-400">(₹20.6 Lakh Cr)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Clean Energy: <strong className="text-slate-100">201.5 GW</strong> <span className="text-emerald-400">(45.3% Total)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            GST Collections: <strong className="text-slate-100">₹1.87 Lakh Cr/Mo</strong>
          </span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-emerald-500 p-[2px] flex items-center justify-center shadow-lg shadow-orange-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  StatsIndia
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Data Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">National &amp; State Statistical Intelligence</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search states, indicators, sectors, or metrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('states')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'states'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              States &amp; UTs
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'compare'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Comparator
            </button>
            <button
              onClick={() => setActiveTab('domains')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'domains'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Domains
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              $5T Simulator
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'table'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Data Table
            </button>
          </nav>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search states, indicators, metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
