import React, { useState, useEffect } from 'react';
import { Users, Heart, Home, TrendingUp, Activity, ArrowUpRight, Droplet, Shield } from 'lucide-react';
import { adminService } from '../../api/apiService';

const SystemOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await adminService.getOverview();
                setStats(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="h-96 bg-white/5 rounded-[40px] animate-pulse"></div>;

    if (!stats) return (
        <div className="h-96 flex flex-col items-center justify-center bg-card-bg border border-border-color rounded-[40px] text-center p-10">
            <Shield size={48} className="text-accent-red mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">Access Restricted</h3>
            <p className="text-gray-500 max-w-md">
                You don't have permission to view system stats. Please ensure you are logged in as an Administrator.
            </p>
            <button 
                onClick={() => window.location.reload()} 
                className="mt-6 px-6 py-2 bg-accent-blue text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent-blue/80 transition-all"
            >
                Retry Connection
            </button>
        </div>
    );

    const kpis = [
        { label: 'Total Users', value: stats.kpis?.totalUsers || 0, icon: <Users />, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
        { label: 'Donors', value: stats.kpis?.totalDonors || 0, icon: <Heart />, color: 'text-accent-red', bg: 'bg-accent-red/10' },
        { label: 'Patients', value: stats.kpis?.totalPatients || 0, icon: <Activity />, color: 'text-accent-green', bg: 'bg-accent-green/10' },
        { label: 'Hospitals', value: stats.kpis?.totalHospitals || 0, icon: <Home />, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    ];

    return (
        <div className="space-y-10">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-card-bg border border-border-color p-8 rounded-[32px] group hover:border-white/20 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 ${kpi.bg} ${kpi.color} rounded-2xl`}>
                                {kpi.icon}
                            </div>
                            <span className="text-accent-green text-xs font-bold flex items-center gap-1">
                                <ArrowUpRight size={14} /> +12%
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{kpi.label}</p>
                        <h4 className="text-3xl font-black mt-1">{kpi.value}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Blood Distribution (Visual Mock) */}
                <div className="bg-card-bg border border-border-color p-10 rounded-[40px] space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            <Droplet className="text-accent-red" size={20} /> Blood Distribution
                        </h3>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Stats</span>
                    </div>
                    
                    <div className="space-y-6">
                        {stats.bloodGroups.map((group, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span>{group._id}</span>
                                    <span className="text-gray-500">{group.count} Users</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-accent-red shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all duration-1000"
                                        style={{ width: `${(group.count / stats.kpis.totalUsers) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Registration Trend (Visual Mock) */}
                <div className="bg-card-bg border border-border-color p-10 rounded-[40px] space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            <TrendingUp className="text-accent-blue" size={20} /> Registration Trend
                        </h3>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last 7 Days</span>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-4 px-4 pt-10">
                        {stats.registrationTrend.map((day, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div 
                                    className="w-full bg-accent-blue/20 group-hover:bg-accent-blue/40 rounded-t-xl transition-all duration-700 relative"
                                    style={{ height: `${(day.count / 10) * 100}%`, minHeight: '10%' }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent-blue text-white text-[10px] font-bold px-2 py-1 rounded">
                                        {day.count}
                                    </div>
                                </div>
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter mt-4 text-center -rotate-45">
                                    {day._id.split('-').slice(1).join('/')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemOverview;
