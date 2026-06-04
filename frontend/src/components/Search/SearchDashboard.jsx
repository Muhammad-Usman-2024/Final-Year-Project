import React, { useState } from 'react';
import { Search, Radio, Bell, Map as MapIcon, History } from 'lucide-react';
import SearchInterface from './SearchInterface';
import DonorResults from './DonorResults';
import NearbyBanks from './NearbyBanks';
import BroadcastModal from './BroadcastModal';
import CompatibilityTool from './CompatibilityTool';


const SearchDashboard = () => {
  const [results, setResults] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 pb-24">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Blood Search Hub</h2>
          <p className="text-gray-500">Connecting patients with the nearest compatible matches.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
            <History size={16} /> Search History
          </button>
          <button className="px-5 py-2 bg-accent-red text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-accent-red/20 hover:scale-105 transition-all">
            <Bell size={16} /> My Alerts
          </button>
        </div>
      </div>

      {/* Main Search Panel */}
      <SearchInterface onResults={setResults} />

      {/* Results Section */}
      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <DonorResults results={results.donors} />
            <NearbyBanks results={results.banks} targetGroup={results.filters.bloodGroup} />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-accent-red/20 to-accent-orange/20 border border-accent-red/20 p-8 rounded-[32px] space-y-6 sticky top-24">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent-red text-white rounded-2xl">
                  <Radio size={24} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Can't find a match?</h4>
                  <p className="text-xs text-gray-500">Initiate an urgent broadcast</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                A broadcast will notify all compatible donors in <span className="font-bold text-white">{results.filters.city}</span> instantly via Push, SMS, and Email.
              </p>
              <button 
                onClick={() => setShowBroadcast(true)}
                className="w-full py-4 bg-accent-red text-white font-bold rounded-2xl shadow-xl shadow-accent-red/30 hover:scale-[1.02] transition-all"
              >
                Send Urgent Broadcast
              </button>
            </div>

            <CompatibilityTool />


            <div className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-4">
              <h4 className="font-bold flex items-center gap-2"><MapIcon size={18} className="text-accent-blue" /> Quick Help</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Matches are ranked by compatibility score which considers distance, donation history, and real-time eligibility.
              </p>
              <ul className="space-y-2 pt-2">
                {['Direct Contact', 'Location Radius', 'Compatible Groups'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="w-1 h-1 rounded-full bg-accent-blue"></div> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal Overlay */}
      {showBroadcast && (
        <BroadcastModal 
          filters={results.filters} 
          onClose={() => setShowBroadcast(false)} 
        />
      )}
    </div>
  );
};

export default SearchDashboard;
