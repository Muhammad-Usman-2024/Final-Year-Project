import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, Save, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { appointmentService } from '../../api/apiService';
import toast from 'react-hot-toast';

const HospitalSlotManager = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([
        { time: '09:00', capacity: 8 },
        { time: '10:00', capacity: 8 },
        { time: '11:00', capacity: 8 },
        { time: '12:00', capacity: 8 },
    ]);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleAddSlot = () => {
        setSlots([...slots, { time: '13:00', capacity: 8 }]);
    };

    const handleRemoveSlot = (index) => {
        setSlots(slots.filter((_, i) => i !== index));
    };

    const handleUpdateSlot = (index, field, value) => {
        const newSlots = [...slots];
        newSlots[index][field] = value;
        setSlots(newSlots);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await appointmentService.manageSlots({ date, slots });
            setSaved(true);
            toast.success('Schedule updated successfully');
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            toast.error('Failed to save slots');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Manager View */}
            <div className="bg-card-bg border border-border-color p-10 rounded-[40px] space-y-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-accent-orange/10 rounded-2xl text-accent-orange">
                            <Calendar size={24} />
                        </div>
                        <h3 className="font-bold text-xl">Capacity Manager</h3>
                    </div>
                    {saved && <span className="text-[10px] text-accent-green font-bold flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 size={12} /> Live</span>}
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Manage Availability for Date</label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input-field bg-secondary-bg/50 border-white/5"
                    />
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">
                        <span>Time Slot</span>
                        <span>Max Capacity</span>
                        <span></span>
                    </div>
                    
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {slots.map((slot, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/2 p-4 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                                <div className="flex-1">
                                    <input 
                                        type="time" 
                                        value={slot.time} 
                                        onChange={(e) => handleUpdateSlot(i, 'time', e.target.value)}
                                        className="bg-transparent text-white font-bold w-full focus:outline-none"
                                    />
                                </div>
                                <div className="w-24">
                                    <input 
                                        type="number" 
                                        value={slot.capacity} 
                                        onChange={(e) => handleUpdateSlot(i, 'capacity', parseInt(e.target.value))}
                                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-center text-sm font-bold w-full"
                                    />
                                </div>
                                <button onClick={() => handleRemoveSlot(i)} className="text-gray-600 hover:text-accent-red p-2 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={handleAddSlot}
                        className="w-full py-4 border-2 border-dashed border-white/5 rounded-[24px] text-gray-500 hover:text-white hover:border-white/10 flex items-center justify-center gap-2 transition-all font-bold text-xs"
                    >
                        <Plus size={16} /> Add Another Slot
                    </button>
                </div>

                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full py-4 bg-accent-orange text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent-orange/20"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Update Daily Schedule</>}
                </button>
            </div>

            {/* Help / Best Practices Column */}
            <div className="space-y-8">
                <div className="bg-card-bg border border-border-color p-10 rounded-[40px] space-y-6">
                    <div className="flex items-center gap-3 text-accent-blue">
                        <ShieldAlert size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Scheduling Policy</span>
                    </div>
                    <ul className="space-y-4">
                        {[
                            'Suggested capacity for donation: 8-10 per hour.',
                            'Thalassemia transfusions take priority; block slots if reserved.',
                            '24h cancellation releases slots to the waitlist automatically.',
                            'Changes to slots for today will NOT affect already booked appointments.'
                        ].map((text, i) => (
                            <li key={i} className="flex gap-3 items-start text-sm text-gray-500 leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0 mt-1.5"></div>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-accent-orange/10 to-transparent border border-white/5 p-8 rounded-[32px] flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent-orange/10 flex items-center justify-center text-accent-orange shadow-inner">
                        <Clock size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Next 24h Capacity</h4>
                        <p className="text-xs text-gray-500 leading-relaxed italic">
                            Your facility has <strong className="text-white">32 open seats</strong> for tomorrow. Consider broadcasting a blood-need alert if needed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalSlotManager;
