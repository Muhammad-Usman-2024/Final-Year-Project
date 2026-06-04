import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Moon, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { notifyService } from '../../api/apiService';
import { useSelector } from 'react-redux';

const NotificationPreferences = () => {
    const { user } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [prefs, setPrefs] = useState({
        channels: { email: true, sms: false, push: true, whatsapp: false },
        quietHours: { enabled: false, start: '22:00', end: '08:00' },
        categories: { urgent: true, reminders: true, system: true }
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            await notifyService.updatePrefs(user._id, prefs);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card-bg border border-border-color p-8 rounded-[40px] space-y-10 relative overflow-hidden">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent-blue/10 rounded-2xl text-accent-blue">
                        <Bell size={24} />
                    </div>
                    <h3 className="font-bold text-xl">Communication Preferences</h3>
                </div>
                {saved && <span className="text-[10px] text-accent-green font-bold flex items-center gap-1 uppercase tracking-widest animate-in fade-in slide-in-from-right-4"><CheckCircle2 size={12} /> Preferences Saved</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Channels */}
                <div className="space-y-6">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] px-2">Delivery Channels</h4>
                    <div className="space-y-3">
                        {[
                            { id: 'push', label: 'In-App Push', icon: <Bell size={16} /> },
                            { id: 'email', label: 'Email Notifications', icon: <Mail size={16} /> },
                            { id: 'sms', label: 'SMS Alerts', icon: <MessageSquare size={16} /> },
                            { id: 'whatsapp', label: 'WhatsApp Updates', icon: <MessageSquare size={16} /> },
                        ].map(ch => (
                            <div key={ch.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-accent-blue/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 group-hover:text-accent-blue transition-colors">{ch.icon}</span>
                                    <span className="text-sm font-bold text-gray-300">{ch.label}</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={prefs.channels[ch.id]} onChange={() => setPrefs({...prefs, channels: {...prefs.channels, [ch.id]: !prefs.channels[ch.id]}})} />
                                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quiet Hours */}
                <div className="space-y-6">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] px-2">Focus Mode</h4>
                    <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Moon className="text-accent-purple" size={20} />
                                <span className="text-sm font-bold text-gray-300">Quiet Hours</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={prefs.quietHours.enabled} onChange={() => setPrefs({...prefs, quietHours: {...prefs.quietHours, enabled: !prefs.quietHours.enabled}})} />
                                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
                            </label>
                        </div>
                        <p className="text-[10px] text-gray-500 italic">Mute non-urgent alerts during specific times to maintain focus.</p>
                        
                        <div className={`grid grid-cols-2 gap-4 transition-all ${prefs.quietHours.enabled ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">From</label>
                                <input type="time" value={prefs.quietHours.start} onChange={e => setPrefs({...prefs, quietHours: {...prefs.quietHours, start: e.target.value}})} className="input-field bg-secondary-bg/50 border-white/5 text-xs font-bold" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">To</label>
                                <input type="time" value={prefs.quietHours.end} onChange={e => setPrefs({...prefs, quietHours: {...prefs.quietHours, end: e.target.value}})} className="input-field bg-secondary-bg/50 border-white/5 text-xs font-bold" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex justify-end">
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="px-10 py-4 bg-accent-blue text-white font-bold rounded-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-blue/20"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Preferences</>}
                </button>
            </div>
        </div>
    );
};

export default NotificationPreferences;
