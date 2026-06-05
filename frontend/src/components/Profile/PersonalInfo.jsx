import React from 'react';
import { Activity, Calendar, ClipboardList, Mail, MapPin, Phone, ShieldCheck, User } from 'lucide-react';
import { formatPhoneNumber } from '../../utils/phoneFormat';

const DetailRow = ({ icon, label, value, valueClass = 'text-white' }) => (
  <div className="flex justify-between items-center text-sm gap-6">
    <span className="text-gray-500 flex items-center gap-2">{icon} {label}</span>
    <span className={`font-medium text-right ${valueClass}`}>{value}</span>
  </div>
);

const PersonalInfo = ({ data }) => {
  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
      <ClipboardList size={40} className="mb-4 opacity-20" />
      <p>Clinical data not available</p>
    </div>
  );

  const { user } = data;
  if (!user) return null;

  const isSuperAdmin = user.role === 'SuperAdmin';
  const isUserActive = user.isActive !== false;
  const statusLabel = isUserActive ? 'Active' : 'Inactive';
  const statusBadgeClass = isUserActive
    ? 'bg-accent-green/20 text-accent-green border-accent-green/30'
    : 'bg-accent-red/20 text-accent-red border-accent-red/30';
  const statusTextClass = isUserActive ? 'text-accent-green font-bold' : 'text-accent-red font-bold';

  return (
    <div className="fade-in space-y-8">
      <div className="bg-card-bg border border-border-color p-6 rounded-[20px] shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-blue/40 to-accent-purple/40 flex items-center justify-center text-3xl font-bold border-2 border-white/10">
            {user.fullName.split(' ').map(n => n[0]).join('')}
          </div>

          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {formatPhoneNumber(user.phone)}</span>
            </div>

            <div className="flex justify-center md:justify-start gap-3 mt-4">
              {!isSuperAdmin && (
                <span className="px-3 py-1 bg-accent-red/20 text-accent-red rounded-full text-xs font-bold border border-accent-red/30">
                  Blood {user.bloodGroup || 'N/A'}
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${statusBadgeClass}`}>
                <ShieldCheck size={12} /> {statusLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 mt-8 pt-8 border-t border-white/5">
          {!isSuperAdmin && (
            <>
              <DetailRow icon={<ClipboardList size={16} />} label="CNIC" value={user.cnic} valueClass="font-mono text-white" />
              <DetailRow
                icon={<Calendar size={16} />}
                label="Date of birth"
                value={user.personalInfo?.dob ? new Date(user.personalInfo.dob).toLocaleDateString() : '14 March 1998 (27 yrs)'}
              />
              <DetailRow icon={<Activity size={16} />} label="Gender" value={user.personalInfo?.gender || 'Male'} />
              <DetailRow icon={<MapPin size={16} />} label="City" value={user.personalInfo?.city || 'Lahore, Punjab'} />
            </>
          )}

          <DetailRow icon={<User size={16} />} label="Role" value={user.role} valueClass="text-accent-blue font-bold" />
          <DetailRow icon={<ShieldCheck size={16} />} label="Account status" value={statusLabel} valueClass={statusTextClass} />
        </div>
      </div>

      {!isSuperAdmin && (
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
      )}
    </div>
  );
};

export default PersonalInfo;
