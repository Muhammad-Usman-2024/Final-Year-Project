import React from 'react';
import { Check, X } from 'lucide-react';

const RolesMatrix = () => {
  const permissions = [
    { action: 'Donate Blood', donor: true, patient: false, hospital: false, doctor: false },
    { action: 'Request Blood', donor: false, patient: true, hospital: true, doctor: true },
    { action: 'Manage Inventory', donor: false, patient: false, hospital: true, doctor: false },
    { action: 'Verify Medical Reports', donor: false, patient: false, hospital: false, doctor: true },
    { action: 'View Thalassemia Directory', donor: true, patient: true, hospital: true, doctor: true },
    { action: 'Access Admin Panel', donor: false, patient: false, hospital: false, doctor: false, admin: true },
  ];

  return (
    <div className="fade-in">
      <h3 className="text-xl font-bold mb-6 text-center">Roles & Permissions Matrix</h3>
      <div className="overflow-x-auto rounded-2xl border border-border-color">
        <table className="w-full text-left bg-card-bg">
          <thead className="border-b border-border-color">
            <tr>
              <th className="p-4 text-sm font-semibold">Action / Role</th>
              <th className="p-4 text-sm font-semibold text-center">Donor</th>
              <th className="p-4 text-sm font-semibold text-center">Patient</th>
              <th className="p-4 text-sm font-semibold text-center">Hospital</th>
              <th className="p-4 text-sm font-semibold text-center">Doctor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {permissions.map((p, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm text-gray-400">{p.action}</td>
                <td className="p-4 text-center">{p.donor ? <Check size={18} className="mx-auto text-accent-green" /> : <X size={18} className="mx-auto text-accent-red" />}</td>
                <td className="p-4 text-center">{p.patient ? <Check size={18} className="mx-auto text-accent-green" /> : <X size={18} className="mx-auto text-accent-red" />}</td>
                <td className="p-4 text-center">{p.hospital ? <Check size={18} className="mx-auto text-accent-green" /> : <X size={18} className="mx-auto text-accent-red" />}</td>
                <td className="p-4 text-center">{p.doctor ? <Check size={18} className="mx-auto text-accent-green" /> : <X size={18} className="mx-auto text-accent-red" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesMatrix;
