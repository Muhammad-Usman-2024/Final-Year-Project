import React from 'react';
import { User, ShieldCheck, MapPin, MessageSquare, PhoneOff, Calendar, TrendingUp } from 'lucide-react';

const DonorResults = ({ results }) => {
  if (!results || results.length === 0) return (
    <div className="text-center p-12 bg-white/2 rounded-3xl border border-dashed border-white/10">
      <p className="text-gray-500">No matching donors found in this city. Try increasing the search radius or send a broadcast.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Matching Donors ({results.length})</h3>
        <span className="text-[10px] text-gray-500 flex items-center gap-1"><TrendingUp size={12} /> Ranked by Match Score</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {results.map((item, idx) => (
          <div key={idx} className="bg-card-bg border border-border-color p-6 rounded-2xl group hover:border-accent-red/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-accent-red/10 group-hover:text-accent-red transition-all">
                    <User size={32} />
                  </div>
                  {item.isEligible && (
                    <div className="absolute -top-2 -right-2 bg-accent-green text-white p-1 rounded-full border-2 border-primary-bg shadow-lg">
                      <ShieldCheck size={12} />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg">{item.donor.fullName.split(' ')[0]}***</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-accent-red/20 text-accent-red rounded-lg font-bold">{item.donor.bloodGroup}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {item.donor.personalInfo?.city || 'Unknown'}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> Last: {item.profile?.lastDonationDate ? new Date(item.profile.lastDonationDate).toLocaleDateString() : 'Never'}</span>
                  </div>
                </div>
              </div>

              {/* Match Score Gauge */}
              <div className="flex items-center gap-8 border-x border-white/5 px-8">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Match Score</p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-green" style={{ width: `${item.matchScore}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-accent-green">{item.matchScore}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-accent-blue/30 text-accent-blue transition-all" title="Request Contact">
                  <MessageSquare size={18} />
                </button>
                <button className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-gray-500/30 text-gray-500 transition-all cursor-not-allowed" title="Masked Calling (Disabled)">
                  <PhoneOff size={18} />
                </button>
                <button className="px-6 py-3 bg-accent-red text-white text-xs font-bold rounded-xl shadow-lg shadow-accent-red/10 hover:shadow-accent-red/30 transition-all">
                  Request Blood
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorResults;
