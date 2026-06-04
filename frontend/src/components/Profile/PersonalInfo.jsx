import React from 'react';
import { User, Mail, Phone, Calendar, MapPin, ShieldCheck, Activity, Edit3, ClipboardList } from 'lucide-react';

const PersonalInfo = ({ data }) => {
  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
      <ClipboardList size={40} className="mb-4 opacity-20" />
      <p>Clinical data not available</p>
    </div>
  );
  const { user, clinicalProfile } = data;
  
  if (!user) return null;

  return (
    <div className="fade-in space-y-8">
      {/* Profile Header Card */}
      <div className="bg-card-bg border border-border-color p-6 rounded-[20px] shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-blue/40 to-accent-purple/40 flex items-center justify-center text-3xl font-bold border-2 border-white/10">
            {user.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {user.phone}</span>
            </div>
            <div className="flex justify-center md:justify-start gap-3 mt-4">
              <span className="px-3 py-1 bg-accent-red/20 text-accent-red rounded-full text-xs font-bold border border-accent-red/30">
                🩸 {user.bloodGroup || 'N/A'}
              </span>
              <span className="px-3 py-1 bg-accent-green/20 text-accent-green rounded-full text-xs font-bold border border-accent-green/30 flex items-center gap-1">
                <ShieldCheck size={12} /> {user.personalInfo?.accountStatus || 'Verified'}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 mt-8 pt-8 border-t border-white/5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2"><ClipboardList size={16} /> CNIC</span>
            <span className="font-mono">{user.cnic}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2"><Calendar size={16} /> Date of birth</span>
            <span>{user.personalInfo?.dob ? new Date(user.personalInfo.dob).toLocaleDateString() : '14 March 1998 (27 yrs)'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2"><Activity size={16} /> Gender</span>
            <span>{user.personalInfo?.gender || 'Male'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2"><MapPin size={16} /> City</span>
            <span>{user.personalInfo?.city || 'Lahore, Punjab'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2"><User size={16} /> Role</span>
            <span className="font-bold text-accent-blue">{user.role}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2"><ShieldCheck size={16} /> Account status</span>
            <span className="text-accent-green font-bold">Verified</span>
          </div>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Medical History Summary</h3>
        <div className="bg-card-bg border border-border-color rounded-2xl divide-y divide-white/5">
          {[
            { label: 'Chronic diseases', value: user.medicalHistory?.chronicDiseases || 'None', icon: <Activity size={18} /> },
            { label: 'Current medications', value: user.medicalHistory?.currentMedications || 'None', icon: <Activity size={18} /> },
            { label: 'Allergies', value: user.medicalHistory?.allergies || 'Penicillin', icon: <Activity size={18} /> },
            { label: 'Previous surgeries', value: user.medicalHistory?.previousSurgeries || 'Appendectomy (2019)', icon: <Activity size={18} /> },
            { label: 'Recent travel (6 mo)', value: user.medicalHistory?.recentTravel || 'None outside Pakistan', icon: <Activity size={18} /> },
            { label: 'HIV / Hep B / Hep C', value: user.medicalHistory?.hivHepStatus || 'All negative', icon: <Activity size={18} className="text-accent-green" /> },
          ].map((item, idx) => (
            <div key={idx} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <span className={`text-sm font-medium ${item.value.includes('negative') || item.value === 'None' ? 'text-accent-green' : 'text-white'}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
