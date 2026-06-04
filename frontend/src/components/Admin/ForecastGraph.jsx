import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, AlertCircle, Calendar, Package } from 'lucide-react';
import { format } from 'date-fns';

const ForecastGraph = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/forecast`, {
                    withCredentials: true
                });
                setData(data.data);
            } catch (err) {
                console.error('Error fetching forecast:', err);
                setError('Failed to load forecasting data');
            } finally {
                setLoading(false);
            }
        };
        fetchForecast();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center bg-card-bg border border-border-color rounded-3xl animate-pulse text-gray-500">Calculating trends...</div>;
    if (error) return <div className="h-96 flex items-center justify-center bg-card-bg border border-border-color rounded-3xl text-accent-red">{error}</div>;

    // Combine historical and predictions for the chart
    const chartData = [
        ...data.historical.map(h => ({
            name: format(new Date(h.date), 'MMM dd'),
            Issued: h.issued,
            Collected: h.collected,
            type: 'Historical'
        })),
        ...data.predictions.map(p => ({
            name: format(new Date(p.date), 'MMM dd'),
            PredictedIssued: p.predictedIssued,
            PredictedCollected: p.predictedCollected,
            type: 'Predicted'
        }))
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card-bg border border-border-color rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-accent-blue/10 rounded-xl text-accent-blue">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className="font-bold">Next 7 Days Forecast</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Based on the last 30 days of data, our AI model predicts a steady {data.predictions[6]?.predictedIssued > data.predictions[0]?.predictedIssued ? 'increase' : 'decrease'} in demand.
                    </p>
                </div>

                <div className={`bg-card-bg border rounded-3xl p-6 ${data.alert.includes('HIGH') ? 'border-accent-red/30 bg-accent-red/5' : 'border-border-color'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-xl ${data.alert.includes('HIGH') ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-green/10 text-accent-green'}`}>
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="font-bold">Inventory Alert</h3>
                    </div>
                    <p className={`text-sm leading-relaxed ${data.alert.includes('HIGH') ? 'text-accent-red' : 'text-gray-400'}`}>
                        {data.alert}
                    </p>
                </div>

                <div className="bg-card-bg border border-border-color rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-accent-purple/10 rounded-xl text-accent-purple">
                            <Package size={20} />
                        </div>
                        <h3 className="font-bold">Current Stock</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data.currentInventory.map(item => (
                            <span key={item._id} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold">
                                {item._id}: {item.count}u
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-card-bg border border-border-color rounded-3xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold">Demand vs Supply Trends</h3>
                        <p className="text-gray-500 text-sm">Historical (solid) and Predicted (dashed) units</p>
                    </div>
                    <div className="flex gap-4 text-xs font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-accent-blue" /> Issued
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-accent-green" /> Collected
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#666" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                interval={3}
                            />
                            <YAxis 
                                stroke="#666" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                                itemStyle={{ fontSize: '12px' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="Issued" 
                                stroke="#3b82f6" 
                                strokeWidth={3} 
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="Collected" 
                                stroke="#22c55e" 
                                strokeWidth={3} 
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="PredictedIssued" 
                                stroke="#3b82f6" 
                                strokeWidth={2} 
                                strokeDasharray="5 5"
                                dot={false}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="PredictedCollected" 
                                stroke="#22c55e" 
                                strokeWidth={2} 
                                strokeDasharray="5 5"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ForecastGraph;
