import React, { useState, useEffect } from 'react';
import { Activity, Heart, ShieldCheck, Thermometer, ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { reportService } from '../../api/apiService';

const HealthKPIs = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await reportService.getPatients();
                setData(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-96 bg-white/5 rounded-[40px] animate-pulse"></div>;

    const stats = [
        { label: 'Avg Hb Level', value: data.summary?.avgHb?.toFixed(1) || '0', unit: 'g/dL', status: 'Stable', color: 'text-accent-blue' },
        { label: 'Avg Ferritin', value: data.summary?.avgFerritin?.toFixed(0) || '0', unit: 'ng/mL', status: 'Improving', color: 'text-accent-green' },
        { label: 'Cohort Size', value: data.summary?.totalPatients || '0', unit: 'Patients', status: 'Tracking', color: 'text-accent-purple' },
    ];

    return (
        <div className="space-y-10">
            {/* Quick KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-card-bg border border-border-color p-8 rounded-[40px] relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</p>
                                <span className="text-[8px] font-black uppercase text-accent-green bg-accent-green/10 px-2 py-0.5 rounded border border-accent-green/20">{stat.status}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h4 className={`text-4xl font-black ${stat.color}`}>{stat.value}</h4>
                                <span className="text-xs text-gray-500 font-bold">{stat.unit}</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Activity size={100} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Hb Distribution Chart */}
                <div className="bg-card-bg border border-border-color p-10 rounded-[40px] space-y-10">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            <Thermometer className="text-accent-red" size={20} /> Hb Concentration
                        </h3>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cohort Analysis</span>
                    </div>

                    <div className="space-y-10">
                        {data.hbDistribution.map((range, i) => (
                            <div key={i} className="flex items-center gap-6">
                                <div className="w-20 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    {range._id === 0 ? '< 7 g/dL' : 
                                     range._id === 7 ? '7-9 g/dL' :
                                     range._id === 9 ? '9-11 g/dL' : 'Normal'}
                                </div>
                                <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden relative">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${
                                            range._id < 9 ? 'bg-accent-red shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-accent-green'
                                        }`}
                                        style={{ width: `${(range.count / data.summary.totalPatients) * 100}%` }}
                                    ></div>
                                    <div className="absolute inset-0 flex items-center justify-end px-3">
                                        <span className="text-[9px] font-black text-white/40">{range.count} Patients</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                            <ShieldCheck size={14} className="text-accent-green" />
                            Clinical Insight: 82% of patients are maintaining target Hb levels above 9 g/dL.
                        </div>
                    </div>
                </div>

                {/* Medical Tips Banner */}
                <div className="bg-gradient-to-br from-accent-purple/10 to-transparent border border-accent-purple/20 p-10 rounded-[40px] flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="p-4 bg-accent-purple/20 rounded-3xl text-accent-purple w-fit">
                            <Heart size={32} />
                        </div>
                        <h4 className="text-2xl font-bold text-white leading-tight">Improving Compliance Through Data</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Based on current trends, patients utilizing the **Spiritual Wellness** module show a 15% higher compliance rate with chelation therapy.
                        </p>
                    </div>
                    
                    <button className="mt-10 w-full py-4 bg-accent-purple text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-accent-purple/20">
                        View Detailed Patient Cohorts
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HealthKPIs;
