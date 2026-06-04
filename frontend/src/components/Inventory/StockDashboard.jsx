import React, { useState, useEffect } from 'react';
import { Droplets, Activity, AlertTriangle, ChevronRight, Filter, Search } from 'lucide-react';
import { inventoryService } from '../../api/apiService';

const StockDashboard = () => {
  const [stock, setStock] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await inventoryService.getStock();
        setStock(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Good': return 'text-accent-green bg-accent-green/10 border-accent-green/30';
      case 'Low': return 'text-accent-orange bg-accent-orange/10 border-accent-orange/30';
      case 'Critical': return 'text-accent-red bg-accent-red/10 border-accent-red/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Good': return 'bg-accent-green';
      case 'Low': return 'bg-accent-orange';
      case 'Critical': return 'bg-accent-red';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fade-in space-y-8">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Blood Inventory Status</h2>
          <p className="text-sm text-gray-500">Real-time stock monitoring across all groups</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input placeholder="Search Group..." className="input-field pl-10 py-2 text-sm w-40 bg-white/5" />
          </div>
          <button className="tab-btn px-4 py-2 text-sm"><Filter size={14} /> Filter</button>
        </div>
      </div>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {groups.map((group) => {
          const data = stock[group] || { RBC: 0, Platelets: 0, FFP: 0, status: 'Low' };
          const total = data.RBC + data.Platelets + data.FFP;
          const percentage = Math.min((total / 40) * 100, 100);

          return (
            <div key={group} className="bg-card-bg border border-border-color p-6 rounded-[24px] hover:border-white/20 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent-red/10 flex items-center justify-center text-accent-red font-bold text-xl border border-accent-red/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:scale-110 transition-transform">
                  {group}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(data.status)}`}>
                  {data.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-400">Total Units</span>
                  <span className="text-white">{total} Bags</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${getProgressColor(data.status)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Component Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">RBC</p>
                  <p className="text-sm font-bold">{data.RBC}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Plt</p>
                  <p className="text-sm font-bold">{data.Platelets}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">FFP</p>
                  <p className="text-sm font-bold">{data.FFP}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Threshold Legend */}
      <div className="flex flex-wrap justify-center gap-8 p-6 bg-secondary-bg/50 border border-white/5 rounded-2xl text-xs font-bold text-gray-500 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-green"></div>
          <span>Good: 20+ Units</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-orange"></div>
          <span>Low: 10-19 Units</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-red"></div>
          <span>Critical: 0-9 Units</span>
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;
