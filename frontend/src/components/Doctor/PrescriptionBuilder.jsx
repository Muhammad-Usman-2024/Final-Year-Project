import React, { useState, useEffect } from 'react';
import { Pill, Plus, Trash2, Printer, Save, Loader2 } from 'lucide-react';
import { doctorService } from '../../api/apiService';

const PrescriptionBuilder = ({ patientId }) => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        pmdcNumber: 'PMDC-12345-A', // Mock default
        instructions: '',
        drugs: [{ name: '', dose: '', frequency: '', duration: '' }]
    });

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            const res = await doctorService.getPrescriptions(patientId);
            setPrescriptions(res.data.data);
        } catch (error) {
            console.error("Error fetching prescriptions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) fetchPrescriptions();
    }, [patientId]);

    const handleAddDrug = () => {
        setFormData({
            ...formData,
            drugs: [...formData.drugs, { name: '', dose: '', frequency: '', duration: '' }]
        });
    };

    const handleRemoveDrug = (index) => {
        const newDrugs = formData.drugs.filter((_, i) => i !== index);
        setFormData({ ...formData, drugs: newDrugs });
    };

    const handleDrugChange = (index, field, value) => {
        const newDrugs = [...formData.drugs];
        newDrugs[index][field] = value;
        setFormData({ ...formData, drugs: newDrugs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await doctorService.issuePrescription(patientId, formData);
            setFormData({
                pmdcNumber: 'PMDC-12345-A',
                instructions: '',
                drugs: [{ name: '', dose: '', frequency: '', duration: '' }]
            });
            fetchPrescriptions();
        } catch (error) {
            console.error("Error issuing prescription", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Builder Form */}
            <div className="bg-card-bg border border-border-color rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent-orange">
                    <Pill size={20} /> Issue Digital Prescription
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">PMDC Number</label>
                            <input type="text" required value={formData.pmdcNumber} onChange={e => setFormData({...formData, pmdcNumber: e.target.value})} className="input-field" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Medications</label>
                            <button type="button" onClick={handleAddDrug} className="text-xs flex items-center gap-1 text-accent-blue hover:text-accent-blue/80 font-bold">
                                <Plus size={14} /> Add Drug
                            </button>
                        </div>
                        
                        {formData.drugs.map((drug, index) => (
                            <div key={index} className="p-4 bg-secondary-bg rounded-xl border border-white/5 space-y-3 relative group">
                                {formData.drugs.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveDrug(index)} className="absolute -top-2 -right-2 bg-accent-red text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={12} />
                                    </button>
                                )}
                                <div>
                                    <input type="text" placeholder="Drug Name (e.g. Deferasirox)" required value={drug.name} onChange={e => handleDrugChange(index, 'name', e.target.value)} className="input-field bg-primary-bg" />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="Dose (500mg)" required value={drug.dose} onChange={e => handleDrugChange(index, 'dose', e.target.value)} className="input-field bg-primary-bg text-sm" />
                                    <input type="text" placeholder="Freq (OD/BD)" required value={drug.frequency} onChange={e => handleDrugChange(index, 'frequency', e.target.value)} className="input-field bg-primary-bg text-sm" />
                                    <input type="text" placeholder="Duration (1m)" required value={drug.duration} onChange={e => handleDrugChange(index, 'duration', e.target.value)} className="input-field bg-primary-bg text-sm" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">General Instructions</label>
                        <textarea value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} className="input-field min-h-[80px]" placeholder="Dietary advice, next visit..."></textarea>
                    </div>

                    <button type="submit" disabled={saving || formData.drugs.length === 0} className="w-full py-3 bg-accent-orange text-white font-bold rounded-xl hover:bg-accent-orange/90 transition-all flex items-center justify-center gap-2">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Generate Prescription
                    </button>
                </form>
            </div>

            {/* Previous Prescriptions */}
            <div className="bg-card-bg border border-border-color rounded-3xl p-6 h-[600px] overflow-y-auto custom-scrollbar">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-400">
                    <Printer size={20} /> Prescription History
                </h3>
                
                {loading ? (
                    <p className="text-center text-gray-500">Loading history...</p>
                ) : prescriptions.length > 0 ? (
                    <div className="space-y-4">
                        {prescriptions.map((rx) => (
                            <div key={rx._id} className="p-5 border border-white/10 rounded-2xl bg-white/5 space-y-4">
                                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                    <div>
                                        <p className="text-sm font-bold text-accent-orange">Rx Note</p>
                                        <p className="text-[10px] text-gray-500">{new Date(rx.date).toLocaleDateString()}</p>
                                    </div>
                                    <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-gray-400" title="Print PDF">
                                        <Printer size={16} />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {rx.drugs.map((d, i) => (
                                        <div key={i} className="flex justify-between items-center bg-secondary-bg p-2 rounded-lg text-sm">
                                            <span className="font-bold text-white">{d.name} <span className="text-gray-500 font-normal ml-2">{d.dose}</span></span>
                                            <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md">{d.frequency} x {d.duration}</span>
                                        </div>
                                    ))}
                                </div>
                                {rx.instructions && (
                                    <div className="pt-2 text-xs text-gray-400 italic border-t border-white/5">
                                        Note: {rx.instructions}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        <Pill size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No prescriptions issued yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrescriptionBuilder;
