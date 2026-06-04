import React, { useState, useEffect } from 'react';
import { Search, MapPin, Droplets, Filter, Radio, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { searchService } from '../../api/apiService';

const SearchInterface = ({ onResults }) => {
  const [filters, setFilters] = useState({
    bloodGroup: 'A+',
    city: 'Lahore',
    radius: 10,
    component: 'Whole Blood'
  });

  const [loading, setLoading] = useState(false);
  const [compatibleGroups, setCompatibleGroups] = useState([]);

  useEffect(() => {
    const fetchCompatible = async () => {
      try {
        const res = await searchService.getCompatibleGroups(filters.bloodGroup);
        setCompatibleGroups(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompatible();
  }, [filters.bloodGroup]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const donorRes = await searchService.searchDonors(filters.bloodGroup, filters.city);
      const bankRes = await searchService.getNearbyBanks(filters.bloodGroup, filters.city);
      onResults({ donors: donorRes.data.data, banks: bankRes.data.data, filters });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in bg-card-bg border border-border-color p-8 rounded-[32px] space-y-8 relative overflow-hidden">
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-3 bg-accent-red/10 rounded-2xl text-accent-red">
          <Search size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold">Find Blood & Donors</h3>
          <p className="text-sm text-gray-500">Smart search across compatible donors and hospitals</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Patient Group</label>
          <div className="relative">
            <Droplets size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-red" />
            <select 
              className="input-field pl-10 bg-secondary-bg"
              value={filters.bloodGroup}
              onChange={(e) => setFilters({...filters, bloodGroup: e.target.value})}
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Location / City</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-blue" />
            <input 
              className="input-field pl-10 bg-secondary-bg"
              placeholder="e.g. Lahore"
              value={filters.city}
              onChange={(e) => setFilters({...filters, city: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex justify-between">
            Search Radius <span>{filters.radius}km</span>
          </label>
          <input 
            type="range" 
            min="5" max="100" step="5"
            className="w-full accent-accent-red h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer mt-4"
            value={filters.radius}
            onChange={(e) => setFilters({...filters, radius: Number(e.target.value)})}
          />
        </div>

        <div className="flex items-end">
          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn flex items-center justify-center gap-2 h-[46px]"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            Search matches
          </button>
        </div>
      </form>

      {/* Compatibility Hint */}
      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-wrap items-center gap-4 relative z-10">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Compatible Groups:</span>
        <div className="flex gap-2">
          {compatibleGroups.map(g => (
            <span key={g} className="px-3 py-1 bg-accent-green/10 text-accent-green text-xs font-bold rounded-lg border border-accent-green/20">
              {g}
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-[10px] text-gray-400">
          <AlertCircle size={14} className="text-accent-orange" />
          O- is a universal donor and can be used for any patient.
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-red/5 blur-[80px] rounded-full"></div>
    </div>
  );
};

export default SearchInterface;
