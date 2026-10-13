import React, { useState, useMemo } from 'react';
import { StateData, STATES_DATA } from '../data/indiaStatsData';
import { Download, Search, ArrowUpDown, Filter, FileSpreadsheet, Eye } from 'lucide-react';

interface DataTableTabProps {
  onSelectState: (state: StateData) => void;
  searchQuery: string;
}

export const DataTableTab: React.FC<DataTableTabProps> = ({ onSelectState, searchQuery }) => {
  const [internalSearch, setInternalSearch] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof StateData>('gsdpUsdBn');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');

  const effectiveSearch = searchQuery || internalSearch;

  const handleSort = (field: keyof StateData) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = useMemo(() => {
    return STATES_DATA
      .filter((s) => {
        const matchesRegion = regionFilter === 'All' || s.region === regionFilter;
        const matchesType = typeFilter === 'All' || s.type === typeFilter;
        const matchesSearch = effectiveSearch === '' ||
          s.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
          s.capital.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
          s.id.toLowerCase().includes(effectiveSearch.toLowerCase());
        return matchesRegion && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        }
        const diff = (aVal as number) - (bVal as number);
        return sortDirection === 'desc' ? -diff : diff;
      });
  }, [regionFilter, typeFilter, effectiveSearch, sortField, sortDirection]);

  const exportCsv = () => {
    const headers = [
      'Code',
      'Name',
      'Type',
      'Capital',
      'Region',
      'Population (M)',
      'GSDP (USD Bn)',
      'GSDP (Lakh Cr INR)',
      'Per Capita GSDP (INR)',
      'Literacy Rate (%)',
      'Female Literacy (%)',
      'Sex Ratio',
      'Urbanization (%)',
      'NITI Aayog SDG Score',
      'MPI Poverty (%)',
      'Renewable Power (MW)'
    ];

    const rows = filteredData.map(s => [
      s.id,
      `"${s.name}"`,
      s.type,
      `"${s.capital}"`,
      s.region,
      s.population,
      s.gsdpUsdBn,
      s.gsdpLakhCr,
      s.perCapitaInr,
      s.literacyRate,
      s.femaleLiteracy,
      s.sexRatio,
      s.urbanizationRate,
      s.sdgScore,
      s.povertyRate,
      s.renewableEnergyMw
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StatsIndia_Dataset_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            Complete Indian States &amp; UTs Statistical Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Exportable tabular records with column sorting and multi-region filtering.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV ({filteredData.length} records)
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium">Filter:</span>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
          >
            <option value="All">All Regions (36)</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="Central">Central</option>
            <option value="North-East">North-East</option>
            <option value="UT">UTs</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
          >
            <option value="All">All Jurisdictions</option>
            <option value="State">States Only (28)</option>
            <option value="UT">Union Territories Only (8)</option>
          </select>
        </div>

        <span className="text-slate-400 font-mono text-xs">
          Showing {filteredData.length} of {STATES_DATA.length} entities
        </span>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1">Code <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">State / UT <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3">Capital</th>
                <th className="py-3 px-3">Region</th>
                <th className="py-3 px-3 cursor-pointer hover:text-slate-200 text-right" onClick={() => handleSort('gsdpUsdBn')}>
                  <div className="flex items-center justify-end gap-1">GSDP ($ Bn) <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-slate-200 text-right" onClick={() => handleSort('perCapitaInr')}>
                  <div className="flex items-center justify-end gap-1">Per Capita (₹) <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-slate-200 text-right" onClick={() => handleSort('literacyRate')}>
                  <div className="flex items-center justify-end gap-1">Literacy <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-slate-200 text-right" onClick={() => handleSort('population')}>
                  <div className="flex items-center justify-end gap-1">Pop (M) <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-slate-200 text-right" onClick={() => handleSort('sdgScore')}>
                  <div className="flex items-center justify-end gap-1">SDG Score <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-slate-200 text-right" onClick={() => handleSort('renewableEnergyMw')}>
                  <div className="flex items-center justify-end gap-1">Renewables (MW) <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredData.map((st) => (
                <tr
                  key={st.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectState(st)}
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-400 group-hover:text-orange-400">{st.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-100 flex items-center gap-1.5">
                    {st.name}
                    <span className="text-[10px] text-slate-400 font-normal">({st.type})</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{st.capital}</td>
                  <td className="py-3 px-3 text-slate-400">{st.region}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-orange-300">${st.gsdpUsdBn}</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400">₹{st.perCapitaInr.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right font-mono text-sky-300">{st.literacyRate}%</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-200">{st.population.toFixed(1)}</td>
                  <td className="py-3 px-3 text-right font-mono text-amber-300 font-semibold">{st.sdgScore}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">{st.renewableEnergyMw.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectState(st);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 transition-colors"
                      title="Inspect Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
