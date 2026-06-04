import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

const MindfulnessGuide = () => {
    const [isActive, setIsActive] = useState(false);
    const [breathMode, setBreathMode] = useState('Inhale'); // Inhale, Hold, Exhale
    const [seconds, setSeconds] = useState(4);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prev) => {
                    if (prev === 1) {
                        if (breathMode === 'Inhale') {
                            setBreathMode('Hold');
                            return 4;
                        } else if (breathMode === 'Hold') {
                            setBreathMode('Exhale');
                            return 4;
                        } else {
                            setBreathMode('Inhale');
                            setCounter(c => c + 1);
                            return 4;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, breathMode]);

    const reset = () => {
        setIsActive(false);
        setBreathMode('Inhale');
        setSeconds(4);
        setCounter(0);
    };

    return (
        <div className="bg-card-bg border border-border-color p-10 rounded-[40px] space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Wind size={120} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div className="space-y-4 max-w-md">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-accent-blue/20 rounded-2xl text-accent-blue">
                            <Wind size={24} />
                        </div>
                        <h3 className="font-bold text-xl">Islamic Mindfulness</h3>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Practice 5 minutes of mindful breathing combined with "Subhan Allah" to reduce pre-transfusion anxiety and stress.
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsActive(!isActive)}
                            className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
                                isActive ? 'bg-white/5 border border-white/10 text-white' : 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                            }`}
                        >
                            {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start Session</>}
                        </button>
                        <button onClick={reset} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-gray-500 hover:text-white transition-all">
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>

                {/* Breathing Animation Circle */}
                <div className="relative flex items-center justify-center w-64 h-64 shrink-0">
                    {/* Outer animated ring */}
                    <div className={`absolute inset-0 rounded-full border-4 border-accent-blue/20 transition-all duration-[4000ms] ease-in-out ${
                        isActive && breathMode === 'Inhale' ? 'scale-110 opacity-100' : 
                        isActive && breathMode === 'Exhale' ? 'scale-90 opacity-40' : 'scale-100 opacity-60'
                    }`}></div>
                    
                    {/* Inner Content */}
                    <div className="text-center space-y-2 relative z-10 animate-in zoom-in-50 duration-500">
                        <p className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
                            breathMode === 'Inhale' ? 'text-accent-green' : 
                            breathMode === 'Hold' ? 'text-accent-orange' : 'text-accent-blue'
                        }`}>
                            {isActive ? breathMode : 'Ready?'}
                        </p>
                        <p className="text-6xl font-black text-white">{isActive ? seconds : '0'}</p>
                        <p className="text-xs font-medium text-gray-500 italic">
                            {isActive && breathMode === 'Inhale' ? 'Subhan Allah...' : 
                             isActive && breathMode === 'Hold' ? 'Peace...' : 
                             isActive && breathMode === 'Exhale' ? 'Relax...' : 'Click Start'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Session Stats */}
            <div className="flex items-center gap-8 pt-8 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Rounds</span>
                    <span className="text-2xl font-bold text-accent-blue">{counter}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Calmness</span>
                    <span className="text-2xl font-bold text-accent-green">{counter * 5}%</span>
                </div>
                <div className="ml-auto flex items-center gap-2 text-[10px] text-gray-600 italic">
                    <Sparkles size={14} className="text-accent-orange" /> Focus on the mercy of Allah.
                </div>
            </div>
        </div>
    );
};

export default MindfulnessGuide;
