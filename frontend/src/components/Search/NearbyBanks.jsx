import React from 'react';
import { Landmark, Package, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

const NearbyBanks = ({ results, targetGroup }) => {
  const hospitals = [
    { id: 'h1', name: 'Services Hospital', location: 'Jail Road', stock: 12, distance: '2.4 km' },
    { id: 'h2', name: 'Indus Hospital', location: 'Ferozepur Rd', stock: 5, distance: '5.1 km' },
    { id: 'h3', name: 'Jinnah Hospital', location: 'Faisal Town', stock: 0, distance: '8.7 km' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Nearby Blood Banks ({targetGroup} Stock)</h3>
        <span className="text-[10px] text-accent-blue flex items-center gap-1 font-bold"><Landmark size={12} /> Live Inventory</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hospitals.map((bank) => (
          <div key={bank.id} className="bg-card-bg border border-border-color p-5 rounded-2xl space-y-4 hover:border-accent-blue/30 transition-all group">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
                <Landmark size={20} />
              </div>
              <span className="text-[10px] font-bold text-gray-500">{bank.distance}</span>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold">{bank.name}</h4>
              <p className="text-xs text-gray-500">{bank.location}</p>
            </div>

            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              bank.stock > 10 ? 'bg-accent-green/10 border-accent-green/20 text-accent-green' :
              bank.stock > 0 ? 'bg-accent-orange/10 border-accent-orange/20 text-accent-orange' :
              'bg-accent-red/10 border-accent-red/20 text-accent-red'
            }`}>
              <div className="flex items-center gap-2">
                <Package size={14} />
                <span className="text-xs font-bold uppercase">{bank.stock} Units</span>
              </div>
              {bank.stock > 0 ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            </div>

            <button className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-accent-blue transition-colors pt-2">
              Reserve Units <ExternalLink size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyBanks;
