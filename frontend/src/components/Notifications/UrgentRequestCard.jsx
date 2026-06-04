import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Clock, MapPin, Loader2 } from 'lucide-react';
import { notifyService } from '../../api/apiService';

const UrgentRequestCard = ({ notification, onActionComplete }) => {
    const [loading, setLoading] = useState(false);
    const [responded, setResponded] = useState(notification.status !== 'Unread' && notification.status !== 'Read');

    const handleAction = async (action) => {
        setLoading(true);
        try {
            await notifyService.respond(notification._id, action);
            setResponded(true);
            if (onActionComplete) onActionComplete();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (responded) {
        return (
            <div className="p-4 bg-accent-green/10 border border-accent-green/20 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="text-accent-green" size={20} />
                <span className="text-xs font-bold text-accent-green">Response Recorded: {notification.status}</span>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-accent-red/20 to-accent-red/5 border border-accent-red/30 p-6 rounded-3xl space-y-4 animate-pulse-slow">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-accent-red">
                    <ShieldAlert size={20} className="animate-bounce" />
                    <span className="text-xs font-black uppercase tracking-widest">Urgent Blood Need</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold bg-white/5 px-2 py-1 rounded-lg">
                    <Clock size={12} /> 2h left
                </div>
            </div>

            <div className="space-y-1">
                <h4 className="font-bold text-white text-lg">{notification.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{notification.body}</p>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <MapPin size={12} /> {notification.city || 'Within 5km'}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                    onClick={() => handleAction('Accept')}
                    disabled={loading}
                    className="py-3 bg-accent-green text-white font-bold rounded-xl text-xs hover:bg-accent-green/90 transition-all shadow-lg shadow-accent-green/20 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={14} /> : 'I CAN DONATE'}
                </button>
                <button 
                    onClick={() => handleAction('Decline')}
                    disabled={loading}
                    className="py-3 bg-white/5 text-gray-400 font-bold rounded-xl text-xs hover:bg-white/10 transition-all border border-white/5"
                >
                    UNAVAILABLE
                </button>
            </div>
        </div>
    );
};

export default UrgentRequestCard;
