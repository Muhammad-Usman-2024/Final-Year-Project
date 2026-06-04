import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, MessageSquare, ShieldCheck, Settings, Activity, TrendingUp, Search } from 'lucide-react';
import SystemOverview from './SystemOverview';
import UserManagement from './UserManagement';
import BroadcastManager from './BroadcastManager';
import AuditLogs from './AuditLogs';
import ForecastGraph from './ForecastGraph';


const AdminDashboard = ({ activeSubTab }) => {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 fade-in">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-accent-blue/10 rounded-[20px] text-accent-blue border border-accent-blue/20">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Command Center</h1>
                        <p className="text-gray-500 text-sm">Global system management and auditing.</p>
                    </div>
                </div>
            </div>

            {/* Active Component Rendering */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeSubTab === 'overview' && <SystemOverview />}
                {activeSubTab === 'users' && <UserManagement />}
                {activeSubTab === 'broadcast' && <BroadcastManager />}
                {activeSubTab === 'forecast' && <ForecastGraph />}
                {activeSubTab === 'audit' && <AuditLogs />}
            </div>
        </div>
    );
};

export default AdminDashboard;
