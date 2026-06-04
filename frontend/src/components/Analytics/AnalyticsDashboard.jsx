import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, Home, FileText, Download, Calendar, Filter, Droplet } from 'lucide-react';
import TrendCharts from './TrendCharts';
import HealthKPIs from './HealthKPIs';
import HospitalLeaderboard from './HospitalLeaderboard';
import { useSelector } from 'react-redux';

const AnalyticsDashboard = () => {
    const { user } = useSelector(state => state.auth);
    const [activeSection, setActiveSection] = useState('trends');

    const sections = [
        { id: 'trends', label: 'Donation Trends', icon: <TrendingUp size={18} />, roles: ['Admin', 'Hospital'] },
        { id: 'health', label: 'Patient Health', icon: <Activity size={18} />, roles: ['Admin', 'Doctor'] },
        { id: 'hospitals', label: 'Hospital Perf', icon: <Home size={18} />, roles: ['Admin'] },
    ];

    const filteredSections = sections.filter(s => s.roles.includes(user.role));

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 fade-in pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative">
                <div className="space-y-1">
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-accent-blue to-accent-green bg-clip-text text-transparent">Data Intelligence</h2>
                    <p className="text-gray-500 italic">Advanced analytics for medical and operational excellence.</p>
                </div>
                
                {/* Section Nav */}
                <div className="flex bg-secondary-bg/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto w-full md:w-auto">
                    {filteredSections.map((section) => (
                        <button 
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                                activeSection === section.id 
                                    ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' 
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {section.icon} {section.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Export Panel */}
            <div className="bg-card-bg border border-border-color p-6 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <Calendar size={20} className="text-gray-500" />
                    <span className="text-sm font-bold text-gray-300">Reporting Period: <span className="text-white">Last 6 Months</span></span>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                        <Download size={14} /> PDF
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-2.5 bg-accent-green/10 border border-accent-green/20 text-accent-green rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent-green hover:text-white transition-all">
                        <FileText size={14} /> Excel
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeSection === 'trends' && <TrendCharts />}
                {activeSection === 'health' && <HealthKPIs />}
                {activeSection === 'hospitals' && <HospitalLeaderboard />}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
