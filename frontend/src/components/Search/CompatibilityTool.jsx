import React, { useState } from 'react';
import { Heart, Droplets, Info, CheckCircle2, XCircle } from 'lucide-react';

const CompatibilityTool = () => {
    const [recipient, setRecipient] = useState('O+');
    const [donor, setDonor] = useState('O-');

    const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const RBC_COMPATIBILITY = {
        'A+': ['A+', 'A-', 'O+', 'O-'],
        'A-': ['A-', 'O-'],
        'B+': ['B+', 'B-', 'O+', 'O-'],
        'B-': ['B-', 'O-'],
        'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        'AB-': ['A-', 'B-', 'AB-', 'O-'],
        'O+': ['O+', 'O-'],
        'O-': ['O-']
    };

    const isCompatible = RBC_COMPATIBILITY[recipient]?.includes(donor);

    return (
        <div className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-red/10 rounded-xl text-accent-red">
                    <Droplets size={20} />
                </div>
                <h3 className="font-bold">Compatibility Checker</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recipient Group</label>
                    <div className="grid grid-cols-4 gap-2">
                        {groups.map(g => (
                            <button 
                                key={g} 
                                onClick={() => setRecipient(g)}
                                className={`py-2 text-xs font-bold rounded-lg border transition-all ${recipient === g ? 'bg-accent-blue border-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Donor Group</label>
                    <div className="grid grid-cols-4 gap-2">
                        {groups.map(g => (
                            <button 
                                key={g} 
                                onClick={() => setDonor(g)}
                                className={`py-2 text-xs font-bold rounded-lg border transition-all ${donor === g ? 'bg-accent-red border-accent-red text-white shadow-lg shadow-accent-red/20' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${isCompatible ? 'bg-accent-green/10 border-accent-green/20' : 'bg-accent-red/10 border-accent-red/20'}`}>
                {isCompatible ? (
                    <>
                        <CheckCircle2 className="text-accent-green shrink-0" size={24} />
                        <div>
                            <p className="text-xs font-bold text-accent-green uppercase tracking-wider">Compatible Match</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">A {donor} donor can safely give blood to an {recipient} recipient.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <XCircle className="text-accent-red shrink-0" size={24} />
                        <div>
                            <p className="text-xs font-bold text-accent-red uppercase tracking-wider">Incompatible</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">A {donor} donor CANNOT give blood to an {recipient} recipient.</p>
                        </div>
                    </>
                )}
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <Info size={16} className="text-gray-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-500 leading-relaxed">
                    This logic follows standard ABO/Rh blood group compatibility rules for Red Blood Cells (RBC). Always perform a clinical cross-match before transfusion.
                </p>
            </div>
        </div>
    );
};

export default CompatibilityTool;
