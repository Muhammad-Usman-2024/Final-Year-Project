import React, { useState, useEffect } from 'react';
import { Activity, Smile, Meh, Frown, Heart, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { wellnessService } from '../../api/apiService';
import { useSelector } from 'react-redux';

const MOODS = [
    { label: 'Tired', icon: <Frown />, score: 1, color: 'text-accent-red' },
    { label: 'Anxious', icon: <Meh />, score: 2, color: 'text-accent-orange' },
    { label: 'Peaceful', icon: <Activity />, score: 3, color: 'text-accent-blue' },
    { label: 'Hopeful', icon: <Smile />, score: 4, color: 'text-accent-green' },
    { label: 'Blessed', icon: <Sparkles />, score: 5, color: 'text-accent-purple' },
];

const MoodTracker = () => {
    const { user } = useSelector(state => state.auth);
    const [selectedMood, setSelectedMood] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [history, setHistory] = useState([]);

    const fetchHistory = async () => {
        try {
            const res = await wellnessService.getMoodHistory(user._id);
            setHistory(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSubmit = async (mood) => {
        setLoading(true);
        setSelectedMood(mood);
        try {
            await wellnessService.submitMood({
                score: mood.score,
                mood: mood.label
            });
            setSubmitted(true);
            fetchHistory();
            setTimeout(() => setSubmitted(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl flex items-center gap-2">
                    <Heart className="text-accent-red" size={20} /> How are you feeling?
                </h3>
                {submitted && <span className="text-[10px] text-accent-green font-bold flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 size={12} /> Logged</span>}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-2">
                {MOODS.map((m) => (
                    <button
                        key={m.label}
                        onClick={() => handleSubmit(m)}
                        disabled={loading || submitted}
                        className={`flex flex-col items-center gap-2 p-2 sm:p-3 rounded-2xl border transition-all ${
                            selectedMood?.label === m.label 
                                ? `${m.color} bg-white/5 border-white/20 scale-105` 
                                : 'text-gray-500 bg-white/2 border-white/5 hover:bg-white/5'
                        }`}
                    >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                            {loading && selectedMood?.label === m.label ? <Loader2 className="animate-spin" size={20} /> : m.icon}
                        </div>
                        <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-tighter whitespace-nowrap">{m.label}</span>
                    </button>
                ))}
            </div>

            {/* Mini History Chart */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Weekly Trend</span>
                    <span className="text-accent-blue">View Full Report</span>
                </div>
                <div className="flex items-end gap-1.5 h-16 px-1">
                    {history.slice(0, 14).reverse().map((log, i) => (
                        <div 
                            key={i} 
                            className={`flex-1 rounded-full transition-all hover:opacity-80 cursor-help ${
                                log.score === 5 ? 'bg-accent-purple' :
                                log.score === 4 ? 'bg-accent-green' :
                                log.score === 3 ? 'bg-accent-blue' :
                                log.score === 2 ? 'bg-accent-orange' : 'bg-accent-red'
                            }`}
                            style={{ height: `${(log.score / 5) * 100}%` }}
                            title={`${log.mood} on ${new Date(log.date).toLocaleDateString()}`}
                        ></div>
                    ))}
                    {history.length === 0 && <div className="w-full text-[10px] text-gray-600 italic text-center">No logs yet. Start today!</div>}
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;
