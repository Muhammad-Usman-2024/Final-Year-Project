import React, { useState, useEffect } from 'react';
import { FileText, Plus, Clock, Save, Loader2 } from 'lucide-react';
import { doctorService } from '../../api/apiService';

const ClinicalNotes = ({ patientId }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // SOAP form state
    const [formData, setFormData] = useState({
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const res = await doctorService.getNotes(patientId);
            setNotes(res.data.data);
        } catch (error) {
            console.error("Error fetching notes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) fetchNotes();
    }, [patientId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await doctorService.addNote(patientId, formData);
            setFormData({ subjective: '', objective: '', assessment: '', plan: '' });
            fetchNotes();
        } catch (error) {
            console.error("Error saving note", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SOAP Form */}
            <div className="bg-card-bg border border-border-color rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent-green">
                    <Plus size={20} /> Add Clinical Note (SOAP)
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Subjective (Patient's view)</label>
                        <textarea required value={formData.subjective} onChange={e => setFormData({...formData, subjective: e.target.value})} className="input-field min-h-[80px]" placeholder="e.g. Patient complains of fatigue..."></textarea>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Objective (Observations/Labs)</label>
                        <textarea required value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} className="input-field min-h-[80px]" placeholder="e.g. Hb is 7.5 g/dL, Ferritin 2000..."></textarea>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Assessment (Diagnosis)</label>
                        <textarea required value={formData.assessment} onChange={e => setFormData({...formData, assessment: e.target.value})} className="input-field min-h-[80px]" placeholder="e.g. Beta Thalassemia Major, iron overload..."></textarea>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Plan (Treatment)</label>
                        <textarea required value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})} className="input-field min-h-[80px]" placeholder="e.g. Transfuse 2 units PRBC, continue Deferasirox..."></textarea>
                    </div>
                    <button type="submit" disabled={saving} className="submit-btn w-full flex items-center justify-center gap-2">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Note
                    </button>
                </form>
            </div>

            {/* Timeline */}
            <div className="bg-card-bg border border-border-color rounded-3xl p-6 h-[600px] overflow-y-auto custom-scrollbar">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-400">
                    <Clock size={20} /> Previous Notes
                </h3>
                
                {loading ? (
                    <p className="text-center text-gray-500">Loading history...</p>
                ) : notes.length > 0 ? (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                        {notes.map((note) => (
                            <div key={note._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-card-bg text-gray-500 group-[.is-active]:text-accent-green group-[.is-active]:border-accent-green shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                                    <FileText size={16} />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-white/5 bg-white/5 shadow">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-sm text-accent-green">Visit Note</span>
                                        <time className="text-[10px] text-gray-500">{new Date(note.date).toLocaleDateString()}</time>
                                    </div>
                                    <div className="space-y-2 text-xs text-gray-400">
                                        <p><strong className="text-white">S:</strong> {note.subjective}</p>
                                        <p><strong className="text-white">O:</strong> {note.objective}</p>
                                        <p><strong className="text-white">A:</strong> {note.assessment}</p>
                                        <p><strong className="text-white">P:</strong> {note.plan}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No clinical notes found for this patient.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClinicalNotes;
