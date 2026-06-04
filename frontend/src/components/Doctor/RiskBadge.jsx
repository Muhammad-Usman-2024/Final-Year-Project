import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const RiskBadge = ({ patientId }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRisk = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/risk/predict/${patientId}`, {
                    withCredentials: true
                });
                setPrediction(data.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching risk prediction:', err);
                setError('Failed to load risk prediction');
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchRisk();
        }
    }, [patientId]);

    if (loading) return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium animate-pulse">
            <Loader2 size={14} className="animate-spin" /> Analyzing Risk...
        </div>
    );

    if (error) return null;

    const styles = {
        Red: 'bg-accent-red/10 border-accent-red/30 text-accent-red',
        Yellow: 'bg-accent-orange/10 border-accent-orange/30 text-accent-orange',
        Green: 'bg-accent-green/10 border-accent-green/30 text-accent-green'
    };

    const icons = {
        Red: <AlertCircle size={16} />,
        Yellow: <AlertTriangle size={16} />,
        Green: <CheckCircle size={16} />
    };

    return (
        <div className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all hover:scale-105 cursor-help ${styles[prediction?.status || 'Green']}`}>
            {icons[prediction?.status || 'Green']}
            <span>{prediction?.status} Risk Score: {prediction?.score}%</span>

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-card-bg border border-border-color rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                <p className="text-white text-[11px] leading-relaxed">
                    {prediction?.message}
                </p>
                <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Hb Trend</span>
                        <span>{prediction?.breakdown?.hbRisk}%</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Transfusion Delay</span>
                        <span>{prediction?.breakdown?.transfusionRisk}%</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Chelation Compliance</span>
                        <span>{prediction?.breakdown?.chelationRisk}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskBadge;
