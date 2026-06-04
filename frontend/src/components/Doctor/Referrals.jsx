import React, { useState, useEffect } from 'react';
import { Send, Activity, HeartPulse, Bone, Stethoscope, Clock, Save, Loader2 } from 'lucide-react';
import { doctorService } from '../../api/apiService';

const specialtyIcons = {
    'Cardiac': <HeartPulse size={16} />,
    'Endocrine': <Activity size={16} />,
    'Bone': <Bone size={16} />,
    'General': <Stethoscope size={16} />,
    'Other': <Stethoscope size={16} />
};

const Referrals = ({ patientId }) => {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        specialty: 'Cardiac',
        reason: '',
        letterNotes: ''
    });

    const fetchReferrals = async () => {
        setLoading(true);
        try {
            const res = await doctorService.getReferrals(patientId);
            setReferrals(res.data.data);
        } catch (error) {
            console.error("Error fetching referrals", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) fetchReferrals();
    }, [patientId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await doctorService.createReferral(patientId, formData);
            setFormData({ specialty: 'Cardiac', reason: '', letterNotes: '' });
            fetchReferrals();
        } catch (error) {
            console.error("Error creating referral", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Referral Form */}
            <div className="bg-card-bg border border-border-color rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent-purple">
                    <Send size={20} /> Create Referral
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Specialty</label>
                        <select required value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="input-field">
                            <option value="Cardiac">Cardiology</option>
                            <option value="Endocrine">Endocrinology</option>
                            <option value="Bone">Orthopedics / Bone</option>
                            <option value="General">General Medicine</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Reason for Referral</label>
                        <input type="text" required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="input-field" placeholder="e.g. Echo for suspected iron cardiomyopathy" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Letter Notes (Optional)</label>
                        <textarea value={formData.letterNotes} onChange={e => setFormData({...formData, letterNotes: e.target.value})} className="input-field min-h-[100px]" placeholder="Detailed clinical summary for the specialist..."></textarea>
                    </div>
                    <button type="submit" disabled={saving} className="w-full py-3 bg-accent-purple text-white font-bold rounded-xl hover:bg-accent-purple/90 transition-all flex items-center justify-center gap-2">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Generate Referral Letter
                    </button>
                </form>
            </div>

            {/* Referral Tracking */}
            <div className="bg-card-bg border border-border-color rounded-3xl p-6 h-[500px] overflow-y-auto custom-scrollbar">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-400">
                    <Clock size={20} /> Referral History
                </h3>
                
                {loading ? (
                    <p className="text-center text-gray-500">Loading history...</p>
                ) : referrals.length > 0 ? (
                    <div className="space-y-4">
                        {referrals.map((ref) => (
                            <div key={ref._id} className="p-4 border border-white/10 rounded-2xl bg-white/5 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full ${
                                    ref.status === 'Sent' ? 'bg-accent-blue' :
                                    ref.status === 'Accepted' ? 'bg-accent-orange' : 'bg-accent-green'
                                }`}></div>
                                
                                <div className="flex justify-between items-start mb-2 pl-2">
                                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                                        <span className="text-accent-purple">{specialtyIcons[ref.specialty] || <Stethoscope size={16} />}</span>
                                        {ref.specialty} Specialist
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${
                                        ref.status === 'Sent' ? 'text-accent-blue border-accent-blue/30 bg-accent-blue/10' :
                                        ref.status === 'Accepted' ? 'text-accent-orange border-accent-orange/30 bg-accent-orange/10' :
                                        'text-accent-green border-accent-green/30 bg-accent-green/10'
                                    }`}>
                                        {ref.status}
                                    </span>
                                </div>
                                
                                <div className="pl-2 space-y-2">
                                    <p className="text-xs text-gray-400"><strong className="text-gray-300">Reason:</strong> {ref.reason}</p>
                                    <div className="flex justify-between items-end mt-3 border-t border-white/5 pt-2">
                                        <p className="text-[10px] text-gray-500">{new Date(ref.date).toLocaleDateString()}</p>
                                        <button className="text-[10px] font-bold text-accent-blue hover:text-white transition-colors">VIEW LETTER</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        <Send size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No referrals issued yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Referrals;
