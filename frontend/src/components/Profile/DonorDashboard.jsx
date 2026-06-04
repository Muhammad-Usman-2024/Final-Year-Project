import React from 'react';
import { CheckCircle2, XCircle, Clock, Heart, Award, Calendar } from 'lucide-react';

const DonorDashboard = ({ clinicalData }) => {
  const stats = [
    { label: 'Total Donations', value: clinicalData?.totalDonations || 8, icon: <Heart className="text-accent-red" />, bg: 'bg-accent-red/10' },
    { label: 'Lives Saved', value: clinicalData?.livesSaved || 24, icon: <Award className="text-accent-blue" />, bg: 'bg-accent-blue/10' },
    { label: 'Next Eligible Date', value: clinicalData?.nextEligibleDate || '12 June 2026', icon: <Calendar className="text-accent-green" />, bg: 'bg-accent-green/10' },
  ];

  const eligibilityCriteria = [
    { label: 'Age (18-60 years)', status: true },
    { label: 'Weight (> 50 kg)', status: true },
    { label: 'Hb Level (> 12.5 g/dL)', status: true },
    { label: 'Last donation gap (> 90 days)', status: true },
    { label: 'No major surgeries (1 year)', status: true },
    { label: 'No chronic medications', status: false },
    { label: 'Recent travel check', status: true },
  ];

  return (
    <div className="fade-in space-y-8">
      {/* Donor Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center`}>
            {stat.icon}
            <h4 className="text-2xl font-bold mt-2">{stat.value}</h4>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Eligibility Checklist */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Eligibility Checklist</h3>
          <div className="bg-card-bg border border-border-color rounded-2xl p-4 space-y-3">
            {eligibilityCriteria.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                <span className="text-sm text-gray-300">{item.label}</span>
                {item.status ? (
                  <CheckCircle2 size={18} className="text-accent-green" />
                ) : (
                  <XCircle size={18} className="text-accent-red" />
                )}
              </div>
            ))}
            <div className="mt-4 p-4 rounded-xl bg-accent-green/10 border border-accent-green/20 text-center">
              <p className="text-sm font-bold text-accent-green">You are currently eligible to donate!</p>
            </div>
          </div>
        </div>

        {/* Donation History Timeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Donation Timeline</h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {(clinicalData?.donations || [
              { date: '12 March 2026', location: 'Indus Hospital, Lahore', status: 'Completed' },
              { date: '10 Dec 2025', location: 'Shaukat Khanum, Lahore', status: 'Completed' },
              { date: '05 Sept 2025', location: 'Mobile Blood Camp', status: 'Completed' },
            ]).map((donation, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-accent-red border-2 border-primary-bg"></div>
                <div className="bg-card-bg border border-border-color p-4 rounded-xl hover:border-accent-red/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold">{donation.location}</h4>
                    <span className="text-[10px] bg-accent-green/20 text-accent-green px-2 py-0.5 rounded-full font-bold uppercase">{donation.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock size={12} /> {donation.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
