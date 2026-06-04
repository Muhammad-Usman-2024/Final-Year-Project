import React, { useState, useEffect } from 'react';
import { Users, Filter, Search, Activity, Droplet } from 'lucide-react';
import { doctorService } from '../../api/apiService';

const PatientList = ({ onSelectPatient }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                // In a real app we'd fetch from doctorService.getPatients()
                // using mock data for robust UI demonstration as required by the prompt
                const res = await doctorService.getPatients();
                // We'll mock a few to ensure the UI looks good if the DB is empty
                const mockPatients = [
                    { _id: '1', fullName: 'Ali Khan', email: 'ali@example.com', bloodGroup: 'O+', profile: { treatmentPlan: { targetFerritin: 1000, targetHb: 10 } } },
                    { _id: '2', fullName: 'Sara Ahmed', email: 'sara@example.com', bloodGroup: 'B-', profile: {} },
                ];
                setPatients(res.data?.data?.length > 0 ? res.data.data : mockPatients);
            } catch (error) {
                console.error("Error fetching patients", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p => p.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-card-bg border border-border-color rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Users className="text-accent-blue" /> My Patients
                </h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search patient..." 
                        className="pl-9 pr-4 py-2 bg-secondary-bg rounded-xl border border-white/5 text-sm w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-3">
                {loading ? (
                    <p className="text-gray-500 text-sm">Loading patients...</p>
                ) : filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                        <div key={patient._id} 
                            onClick={() => onSelectPatient(patient)}
                            className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent-blue/40 cursor-pointer transition-all flex justify-between items-center group">
                            
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold text-lg">
                                    {patient.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-md group-hover:text-accent-blue transition-colors">{patient.fullName}</h4>
                                    <p className="text-xs text-gray-500 flex items-center gap-2">
                                        <Droplet size={12} className="text-accent-red" /> {patient.bloodGroup || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-6 text-right">
                                <div className="hidden md:block">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Target Ferritin</p>
                                    <p className="text-sm font-bold">{patient.profile?.treatmentPlan?.targetFerritin || 'N/A'}</p>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Target Hb</p>
                                    <p className="text-sm font-bold">{patient.profile?.treatmentPlan?.targetHb || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No patients found.</p>
                )}
            </div>
        </div>
    );
};

export default PatientList;
