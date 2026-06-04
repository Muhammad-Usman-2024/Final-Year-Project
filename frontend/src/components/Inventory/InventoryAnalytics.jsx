import React from 'react';
import { TrendingUp, TrendingDown, PieChart, BarChart3, Activity } from 'lucide-react';

const InventoryAnalytics = () => {
  const stats = [
    { label: 'Monthly Collection', value: '840', sub: '+12% from last month', trend: 'up' },
    { label: 'Monthly Issuance', value: '710', sub: '-5% from last month', trend: 'down' },
    { label: 'Fulfillment Rate', value: '94%', sub: 'Target: 98%', trend: 'up' },
    { label: 'Expiry Waste', value: '1.2%', sub: 'Industry Avg: 3%', trend: 'down' },
  ];

  return (
    <div className="fade-in space-y-10 max-w-6xl mx-auto">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card-bg border border-border-color p-6 rounded-[24px] space-y-2">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
            <h4 className="text-3xl font-bold">{stat.value}</h4>
            <p className={`text-[10px] flex items-center gap-1 font-bold ${stat.trend === 'up' ? 'text-accent-green' : 'text-accent-red'}`}>
              {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Collection vs Issuance Chart Placeholder */}
        <div className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><BarChart3 className="text-accent-blue" size={18} /> Collection vs Issuance</h3>
            <select className="bg-white/5 border border-white/10 text-[10px] font-bold p-1 rounded">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-4">
            {[50, 80, 45, 90, 65, 85].map((h, i) => (
              <div key={i} className="flex-1 flex gap-1 items-end h-full">
                <div className="w-full bg-accent-blue/40 rounded-t-lg transition-all hover:bg-accent-blue" style={{ height: `${h}%` }}></div>
                <div className="w-full bg-accent-red/40 rounded-t-lg transition-all hover:bg-accent-red" style={{ height: `${h * 0.8}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-accent-blue rounded"></div> Collection</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-accent-red rounded"></div> Issuance</div>
          </div>
        </div>

        {/* Group Distribution Pie Placeholder */}
        <div className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><PieChart className="text-accent-purple" size={18} /> Group Distribution</h3>
            <Activity className="text-gray-600" size={18} />
          </div>
          <div className="flex items-center justify-center h-64">
             {/* Simple visual representation of a pie chart using layers */}
             <div className="relative w-48 h-48 rounded-full border-[20px] border-accent-blue/20 flex items-center justify-center">
                <div className="absolute inset-0 border-[20px] border-accent-red border-l-transparent border-b-transparent rounded-full transform rotate-45"></div>
                <div className="absolute inset-0 border-[20px] border-accent-green border-r-transparent border-t-transparent rounded-full transform -rotate-12"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold">O+</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Largest Stock</p>
                </div>
             </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {['A+', 'B+', 'O+', 'AB+'].map((g, i) => (
              <div key={i} className="text-center space-y-1">
                <p className="text-[10px] text-gray-500 font-bold">{g}</p>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-purple" style={{ width: `${70 - i * 15}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalytics;
