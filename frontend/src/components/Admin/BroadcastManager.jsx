import React, { useState } from 'react';
import { Send, Users, ShieldAlert, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../api/apiService';

const BroadcastManager = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [targetRoles, setTargetRoles] = useState(['Patient', 'Donor']);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const roles = ['Patient', 'Donor', 'Hospital', 'Doctor'];

    const handleToggleRole = (role) => {
        if (targetRoles.includes(role)) {
            setTargetRoles(targetRoles.filter(r => r !== role));
        } else {
            setTargetRoles([...targetRoles, role]);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminService.sendBroadcast({ title, body, targetRoles });
            setSent(true);
            setTitle('');
            setBody('');
            setTimeout(() => setSent(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Creation Form */}
            <form onSubmit={handleSend} className="bg-card-bg border border-border-color p-10 rounded-[40px] space-y-8 relative overflow-hidden">
                {sent && (
                    <div className="absolute inset-0 bg-accent-green/10 backdrop-blur-md flex flex-col items-center justify-center z-20 animate-in fade-in duration-300">
                        <CheckCircle2 size={64} className="text-accent-green mb-4" />
                        <h3 className="text-2xl font-bold">Broadcast Sent!</h3>
                        <p className="text-sm text-gray-500">JazakAllah for the update.</p>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent-blue/10 rounded-2xl text-accent-blue">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="font-bold text-xl">New Global Broadcast</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Campaign Title</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="e.g. World Blood Donor Day Alert" 
                            className="input-field bg-secondary-bg/50 border-white/5"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Target Audiences</label>
                        <div className="flex flex-wrap gap-3">
                            {roles.map(role => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleToggleRole(role)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                        targetRoles.includes(role) 
                                            ? 'bg-accent-blue text-white border-accent-blue shadow-lg shadow-accent-blue/20' 
                                            : 'bg-white/5 border-white/5 text-gray-500'
                                    }`}
                                >
                                    {role}s
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Message Body</label>
                        <textarea 
                            required 
                            placeholder="Type your message here... it will be delivered via in-app alerts." 
                            className="input-field min-h-[160px] bg-secondary-bg/50 border-white/5"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <button 
                    disabled={loading || targetRoles.length === 0}
                    className="w-full py-4 bg-accent-blue text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent-blue/20 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Deploy Broadcast</>}
                </button>
            </form>

            {/* Preview Card */}
            <div className="space-y-8">
                <div className="bg-card-bg border border-border-color p-10 rounded-[40px] space-y-6">
                    <div className="flex items-center gap-3 text-accent-orange">
                        <ShieldAlert size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Preview</span>
                    </div>
                    
                    <div className="p-8 bg-secondary-bg/50 border border-white/10 rounded-[32px] space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="px-3 py-1 bg-accent-red/10 text-accent-red text-[8px] font-black rounded-lg border border-accent-red/20 uppercase tracking-widest">
                                Critical Broadcast
                            </span>
                            <span className="text-[8px] text-gray-600 font-bold uppercase">Just Now</span>
                        </div>
                        <h4 className="text-xl font-bold">{title || 'Your Broadcast Title'}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed italic">
                            {body || 'Start typing to see how your message will appear to users in the Notification Drawer...'}
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-accent-blue/10 to-transparent border border-white/5 p-8 rounded-[32px] flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent-blue/20 flex items-center justify-center text-accent-blue shadow-inner">
                        <Users size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Reach Estimate</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Based on your selection, this message will reach approximately <strong className="text-white">1,240 users</strong> across the platform.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BroadcastManager;
