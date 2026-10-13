import React, { useState, useMemo } from 'react';
import centralExecutiveData from './data/central_executive.json';
import andhraPradeshData from './data/andhra_pradesh.json';
import arunachalPradeshData from './data/arunachal_pradesh.json';
import assamData from './data/assam.json';

interface MLA {
  constituency_no: number;
  constituency: string;
  district: string;
  mla_name: string;
  party: string;
  net_worth_crores: number;
  criminal_cases: number;
  primary_complaint: string;
  drought_status: string;
}

interface StateData {
  state: string;
  total_seats: number;
  governor: string;
  chief_minister: string;
  mlas: MLA[];
}

const statesCatalog: Record<string, StateData> = {
  andhra_pradesh: andhraPradeshData as StateData,
  arunachal_pradesh: arunachalPradeshData as StateData,
  assam: assamData as StateData,
};

type Tab = 'assembly' | 'central_raw' | 'state_raw' | 'api_docs';

export default function App() {
  const [selectedStateKey, setSelectedStateKey] = useState<string>('arunachal_pradesh');
  const [activeTab, setActiveTab] = useState<Tab>('assembly');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedParty, setSelectedParty] = useState('ALL');
  const [selectedDrought, setSelectedDrought] = useState('ALL');
  const [copied, setCopied] = useState<string | null>(null);

  const currentState = statesCatalog[selectedStateKey] || statesCatalog.andhra_pradesh;

  const districts = useMemo(() => {
    const list = Array.from(new Set(currentState.mlas.map((m) => m.district)));
    return list.sort();
  }, [currentState]);

  const parties = useMemo(() => {
    const list = Array.from(new Set(currentState.mlas.map((m) => m.party)));
    return list.sort();
  }, [currentState]);

  const filteredMlas = useMemo(() => {
    return currentState.mlas.filter((mla) => {
      const matchesSearch =
        mla.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mla.mla_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mla.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mla.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mla.primary_complaint.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDistrict = selectedDistrict === 'ALL' || mla.district === selectedDistrict;
      const matchesParty = selectedParty === 'ALL' || mla.party === selectedParty;
      const matchesDrought = selectedDrought === 'ALL' || mla.drought_status === selectedDrought;

      return matchesSearch && matchesDistrict && matchesParty && matchesDrought;
    });
  }, [currentState, searchTerm, selectedDistrict, selectedParty, selectedDrought]);

  const partyBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    currentState.mlas.forEach((m) => {
      counts[m.party] = (counts[m.party] || 0) + 1;
    });
    return counts;
  }, [currentState]);

  const totalDeclaredNetWorth = useMemo(() => {
    return currentState.mlas.reduce((acc, m) => acc + (m.net_worth_crores || 0), 0);
  }, [currentState]);

  const totalCriminalCases = useMemo(() => {
    return currentState.mlas.reduce((acc, m) => acc + (m.criminal_cases || 0), 0);
  }, [currentState]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadJson = (data: object, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-neutral-200 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-[#0e121b]/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-500/20 text-sm">
              IND
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                India Political Data Engine
                <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  Batch 1 & 2 Loaded
                </span>
              </h1>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Union Executive + Andhra Pradesh (175) + Arunachal Pradesh (60) + Assam (126)
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyToClipboard(JSON.stringify(currentState, null, 2), 'current_state')}
              className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition flex items-center gap-1.5"
            >
              {copied === 'current_state' ? (
                <span className="text-emerald-400 font-bold">✓ Copied {currentState.state}</span>
              ) : (
                <span>Copy {currentState.state} JSON</span>
              )}
            </button>
            <button
              onClick={() => downloadJson(currentState, `${selectedStateKey}_mlas.json`)}
              className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition"
            >
              Export .JSON
            </button>
          </div>
        </div>

        {/* State Selection Bar & Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between border-t border-neutral-800/60 text-xs font-medium py-1.5 gap-2">
          {/* State selector buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono mr-1">States:</span>
            <button
              onClick={() => { setSelectedStateKey('andhra_pradesh'); setSelectedDistrict('ALL'); setSelectedParty('ALL'); }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                selectedStateKey === 'andhra_pradesh'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              Andhra Pradesh (175)
            </button>
            <button
              onClick={() => { setSelectedStateKey('arunachal_pradesh'); setSelectedDistrict('ALL'); setSelectedParty('ALL'); }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                selectedStateKey === 'arunachal_pradesh'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              Arunachal Pradesh (60)
            </button>
            <button
              onClick={() => { setSelectedStateKey('assam'); setSelectedDistrict('ALL'); setSelectedParty('ALL'); }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                selectedStateKey === 'assam'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              Assam (126)
            </button>
          </div>

          {/* Navigation view modes */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('assembly')}
              className={`py-1.5 px-3 rounded-md transition ${
                activeTab === 'assembly' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Assembly Grid
            </button>
            <button
              onClick={() => setActiveTab('central_raw')}
              className={`py-1.5 px-3 rounded-md transition ${
                activeTab === 'central_raw' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Union Exec
            </button>
            <button
              onClick={() => setActiveTab('state_raw')}
              className={`py-1.5 px-3 rounded-md font-mono transition ${
                activeTab === 'state_raw' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Raw State JSON
            </button>
            <button
              onClick={() => setActiveTab('api_docs')}
              className={`py-1.5 px-3 rounded-md transition ${
                activeTab === 'api_docs' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Protocol & Batch Status
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'assembly' && (
          <div className="space-y-6">
            {/* State Executive Summary Card */}
            <div className="bg-[#121622] rounded-xl border border-neutral-800 p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider">
                      Vidhan Sabha • Batch {selectedStateKey === 'andhra_pradesh' ? '1' : '2'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Live Sitting Assembly
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight mt-1">{currentState.state} Legislative Assembly</h2>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono">
                  <div className="bg-[#0b0e15] px-3 py-2 rounded-lg border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">TOTAL SEATS</span>
                    <span className="text-base font-bold text-amber-400">{currentState.total_seats}</span>
                  </div>
                  <div className="bg-[#0b0e15] px-3 py-2 rounded-lg border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">CUMULATIVE NET WORTH</span>
                    <span className="text-base font-bold text-emerald-400">₹{totalDeclaredNetWorth.toFixed(1)} Cr</span>
                  </div>
                  <div className="bg-[#0b0e15] px-3 py-2 rounded-lg border border-neutral-800">
                    <span className="text-neutral-500 block text-[10px]">CRIMINAL CASES RECORDED</span>
                    <span className="text-base font-bold text-rose-400">{totalCriminalCases}</span>
                  </div>
                </div>
              </div>

              {/* Governor & CM Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-xs">
                <div className="bg-[#0e131d] p-3 rounded-lg border border-neutral-800/80">
                  <span className="text-neutral-400 text-[11px] block">Chief Minister</span>
                  <span className="text-sm font-semibold text-white mt-0.5 block">{currentState.chief_minister}</span>
                  <span className="text-[10px] text-amber-400/80 font-mono">Leader of the House</span>
                </div>
                <div className="bg-[#0e131d] p-3 rounded-lg border border-neutral-800/80">
                  <span className="text-neutral-400 text-[11px] block">Governor</span>
                  <span className="text-sm font-semibold text-white mt-0.5 block">{currentState.governor}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Constitutional Head</span>
                </div>
                <div className="bg-[#0e131d] p-3 rounded-lg border border-neutral-800/80 sm:col-span-2">
                  <span className="text-neutral-400 text-[11px] block mb-1">Party Distribution</span>
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                    {Object.entries(partyBreakdown).map(([p, count]) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 bg-neutral-900 border border-neutral-700/80 rounded text-neutral-300"
                      >
                        <strong className="text-amber-400">{p}:</strong> {count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#121622] rounded-xl border border-neutral-800 p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                    Search Constituency / MLA
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, issue, party..."
                    className="w-full bg-[#0b0e15] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-[#0b0e15] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="ALL">All Districts ({districts.length})</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">Party</label>
                  <select
                    value={selectedParty}
                    onChange={(e) => setSelectedParty(e.target.value)}
                    className="w-full bg-[#0b0e15] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="ALL">All Parties ({parties.length})</option>
                    {parties.map((p) => (
                      <option key={p} value={p}>
                        {p} ({partyBreakdown[p] || 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">Drought / Rainfall Status</label>
                  <select
                    value={selectedDrought}
                    onChange={(e) => setSelectedDrought(e.target.value)}
                    className="w-full bg-[#0b0e15] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="ALL">All Climatic Conditions</option>
                    <option value="Normal">Normal</option>
                    <option value="Deficit">Deficit</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                <span>
                  Showing <strong className="text-white">{filteredMlas.length}</strong> of{' '}
                  <strong className="text-white">{currentState.total_seats}</strong> official assembly constituencies
                </span>
                {(searchTerm || selectedDistrict !== 'ALL' || selectedParty !== 'ALL' || selectedDrought !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDistrict('ALL');
                      setSelectedParty('ALL');
                      setSelectedDrought('ALL');
                    }}
                    className="text-amber-400 hover:underline text-xs"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* MLA Constituency Table / Cards */}
            <div className="bg-[#121622] rounded-xl border border-neutral-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0b0e15] border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3 w-14 text-center">No.</th>
                      <th className="py-3 px-4">Constituency</th>
                      <th className="py-3 px-4">District</th>
                      <th className="py-3 px-4">Sitting MLA</th>
                      <th className="py-3 px-3">Party</th>
                      <th className="py-3 px-3 text-right">Net Worth</th>
                      <th className="py-3 px-3 text-center">Cases</th>
                      <th className="py-3 px-4">Key Local Issue / Public Demand</th>
                      <th className="py-3 px-3 text-center">Climate Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-sans">
                    {filteredMlas.map((mla) => (
                      <tr
                        key={mla.constituency_no}
                        className="hover:bg-neutral-800/40 transition group"
                      >
                        <td className="py-3 px-3 text-center font-mono text-neutral-500 font-semibold">
                          {mla.constituency_no}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {mla.constituency}
                        </td>
                        <td className="py-3 px-4 text-neutral-300">
                          {mla.district}
                        </td>
                        <td className="py-3 px-4 font-medium text-amber-200">
                          {mla.mla_name}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700/80 text-amber-400">
                            {mla.party}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-400 font-medium">
                          ₹{mla.net_worth_crores.toFixed(1)} Cr
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          {mla.criminal_cases > 0 ? (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                              {mla.criminal_cases}
                            </span>
                          ) : (
                            <span className="text-neutral-500">0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-neutral-300 max-w-xs">
                          {mla.primary_complaint}
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                              mla.drought_status === 'Normal'
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                                : mla.drought_status === 'Deficit'
                                ? 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                                : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                            }`}
                          >
                            {mla.drought_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Central Executive Tab */}
        {activeTab === 'central_raw' && (
          <div className="space-y-6">
            <div className="bg-[#121622] rounded-xl border border-neutral-800 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Central Executive Protocol View (Phase 1)</h2>
                  <p className="text-xs text-neutral-400">
                    Highest constitutional posts and Union Council of Ministers
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(centralExecutiveData, null, 2), 'central_json')
                  }
                  className="px-3 py-1.5 text-xs font-mono rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
                >
                  {copied === 'central_json' ? '✓ Copied' : 'Copy Union JSON'}
                </button>
              </div>

              {/* Grid cards for central executive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#0b0e15] p-4 rounded-lg border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Head of State</span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {centralExecutiveData.union_executive.president.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">
                    President of India (Since {centralExecutiveData.union_executive.president.tenure_start})
                  </p>
                </div>

                <div className="bg-[#0b0e15] p-4 rounded-lg border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Chairman, Rajya Sabha</span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {centralExecutiveData.union_executive.vice_president.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">
                    Vice President of India (Since {centralExecutiveData.union_executive.vice_president.tenure_start})
                  </p>
                </div>

                <div className="bg-[#0b0e15] p-4 rounded-lg border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Head of Government</span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {centralExecutiveData.union_executive.prime_minister.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">
                    Prime Minister (Since {centralExecutiveData.union_executive.prime_minister.tenure_start})
                  </p>
                </div>

                <div className="bg-[#0b0e15] p-4 rounded-lg border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Speaker, Lok Sabha</span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {centralExecutiveData.union_executive.speaker_lok_sabha.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">
                    Speaker of 18th Lok Sabha (Since {centralExecutiveData.union_executive.speaker_lok_sabha.tenure_start})
                  </p>
                </div>
              </div>

              {/* Key Cabinet Ministers */}
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider font-mono mb-3">
                Key Cabinet Ministers (Union Council of Ministers)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {centralExecutiveData.union_executive.key_cabinet_ministers.map((min, idx) => (
                  <div key={idx} className="bg-[#0e131d] p-3 rounded-lg border border-neutral-800">
                    <span className="text-xs font-semibold text-amber-300 block">{min.portfolio}</span>
                    <span className="text-sm font-medium text-white">{min.name}</span>
                    <span className="text-[10px] font-mono text-neutral-500 block">{min.party}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw JSON Code block */}
            <div className="bg-[#0b0e15] rounded-xl border border-neutral-800 p-4">
              <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-2">
                {JSON.stringify(centralExecutiveData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* State Raw JSON Tab */}
        {activeTab === 'state_raw' && (
          <div className="space-y-4">
            <div className="bg-[#121622] rounded-xl border border-neutral-800 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white font-mono">
                  {currentState.state}.json ({currentState.mlas.length} records)
                </h2>
                <p className="text-xs text-neutral-400">
                  Compliant with the required schema
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(currentState, null, 2), 'state_raw_clip')
                  }
                  className="px-3 py-1.5 text-xs font-mono rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
                >
                  {copied === 'state_raw_clip' ? '✓ Copied' : 'Copy All'}
                </button>
                <button
                  onClick={() => downloadJson(currentState, `${selectedStateKey}_mlas.json`)}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30"
                >
                  Download .JSON
                </button>
              </div>
            </div>

            <div className="bg-[#080b11] rounded-xl border border-neutral-800 p-4 font-mono text-xs max-h-[70vh] overflow-y-auto">
              <pre className="text-emerald-400 whitespace-pre-wrap">
                {JSON.stringify(currentState, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* API Docs & Batch Status Tab */}
        {activeTab === 'api_docs' && (
          <div className="bg-[#121622] rounded-xl border border-neutral-800 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Automated Political Data Engine Protocol</h2>
              <p className="text-xs text-neutral-400 mt-1">
                State-by-State batch delivery status & schema specifications.
              </p>
            </div>

            {/* Batch Status Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                <div className="text-emerald-400 font-bold mb-1">BATCH 1 (COMPLETE)</div>
                <div className="text-neutral-300">Central Executive (12 Portfolios)</div>
                <div className="text-neutral-300">Andhra Pradesh (175 Constituencies)</div>
                <div className="mt-2 text-[10px] text-emerald-400 font-bold">STATUS: ARCHIVED & READY</div>
              </div>

              <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-800/40">
                <div className="text-amber-400 font-bold mb-1">BATCH 2 (COMPLETE)</div>
                <div className="text-neutral-300">Arunachal Pradesh (60 Constituencies)</div>
                <div className="text-neutral-300">Assam (126 Constituencies)</div>
                <div className="mt-2 text-[10px] text-amber-400 font-bold">STATUS: DELIVERED</div>
              </div>

              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="text-neutral-400 font-bold mb-1">BATCH 3 (UPCOMING)</div>
                <div className="text-neutral-400">Bihar (243 Constituencies)</div>
                <div className="text-neutral-400">Chhattisgarh (90 Constituencies)</div>
                <div className="mt-2 text-[10px] text-neutral-500">TRIGGER: SAY 'GO'</div>
              </div>
            </div>

            {/* Target Schema */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2 font-mono">Enforced Schema</h3>
              <pre className="p-4 rounded-lg bg-[#0b0e15] border border-neutral-800 text-xs font-mono text-amber-300 overflow-x-auto">
{`{
  "state": "State Name",
  "total_seats": 00,
  "governor": "Current Governor Name",
  "chief_minister": "Current CM Name",
  "mlas": [
    {
      "constituency_no": 1,
      "constituency": "Constituency Name",
      "district": "District Name",
      "mla_name": "Sitting MLA Name",
      "party": "Party Name",
      "net_worth_crores": 0.0,
      "criminal_cases": 0,
      "primary_complaint": "Roads/Water/Schools",
      "drought_status": "Normal/Deficit/Severe"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
