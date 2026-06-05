import React, { useEffect } from 'react';
import { Calendar, Clock, BookOpen, CheckCircle, Hospital, User, Video, Plus } from 'lucide-react';
import SlotPicker from './SlotPicker';
import AppointmentPass from './AppointmentPass';
import MyAppointments from './MyAppointments';
import HospitalSlotManager from './HospitalSlotManager';
import { useSelector } from 'react-redux';

const AppointmentHub = ({ activeSubTab, setActiveSubTab }) => {
    const { user } = useSelector(state => state.auth);
    const allowedSubTabsByRole = {
        Donor: ['book', 'my'],
        Patient: ['book', 'my'],
        Hospital: ['manage', 'my'],
        Doctor: ['manage', 'my'],
    };

    const allowedSubTabs = allowedSubTabsByRole[user?.role] || ['my'];

    useEffect(() => {
        if (!allowedSubTabs.includes(activeSubTab)) {
            setActiveSubTab(allowedSubTabs[0]);
        }
    }, [activeSubTab, allowedSubTabs, setActiveSubTab]);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 fade-in pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative">
                <div className="space-y-1">
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">Booking Intelligence</h2>
                    <p className="text-gray-500 italic">Schedule your donation, consultation, or transfusion with ease.</p>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeSubTab === 'book' && allowedSubTabs.includes('book') && <SlotPicker />}
                {activeSubTab === 'my' && allowedSubTabs.includes('my') && <MyAppointments />}
                {activeSubTab === 'manage' && allowedSubTabs.includes('manage') && <HospitalSlotManager />}
            </div>
        </div>
    );
};

export default AppointmentHub;
