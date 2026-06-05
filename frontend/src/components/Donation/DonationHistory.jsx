import React from 'react';
import { Calendar, Clock, Download } from 'lucide-react';

const DonationHistory = ({ history = [] }) => {
  const monthlyCounts = Array.from({ length: 12 }, () => 0);
  history.forEach((item) => {
    const date = new Date(item.date);
    if (!Number.isNaN(date.getTime())) {
      monthlyCounts[date.getMonth()] += 1;
    }
  });

  const maxMonthlyCount = Math.max(...monthlyCounts, 0);

  const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? 'No data'
      : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="fade-in space-y-8 max-w-4xl mx-auto">
      <div className="bg-card-bg border border-border-color p-8 rounded-[24px]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Donations Per Year</h3>
          <div className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-xs font-bold">
            {new Date().getFullYear()}
          </div>
        </div>

        <div className="flex items-end justify-around h-40 gap-4">
          {monthlyCounts.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={`w-full rounded-t-lg transition-all duration-1000 ${count > 0 ? 'bg-accent-red shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white/10'}`}
                style={{ height: `${maxMonthlyCount ? Math.max((count / maxMonthlyCount) * 100, 8) : 0}%` }}
              />
              <span className="text-[8px] text-gray-600 font-bold">M{i + 1}</span>
            </div>
          ))}
        </div>

        {!history.length && <p className="text-center text-sm text-gray-500 mt-4">No data</p>}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Donation Timeline</h3>
          <div className="px-4 py-1.5 bg-secondary-bg rounded-xl border border-white/5 text-xs font-bold text-gray-500">
            {history.length || 0} records
          </div>
        </div>

        <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/5">
          {history.length ? history.map((item, idx) => (
            <div key={item._id || idx} className="relative">
              <div className={`absolute -left-[30px] top-2 w-4 h-4 rounded-full border-4 border-primary-bg z-10 ${
                item.status === 'Completed' ? 'bg-accent-green shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-accent-red shadow-[0_0_10px_rgba(239,68,68,0.5)]'
              }`} />

              <div className="bg-card-bg border border-border-color p-6 rounded-2xl hover:border-white/20 transition-all">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold">{item.hospitalName || 'No data'}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.status === 'Completed' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'
                      }`}>
                        {item.status || 'No data'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} /> {formatDate(item.date)} - <Clock size={14} /> {item.type || 'No data'} ({item.volume || 'No data'})
                    </p>
                  </div>

                  {item.status === 'Completed' && (
                    <button className="flex items-center gap-2 text-xs font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 self-start">
                      <Download size={14} className="text-accent-blue" /> E-Certificate
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">BP</p>
                    <p className="text-sm font-bold">{item.vitals?.bp || 'No data'} <span className="text-[10px] text-gray-600">mmHg</span></p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Hb</p>
                    <p className="text-sm font-bold">{item.vitals?.hb || 'No data'} <span className="text-[10px] text-gray-600">g/dL</span></p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Temp</p>
                    <p className="text-sm font-bold">{item.vitals?.temp || 'No data'} <span className="text-[10px] text-gray-600">C</span></p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Vitals Check</p>
                    <p className={`text-sm font-bold ${item.status === 'Completed' ? 'text-accent-green' : 'text-accent-red'}`}>
                      {item.status === 'Completed' ? 'Passed' : item.status ? 'Failed' : 'No data'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-card-bg border border-dashed border-white/10 p-10 rounded-2xl text-center text-gray-500">
              No data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
