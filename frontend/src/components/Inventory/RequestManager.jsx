import React from 'react';
import { Send, Clock, CheckCircle2, Truck, Package, AlertCircle } from 'lucide-react';

const RequestManager = () => {
  const requests = [
    { id: 'REQ-9921', group: 'A+', component: 'RBC', units: 4, hospital: 'Children Hospital', priority: 'Emergency', status: 'Pending', time: '10 mins ago' },
    { id: 'REQ-9918', group: 'O-', component: 'Platelets', units: 2, hospital: 'Indus Hospital', priority: 'Urgent', status: 'Approved', time: '1 hour ago' },
    { id: 'REQ-9915', group: 'B+', component: 'FFP', units: 6, hospital: 'Shaukat Khanum', priority: 'Routine', status: 'Dispatched', time: '3 hours ago' },
  ];

  const getPriorityColor = (p) => {
    switch (p) {
      case 'Emergency': return 'bg-accent-red text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]';
      case 'Urgent': return 'bg-accent-orange text-white';
      default: return 'bg-white/10 text-gray-400';
    }
  };

  const getStatusIcon = (s) => {
    switch (s) {
      case 'Pending': return <Clock size={16} className="text-accent-orange" />;
      case 'Approved': return <CheckCircle2 size={16} className="text-accent-green" />;
      case 'Dispatched': return <Truck size={16} className="text-accent-blue" />;
      case 'Delivered': return <Package size={16} className="text-accent-green" />;
      default: return null;
    }
  };

  return (
    <div className="fade-in space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Incoming Blood Requests</h2>
          <p className="text-sm text-gray-500">Manage and fulfill hospital requirements</p>
        </div>
        <button className="submit-btn !w-auto px-6 py-2 text-sm flex items-center gap-2">
          <Send size={16} /> Create New Request
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-card-bg border border-border-color rounded-2xl overflow-hidden group hover:border-white/20 transition-all">
            <div className="flex flex-col md:flex-row">
              {/* Left Indicator */}
              <div className={`w-2 md:w-3 ${req.priority === 'Emergency' ? 'bg-accent-red' : req.priority === 'Urgent' ? 'bg-accent-orange' : 'bg-white/10'}`}></div>
              
              <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-accent-red">{req.group}</span>
                    <span className="text-[8px] font-bold uppercase text-gray-500">{req.component}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-lg">{req.hospital}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${getPriorityColor(req.priority)}`}>
                        {req.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <Package size={14} /> {req.units} Units Required • <Clock size={14} /> {req.time}
                    </p>
                  </div>
                </div>

                {/* Pipeline Status */}
                <div className="flex items-center gap-8 px-8 border-x border-white/5">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${req.status === 'Pending' ? 'border-accent-orange bg-accent-orange/20' : 'border-white/5 bg-white/5 text-gray-600'}`}>
                      <Clock size={14} />
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Pending</span>
                  </div>
                  <div className="w-8 h-0.5 bg-white/5"></div>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${req.status === 'Approved' ? 'border-accent-green bg-accent-green/20' : 'border-white/5 bg-white/5 text-gray-600'}`}>
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Approved</span>
                  </div>
                  <div className="w-8 h-0.5 bg-white/5"></div>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${req.status === 'Dispatched' ? 'border-accent-blue bg-accent-blue/20' : 'border-white/5 bg-white/5 text-gray-600'}`}>
                      <Truck size={14} />
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Dispatched</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <button className="px-6 py-2 bg-accent-red text-white text-xs font-bold rounded-xl hover:bg-accent-red/80 transition-colors">
                    Fulfill Request
                  </button>
                  <button className="px-6 py-2 bg-white/5 text-gray-400 text-xs font-bold rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Stock Warning */}
      <div className="p-4 bg-accent-red/10 border border-accent-red/20 rounded-2xl flex items-center gap-4">
        <div className="p-2 bg-accent-red rounded-lg text-white animate-pulse">
          <AlertCircle size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-accent-red uppercase tracking-wider">Critical Stock Alert</p>
          <p className="text-xs text-gray-400">Group O- is below critical threshold (2 units left). Fulfilling REQ-9918 will empty the stock.</p>
        </div>
      </div>
    </div>
  );
};

export default RequestManager;
