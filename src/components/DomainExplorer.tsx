import React, { useState } from 'react';
import {
  GDP_HISTORICAL_DATA,
  UPI_GROWTH_DATA,
  RENEWABLE_CAPACITY_DATA,
  SECTORAL_SHARE,
  INDIA_FACTS
} from '../data/indiaStatsData';
import { TrendingUp, Sparkles, Zap, Users, PieChart, Shield, ArrowUpRight, BarChart2, Lightbulb } from 'lucide-react';

export const DomainExplorer: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState<'economy' | 'digital' | 'energy' | 'social'>('economy');
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: number } | null>(null);

  return (
    <div className="space-y-6">
      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveDomain('economy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeDomain === 'economy'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Economy &amp; GDP ($3.95T)
        </button>
        <button
          onClick={() => setActiveDomain('digital')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeDomain === 'digital'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Digital India &amp; UPI
        </button>
        <button
          onClick={() => setActiveDomain('energy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeDomain === 'energy'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          Renewable Energy (200+ GW)
        </button>
        <button
          onClick={() => setActiveDomain('social')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeDomain === 'social'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Demographics &amp; SDG Index
        </button>
      </div>

      {/* DOMAIN 1: Economy */}
      {activeDomain === 'economy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart: GDP Growth Path */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-orange-400" />
                    India's GDP Trajectory ($ Trillion Nominal)
                  </h3>
                  <p className="text-xs text-slate-400">
                    From $2.04T in 2014 to $3.95T in 2024, projected to surpass $7T by 2030 (IMF / MoSPI)
                  </p>
                </div>
                {hoveredPoint && (
                  <div className="bg-slate-800 px-3 py-1 rounded-lg text-xs font-mono font-bold text-orange-400">
                    {hoveredPoint.label}: ${hoveredPoint.value} Trillion
                  </div>
                )}
              </div>

              {/* Interactive SVG Line & Bar Chart */}
              <div className="h-64 w-full pt-4">
                <svg viewBox="0 0 1000 240" className="w-full h-full overflow-visible select-none">
                  {/* Grid lines */}
                  {[0, 2, 4, 6, 8].map((yVal) => {
                    const yPos = 210 - (yVal / 8) * 190;
                    return (
                      <g key={yVal}>
                        <line x1="60" y1={yPos} x2="980" y2={yPos} stroke="#1e293b" strokeWidth="1" />
                        <text x="35" y={yPos + 4} fill="#64748b" fontSize="11" textAnchor="middle" fontFamily="monospace">
                          ${yVal}T
                        </text>
                      </g>
                    );
                  })}

                  {/* Bars & Points */}
                  {GDP_HISTORICAL_DATA.map((pt, i) => {
                    const x = 90 + i * 85;
                    const height = (pt.value / 8) * 190;
                    const y = 210 - height;
                    const isProjected = pt.label.includes('(P)');

                    return (
                      <g
                        key={pt.label}
                        className="cursor-pointer group"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      >
                        <rect
                          x={x - 20}
                          y={y}
                          width="40"
                          height={height}
                          rx="6"
                          fill={isProjected ? 'url(#projectedGrad)' : 'url(#gdpGrad)'}
                          className="transition-all duration-200 group-hover:opacity-80"
                        />
                        <text
                          x={x}
                          y={y - 8}
                          fill="#f8fafc"
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          ${pt.value}
                        </text>
                        <text
                          x={x}
                          y="230"
                          fill="#94a3b8"
                          fontSize="10"
                          textAnchor="middle"
                          transform={`rotate(0, ${x}, 230)`}
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#c2410c" />
                    </linearGradient>
                    <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-orange-500"></span> Historical Actual
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-sky-500"></span> Projections (IMF/MoSPI)
                  </span>
                </div>
                <span>Annualized Real Growth: ~7.2%</span>
              </div>
            </div>

            {/* Sectoral Composition Donut Breakdown */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-100 flex items-center gap-2 mb-1">
                  <PieChart className="w-5 h-5 text-emerald-400" />
                  Sectoral GDP Composition
                </h3>
                <p className="text-xs text-slate-400 mb-4">Gross Value Added (GVA) share by economic engine</p>

                <div className="space-y-4">
                  {SECTORAL_SHARE.map((sec) => (
                    <div key={sec.name} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-semibold text-slate-200">{sec.name}</span>
                        <span className="font-mono font-bold text-sm" style={{ color: sec.color }}>
                          {sec.share}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${sec.share}%`, backgroundColor: sec.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 mt-4 text-xs text-slate-400">
                <div className="font-semibold text-slate-200 mb-1">Strategic Economic Pillars:</div>
                <p>Services exports (Software, GCCs, Fintech) generated $340B+ in FY24, offsetting goods trade deficit.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOMAIN 2: Digital India & UPI */}
      {activeDomain === 'digital' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    UPI Annual Transaction Explosion (Billions of Txns)
                  </h3>
                  <p className="text-xs text-slate-400">From 3.7 Billion transactions in 2018 to 165+ Billion in 2024</p>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64 w-full pt-4">
                <svg viewBox="0 0 1000 240" className="w-full h-full overflow-visible select-none">
                  {[0, 40, 80, 120, 160].map((yVal) => {
                    const yPos = 210 - (yVal / 180) * 190;
                    return (
                      <g key={yVal}>
                        <line x1="60" y1={yPos} x2="980" y2={yPos} stroke="#1e293b" strokeWidth="1" />
                        <text x="35" y={yPos + 4} fill="#64748b" fontSize="11" textAnchor="middle" fontFamily="monospace">
                          {yVal}B
                        </text>
                      </g>
                    );
                  })}

                  {UPI_GROWTH_DATA.map((pt, i) => {
                    const x = 110 + i * 125;
                    const height = (pt.value / 180) * 190;
                    const y = 210 - height;

                    return (
                      <g key={pt.label} className="cursor-pointer group">
                        <rect
                          x={x - 22}
                          y={y}
                          width="44"
                          height={height}
                          rx="6"
                          fill="url(#upiGrad)"
                          className="transition-all duration-200 group-hover:opacity-80"
                        />
                        <text x={x} y={y - 8} fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          {pt.value}B
                        </text>
                        <text x={x} y="230" fill="#94a3b8" fontSize="11" textAnchor="middle">
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id="upiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#6b21a8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                <span>Value Processed Monthly: ₹20.6 Lakh Crore (~$247 Billion)</span>
                <span className="text-purple-400 font-semibold">Global Market Share: 46% of all instant payments</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-sky-400" />
                India Stack Public Infrastructure
              </h3>
              
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Aadhaar Digital Identity</div>
                <div className="text-xl font-black text-slate-100 font-mono mt-0.5">1.38 Billion</div>
                <div className="text-[11px] text-emerald-400 mt-1">99.9% of adult population covered</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">DigiLocker Issued Documents</div>
                <div className="text-xl font-black text-slate-100 font-mono mt-0.5">6.75 Billion</div>
                <div className="text-[11px] text-sky-400 mt-1">Paperless citizen verification</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Data Consumption Per User</div>
                <div className="text-xl font-black text-slate-100 font-mono mt-0.5">24.1 GB / month</div>
                <div className="text-[11px] text-purple-400 mt-1">Cheapest average tariff: $0.16 per GB</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOMAIN 3: Energy & Climate */}
      {activeDomain === 'energy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    Renewable Power Installed Capacity (GW)
                  </h3>
                  <p className="text-xs text-slate-400">Trajectory toward 500 GW non-fossil capacity by 2030 (COP26 Panchamrit)</p>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64 w-full pt-4">
                <svg viewBox="0 0 1000 240" className="w-full h-full overflow-visible select-none">
                  {[0, 100, 200, 300, 400, 500].map((yVal) => {
                    const yPos = 210 - (yVal / 500) * 190;
                    return (
                      <g key={yVal}>
                        <line x1="60" y1={yPos} x2="980" y2={yPos} stroke="#1e293b" strokeWidth="1" />
                        <text x="35" y={yPos + 4} fill="#64748b" fontSize="11" textAnchor="middle" fontFamily="monospace">
                          {yVal} GW
                        </text>
                      </g>
                    );
                  })}

                  {RENEWABLE_CAPACITY_DATA.map((pt, i) => {
                    const x = 90 + i * 115;
                    const height = (pt.value / 500) * 190;
                    const y = 210 - height;
                    const isTarget = pt.label.includes('Target');

                    return (
                      <g key={pt.label} className="cursor-pointer group">
                        <rect
                          x={x - 22}
                          y={y}
                          width="44"
                          height={height}
                          rx="6"
                          fill={isTarget ? '#10b981' : 'url(#energyGrad)'}
                          className="transition-all duration-200 group-hover:opacity-80"
                        />
                        <text x={x} y={y - 8} fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          {pt.value}
                        </text>
                        <text x={x} y="230" fill="#94a3b8" fontSize="10" textAnchor="middle">
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                <span>Current Non-Fossil Share: 45.3% of 444 GW total grid capacity</span>
                <span className="text-amber-400 font-semibold">4th Globally in Wind &amp; Solar Capacity</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Key Green Milestones
              </h3>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-amber-400 font-bold block mb-1">Solar Parks Leadership</span>
                <p className="text-slate-300">
                  Rajasthan (25.4 GW) &amp; Gujarat (22.1 GW) house mega installations like Bhadla (2.2 GW) and Khavda (30 GW target).
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-emerald-400 font-bold block mb-1">National Green Hydrogen Mission</span>
                <p className="text-slate-300">
                  Targeting 5 MMT annual green hydrogen production by 2030 with ₹19,744 Crore outlay.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-sky-400 font-bold block mb-1">Railway 100% Electrification</span>
                <p className="text-slate-300">
                  Over 95% of broad gauge Indian Railways route network is electrified—world leader among major networks.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOMAIN 4: Demographics & Social */}
      {activeDomain === 'social' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Population (2024)</span>
              <div className="text-2xl font-black text-slate-100 font-mono mt-1">1.442 Billion</div>
              <p className="text-xs text-slate-400 mt-2">
                Surpassed China in mid-2023. TFR (Total Fertility Rate) has dropped to 2.0 (below replacement level 2.1).
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-semibold uppercase">Working-Age Dividend</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">68.2%</div>
              <p className="text-xs text-slate-400 mt-2">
                Ages 15-64. Window of demographic dividend will remain wide open through 2055-2060.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 font-semibold uppercase">Multidimensional Poverty Decline</span>
              <div className="text-2xl font-black text-orange-400 font-mono mt-1">248 Million</div>
              <p className="text-xs text-slate-400 mt-2">
                Citizens lifted out of multidimensional poverty between 2013-14 and 2022-23 according to NITI Aayog report.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-base text-slate-100 mb-2">NITI Aayog SDG India Index Highlights</h3>
            <p className="text-xs text-slate-400 mb-4">
              Monitors progress across all 17 UN Sustainable Development Goals at State and Union Territory resolution.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-emerald-400 text-xs font-bold block">Front Runners (70+)</span>
                <p className="text-xs text-slate-300 mt-1">Kerala (79), Uttarakhand (79), Tamil Nadu (78), Goa (77), Himachal (77)</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-sky-400 text-xs font-bold block">Highest Sex Ratio</span>
                <p className="text-xs text-slate-300 mt-1">Kerala (1,084 F / 1,000 M), Puducherry (1,037), Tamil Nadu (996)</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-purple-400 text-xs font-bold block">Highest Literacy</span>
                <p className="text-xs text-slate-300 mt-1">Kerala (94.0%), Lakshadweep (91.8%), Mizoram (91.3%), Goa (88.7%)</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-amber-400 text-xs font-bold block">Fastest Movers</span>
                <p className="text-xs text-slate-300 mt-1">Uttar Pradesh, Bihar, and Odisha made the largest decadal index point leaps.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Facts Showcase at bottom of Domain Explorer */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base text-slate-100">Did You Know? India Factbook</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INDIA_FACTS.map((fact) => (
            <div key={fact.title} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-semibold text-xs text-slate-200">{fact.title}</span>
                <span className="text-sm font-black text-orange-400 font-mono">{fact.stat}</span>
              </div>
              <p className="text-xs text-slate-400">{fact.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
