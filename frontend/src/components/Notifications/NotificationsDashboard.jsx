import React, { useState } from 'react';
import { Bell, Settings } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import NotificationPreferences from './NotificationPreferences';

const NotificationsDashboard = ({ activeSubTab, setActiveSubTab }) => {
    const view = activeSubTab === 'preferences' ? 'preferences' : 'center';

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="min-h-[600px]">
                {view === 'center' && <NotificationCenter />}
                {view === 'preferences' && <NotificationPreferences />}
            </div>
        </div>
    );
};

export default NotificationsDashboard;
