import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import EligibilitySliders from './EligibilitySliders';
import DonationHistory from './DonationHistory';
import DonationProcess from './DonationProcess';
import { donationService } from '../../api/apiService';

const DonationDashboard = ({ activeSubTab, setActiveSubTab }) => {
  const { user } = useSelector((state) => state.auth);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!user?._id) return;
    setHistoryLoading(true);
    try {
      const res = await donationService.getHistory(user._id);
      setHistory(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch donation history', error);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
      {/* Dynamic Tab Content */}
      <div className="min-h-[600px]">
        {activeSubTab === 'register' && <AppointmentForm user={user} />}
        {activeSubTab === 'eligibility' && <EligibilitySliders />}
        {activeSubTab === 'history' && (
          historyLoading
            ? <div className="min-h-[300px] flex items-center justify-center gap-3 text-gray-500"><Loader2 className="animate-spin text-accent-red" /> Loading history...</div>
            : <DonationHistory history={history} />
        )}
        {activeSubTab === 'process' && <DonationProcess />}
      </div>
    </div>
  );
};

export default DonationDashboard;
