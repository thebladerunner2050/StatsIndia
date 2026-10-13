import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Target, Calendar, DollarSign, Users, Award, Sparkles, RefreshCw } from 'lucide-react';

export const GrowthSimulator: React.FC = () => {
  const [realGrowth, setRealGrowth] = useState<number>(7.0); // % real GDP growth
  const [inflation, setInflation] = useState<number>(4.5); // % GDP deflator
  const [usdInrRate, setUsdInrRate] = useState<number>(84.0); // USD/INR
  const [depreciationPct, setDepreciationPct] = useState<number>(1.5); // Annual INR depreciation vs USD %

  // Starting baselines (2024)
  const baseYear = 2024;
  const baseGdpUsd = 3.95; // $ Trillion
  const basePop = 1442; // Millions

  const simulation = useMemo(() => {
    // Nominal growth in USD terms = (1 + realGrowth/100) * (1 + inflation/100) / (1 + depreciationPct/100) - 1
    const nominalUsdGrowthRate = ((1 + realGrowth / 100) * (1 + inflation / 100)) / (1 + depreciationPct / 100) - 1;

    let currentGdp = baseGdpUsd;
    let currentPop = basePop;
    let year5T: number | null = null;
    let year7T: number | null = null;
    let year10T: number | null = null;

    const projections: Array<{
      year: number;
      gdpUsd: number;
      gdpInrLakhCr: number;
      popMillion: number;
      perCapitaUsd: number;
      perCapitaInr: number;
    }> = [];

    projections.push({
      year: baseYear,
      gdpUsd: baseGdpUsd,
      gdpInrLakhCr: (baseGdpUsd * 1000000 * usdInrRate) / 10000000,
      popMillion: basePop,
      perCapitaUsd: Math.round((baseGdpUsd * 1e12) / (basePop * 1e6)),
      perCapitaInr: Math.round(((baseGdpUsd * 1e12) / (basePop * 1e6)) * usdInrRate)
    });

    for (let yr = baseYear + 1; yr <= 2045; yr++) {
      currentGdp = currentGdp * (1 + nominalUsdGrowthRate);
      currentPop = currentPop * (1 + 0.007); // ~0.7% pop growth slowing down

      if (!year5T && currentGdp >= 5.0) year5T = yr;
      if (!year7T && currentGdp >= 7.0) year7T = yr;
      if (!year10T && currentGdp >= 10.0) year10T = yr;

      const effectiveInrRate = usdInrRate * Math.pow(1 + depreciationPct / 100, yr - baseYear);
      const perCapitaUsd = Math.round((currentGdp * 1e12) / (currentPop * 1e6));
      const perCapitaInr = Math.round(perCapitaUsd * effectiveInrRate);

      if (yr <= baseYear + 12 || yr % 2 === 0) {
        projections.push({
          year: yr,
          gdpUsd: Number(currentGdp.toFixed(2)),
          gdpInrLakhCr: Math.round((currentGdp * 1000000 * effectiveInrRate) / 10000000),
          popMillion: Math.round(currentPop),
          perCapitaUsd,
          perCapitaInr
        });
      }
    }

    return {
      nominalUsdGrowthRate: nominalUsdGrowthRate * 100,
      year5T: year5T || 2027,
      year7T: year7T || 2030,
      year10T: year10T || 2034,
      projections
    };
  }, [realGrowth, inflation, usdInrRate, depreciationPct]);

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-orange-400" />
              Path to $5T, $7T &amp; $10T Economy Simulator
            </h2>
            <p className="text-xs text-slate-400">
              Model compound macroeconomic expansion by tweaking real GDP growth, inflation, and foreign exchange dynamics.
            </p>
          </div>

          <button
            onClick={() => {
              setRealGrowth(7.0);
              setInflation(4.5);
              setUsdInrRate(84.0);
              setDepreciationPct(1.5);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Baseline
          </button>
        </div>

        {/* Milestone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
          <div className="bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/30 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" /> $5.0 Trillion Milestone
              </span>
              <span className="bg-amber-500/20 px-2 py-0.5 rounded text-[10px]">#3 Global Rank</span>
            </div>
            <div className="text-3xl font-black text-slate-100 font-mono mt-1">
              {simulation.year5T}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              In ~{simulation.year5T - baseYear} years. India would overtake Germany &amp; Japan to become the world’s 3rd largest economy.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 via-slate-950 to-slate-950 border border-orange-500/30 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-orange-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" /> $7.0 Trillion Milestone
              </span>
              <span className="bg-orange-500/20 px-2 py-0.5 rounded text-[10px]">Upper-Middle Income</span>
            </div>
            <div className="text-3xl font-black text-slate-100 font-mono mt-1">
              {simulation.year7T}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              In ~{simulation.year7T - baseYear} years. Projected per capita GDP approaches ~$4,500+ (₹3.8 Lakhs).
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 via-slate-950 to-slate-950 border border-emerald-500/30 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" /> $10.0 Trillion Milestone
              </span>
              <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">Viksit Bharat Goal</span>
            </div>
            <div className="text-3xl font-black text-slate-100 font-mono mt-1">
              {simulation.year10T}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              In ~{simulation.year10T - baseYear} years. Indian economy reaches 2.5x current size with ~$6,300+ per capita.
            </p>
          </div>
        </div>
      </div>

      {/* Sliders Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Real GDP Growth */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-semibold text-slate-300">Annual Real GDP Growth</span>
            <span className="font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
              {realGrowth.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="4.5"
            max="10.0"
            step="0.1"
            value={realGrowth}
            onChange={(e) => setRealGrowth(parseFloat(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>4.5% (Conservative)</span>
            <span>7.2% (Current)</span>
            <span>10% (High)</span>
          </div>
        </div>

        {/* Inflation / Deflator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-semibold text-slate-300">GDP Deflator (Inflation)</span>
            <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              {inflation.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="2.5"
            max="7.0"
            step="0.1"
            value={inflation}
            onChange={(e) => setInflation(parseFloat(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>2.5%</span>
            <span>4.5% (RBI Target)</span>
            <span>7.0%</span>
          </div>
        </div>

        {/* Currency Depreciation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-semibold text-slate-300">Annual INR/USD Drift</span>
            <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
              {depreciationPct.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="4.0"
            step="0.1"
            value={depreciationPct}
            onChange={(e) => setDepreciationPct(parseFloat(e.target.value))}
            className="w-full accent-sky-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>0% (Constant)</span>
            <span>1.5% (Historical)</span>
            <span>4.0%</span>
          </div>
        </div>

        {/* Effective USD Growth Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400">Effective Nominal USD Growth:</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              +{simulation.nominalUsdGrowthRate.toFixed(1)}% / yr
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Combined compounding rate in global currency terms.
          </p>
        </div>
      </div>

      {/* Trajectory Table & Visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-200">Simulated Expansion Roadmap (2024 - 2036)</h3>
          <span className="text-xs text-slate-400">Nominal USD &amp; INR conversions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">GDP (Nominal USD)</th>
                <th className="py-3 px-4">GDP (₹ Lakh Crore)</th>
                <th className="py-3 px-4">Population</th>
                <th className="py-3 px-4">Per Capita (USD)</th>
                <th className="py-3 px-4">Per Capita (₹ INR)</th>
                <th className="py-3 px-4">Visual Scale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {simulation.projections.slice(0, 10).map((row) => {
                const barWidth = Math.min(100, (row.gdpUsd / 12) * 100);
                const isMilestone = row.year === simulation.year5T || row.year === simulation.year7T || row.year === simulation.year10T;

                return (
                  <tr
                    key={row.year}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isMilestone ? 'bg-orange-500/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold font-mono text-slate-100 flex items-center gap-1.5">
                      {row.year}
                      {row.year === baseYear && (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1 rounded">Base</span>
                      )}
                      {row.year === simulation.year5T && (
                        <span className="text-[10px] text-amber-400 bg-amber-500/20 px-1 rounded font-sans font-bold">$5T 🎯</span>
                      )}
                      {row.year === simulation.year7T && (
                        <span className="text-[10px] text-orange-400 bg-orange-500/20 px-1 rounded font-sans font-bold">$7T 🎯</span>
                      )}
                      {row.year === simulation.year10T && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1 rounded font-sans font-bold">$10T 🎯</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-orange-300">
                      ${row.gdpUsd} Trillion
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-200">
                      ₹{row.gdpInrLakhCr.toLocaleString('en-IN')} L Cr
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {(row.popMillion / 1000).toFixed(3)} B
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-200">
                      ${row.perCapitaUsd.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                      ₹{row.perCapitaInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 w-44">
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-emerald-400 rounded-full"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
