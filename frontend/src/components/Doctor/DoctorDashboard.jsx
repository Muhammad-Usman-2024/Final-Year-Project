import React, { useState } from 'react';
import { Stethoscope, FileText, Pill, Send, ChevronLeft } from 'lucide-react';
import PatientList from './PatientList';
import ClinicalNotes from './ClinicalNotes';
import PrescriptionBuilder from './PrescriptionBuilder';
import Referrals from './Referrals';
import RiskBadge from './RiskBadge';


const DoctorDashboard = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('notes'); // notes, rx, referrals

    const renderPatientView = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Patient Header */}
            <div className="bg-card-bg border border-border-color rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedPatient(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="w-14 h-14 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold text-xl shrink-0">
                        {selectedPatient.fullName.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold">{selectedPatient.fullName}</h2>
                            <RiskBadge patientId={selectedPatient._id} />
                        </div>
                        <p className="text-sm text-gray-500">{selectedPatient.email} • Blood: {selectedPatient.bloodGroup || 'N/A'}</p>
                    </div>

                </div>
                
                {/* Clinical Tabs */}
                <div className="flex bg-secondary-bg p-1 rounded-xl border border-white/5 shrink-0 self-stretch md:self-auto overflow-x-auto">
                    <button onClick={() => setActiveTab('notes')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'notes' ? 'bg-accent-green text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                        <FileText size={16} /> SOAP Notes
                    </button>
                    <button onClick={() => setActiveTab('rx')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'rx' ? 'bg-accent-orange text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                        <Pill size={16} /> Prescriptions
                    </button>
                    <button onClick={() => setActiveTab('referrals')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'referrals' ? 'bg-accent-purple text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                        <Send size={16} /> Referrals
                    </button>
                </div>
            </div>

            {/* Active Content */}
            <div className="min-h-[500px]">
                {activeTab === 'notes' && <ClinicalNotes patientId={selectedPatient._id} />}
                {activeTab === 'rx' && <PrescriptionBuilder patientId={selectedPatient._id} />}
                {activeTab === 'referrals' && <Referrals patientId={selectedPatient._id} />}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 fade-in">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-accent-blue/10 rounded-2xl text-accent-blue border border-accent-blue/20">
                    <Stethoscope size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Doctor Panel</h1>
                    <p className="text-gray-500 text-sm">Clinical management and patient records.</p>
                </div>
            </div>

            {selectedPatient ? renderPatientView() : <PatientList onSelectPatient={(p) => { setSelectedPatient(p); setActiveTab('notes'); }} />}
        </div>
    );
};

export default DoctorDashboard;
