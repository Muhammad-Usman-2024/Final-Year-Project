import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, ShieldCheck, History, ListChecks } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import EligibilitySliders from './EligibilitySliders';
import DonationHistory from './DonationHistory';
import DonationProcess from './DonationProcess';

const DonationDashboard = ({ activeSubTab, setActiveSubTab }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
      {/* Dynamic Tab Content */}
      <div className="min-h-[600px]">
        {activeSubTab === 'register' && <AppointmentForm user={user} />}
        {activeSubTab === 'eligibility' && <EligibilitySliders />}
        {activeSubTab === 'history' && <DonationHistory history={[]} />}
        {activeSubTab === 'process' && <DonationProcess />}
      </div>
    </div>
  );
};

export default DonationDashboard;
