import React, { useState } from 'react';
import { Radio, X, Send, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { searchService } from '../../api/apiService';

const BroadcastModal = ({ filters, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleBroadcast = async () => {
    setLoading(true);
    try {
      await searchService.broadcastUrgent({
        bloodGroup: filters.bloodGroup,
        city: filters.city,
        urgency: 'Urgent'
      });
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary-bg/80 backdrop-blur-lg" onClick={onClose}></div>
      
      <div className="bg-card-bg border border-border-color w-full max-w-lg rounded-[32px] overflow-hidden relative animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-accent-red/20 rounded-2xl text-accent-red animate-pulse">
              <Radio size={32} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold">Urgent Broadcast</h3>
            <p className="text-sm text-gray-500">Alert all matching donors in {filters.city} immediately.</p>
          </div>

          {!sent ? (
            <>
              <div className="bg-accent-orange/10 border border-accent-orange/20 p-4 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="text-accent-orange shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-gray-400">
                  This will send an emergency notification and SMS to approximately <span className="text-white font-bold">140 donors</span> who match {filters.bloodGroup} criteria in {filters.city}.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
                  <span>Broadcast Radius</span>
                  <span className="text-accent-red">{filters.radius} KM</span>
                </div>
                <div className="p-4 bg-secondary-bg rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Droplets className="text-accent-red" />
                    <div>
                      <p className="font-bold">{filters.bloodGroup}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Whole Blood</p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-accent-green" size={18} />
                </div>
              </div>

              <button 
                onClick={handleBroadcast}
                disabled={loading}
                className="submit-btn w-full flex items-center justify-center gap-2 group"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                Initiate Broadcast
              </button>
            </>
          ) : (
            <div className="py-8 space-y-6 text-center">
              <div className="w-20 h-20 bg-accent-green/20 rounded-full flex items-center justify-center text-accent-green mx-auto border-4 border-accent-green/10">
                <ShieldCheck size={40} />
              </div>
              <div>
                <p className="font-bold text-xl">Broadcast Sent Successfully!</p>
                <p className="text-sm text-gray-500 mt-1">Donors will receive a notification and can contact you through the app.</p>
              </div>
              <button onClick={onClose} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">
                Close Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Info footer */}
        {!sent && (
          <div className="bg-secondary-bg/50 p-4 flex items-center justify-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest border-t border-white/5">
            <Info size={14} /> Only use broadcasts for genuine medical emergencies.
          </div>
        )}
      </div>
    </div>
  );
};

export default BroadcastModal;
