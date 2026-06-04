import React, { useState, useEffect } from 'react';
import { TrendingUp, Droplet, UserCheck, ArrowUpRight, Loader2 } from 'lucide-react';
import { reportService } from '../../api/apiService';

const TrendCharts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await reportService.getDonations();
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

    return (
        <div className="space-y-10">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-4">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Growth Forecast</p>
                    <div className="flex justify-between items-end">
                        <h4 className="text-3xl font-black text-white">+24.5%</h4>
                        <div className="px-2 py-1 bg-accent-green/10 text-accent-green text-[9px] font-black rounded-lg border border-accent-green/20">MONTHLY</div>
                    </div>
                </div>
                <div className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-4">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Donor Retention</p>
                    <div className="flex justify-between items-end">
                        <h4 className="text-3xl font-black text-white">68.2%</h4>
                        <div className="px-2 py-1 bg-accent-blue/10 text-accent-blue text-[9px] font-black rounded-lg border border-accent-blue/20">REPEAT</div>
                    </div>
                </div>
                <div className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-4">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Wastage Alert</p>
                    <div className="flex justify-between items-end">
                        <h4 className="text-3xl font-black text-white">2.4%</h4>
                        <div className="px-2 py-1 bg-accent-red/10 text-accent-red text-[9px] font-black rounded-lg border border-accent-red/20">LOW</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Donation Trend (Bar Chart) */}
                <div className="bg-card-bg border border-border-color p-10 rounded-[40px] space-y-10">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            <TrendingUp className="text-accent-blue" size={20} /> Donation Volume
                        </h3>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last 6 Months</span>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-6 px-4 pt-10">
                        {data.monthlyTrends.map((month, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div 
                                    className="w-full bg-accent-blue/20 group-hover:bg-accent-blue/40 rounded-t-2xl transition-all duration-700 relative"
                                    style={{ height: `${(month.count / Math.max(...data.monthlyTrends.map(m => m.count))) * 100}%`, minHeight: '10%' }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-accent-blue text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xl">
                                        {month.count}
                                    </div>
                                </div>
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-tighter mt-6 text-center">
                                    {month._id.split('-')[1]}/{month._id.split('-')[0].substring(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Blood Group Breakdown */}
                <div className="bg-card-bg border border-border-color p-10 rounded-[40px] space-y-10">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            <Droplet className="text-accent-red" size={20} /> Supply Breakdown
                        </h3>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Stock</span>
                    </div>

                    <div className="space-y-6">
                        {data.groupStats.map((group, i) => (
                            <div key={i} className="space-y-2 group">
                                <div className="flex justify-between text-xs font-black">
                                    <span className="text-white group-hover:text-accent-red transition-colors">{group._id}</span>
                                    <span className="text-gray-500">{group.count} Donors</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div 
                                        className="h-full bg-gradient-to-r from-accent-red to-accent-orange shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-1000 ease-out"
                                        style={{ width: `${(group.count / Math.max(...data.groupStats.map(g => g.count))) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendCharts;
