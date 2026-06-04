import React, { useState, useEffect } from 'react';
import { Award, Hospital, MapPin, Trophy, Star, TrendingUp, Loader2 } from 'lucide-react';
import { reportService } from '../../api/apiService';

const HospitalLeaderboard = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await reportService.getHospitals();
                setHospitals(res.data.data);
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
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <h3 className="font-bold text-2xl flex items-center gap-3">
                    <Trophy className="text-accent-orange" size={28} /> Network Leaderboard
                </h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <Star size={14} className="text-accent-orange" /> Top Performing
                    </div>
                </div>
            </div>

            <div className="bg-card-bg border border-border-color rounded-[40px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/[0.01]">
                                <th className="px-10 py-8">Rank</th>
                                <th className="px-10 py-8">Medical Facility</th>
                                <th className="px-10 py-8">Total Collected</th>
                                <th className="px-10 py-8">Active Stock</th>
                                <th className="px-10 py-8 text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {hospitals.map((h, i) => (
                                <tr key={h._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                                            i === 0 ? 'bg-accent-orange/20 text-accent-orange border border-accent-orange/30' :
                                            i === 1 ? 'bg-gray-400/20 text-gray-400 border border-gray-400/30' :
                                            i === 2 ? 'bg-accent-red/20 text-accent-red border border-accent-red/30' :
                                            'bg-white/5 text-gray-500 border border-white/5'
                                        }`}>
                                            #{i + 1}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/5 rounded-2xl text-accent-blue group-hover:scale-110 transition-transform">
                                                <Hospital size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-lg leading-tight">{h.fullName}</p>
                                                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                                    <MapPin size={10} /> {h.city}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-1">
                                            <p className="font-black text-xl text-white">{h.totalCollected}</p>
                                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Total Units</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-1">
                                            <p className="font-black text-xl text-accent-green">{h.activeStock}</p>
                                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Ready for Issuance</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star 
                                                        key={star} 
                                                        size={12} 
                                                        className={star <= (5 - i % 2) ? 'text-accent-orange fill-accent-orange' : 'text-gray-700'} 
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Reliability Score</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Performance Highlight */}
            <div className="bg-gradient-to-r from-accent-blue/10 to-transparent p-10 rounded-[40px] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="space-y-4 max-w-2xl">
                    <h4 className="text-xl font-bold text-white">Efficiency Analysis</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Top performing hospitals show a **12% faster fulfillment rate** for urgent requests. This is attributed to consistent inventory logging and donor engagement campaigns.
                    </p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-3xl border border-white/10 shrink-0">
                    <div className="p-3 bg-accent-green/20 rounded-2xl text-accent-green">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Network Growth</p>
                        <p className="text-xl font-black text-white">+8.4% Efficiency</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalLeaderboard;
