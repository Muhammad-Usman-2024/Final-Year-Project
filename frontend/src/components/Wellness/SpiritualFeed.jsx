import React, { useState, useEffect } from 'react';
import { Book, Quote, Heart, Send, Sparkles } from 'lucide-react';
import { wellnessService } from '../../api/apiService';

const SpiritualFeed = () => {
    const [verse, setVerse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVerse = async () => {
            try {
                const res = await wellnessService.getVerse();
                setVerse(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVerse();
    }, []);

    if (loading) return <div className="h-64 bg-white/5 rounded-[32px] animate-pulse"></div>;

    return (
        <div className="space-y-8">
            {/* Verse Card */}
            <div className="bg-card-bg border border-border-color p-10 rounded-[40px] relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-blue/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-accent-green/20 rounded-2xl text-accent-green">
                            <Book size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">Verse of the Day</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Personalized for you</p>
                        </div>
                    </div>
                    <span className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {verse?.category || 'General'}
                    </span>
                </div>

                <div className="space-y-10 text-center relative z-10">
                    <p className="text-3xl md:text-4xl font-arabic leading-loose text-white tracking-wide">
                        {verse?.arabic || "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ"}
                    </p>
                    
                    <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto"></div>

                    <p className="text-lg md:text-xl text-gray-300 font-urdu leading-relaxed max-w-2xl mx-auto italic">
                        "{verse?.urdu || 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔'}"
                    </p>
                </div>

                <div className="flex justify-between items-center mt-12 border-t border-white/5 pt-8 relative z-10">
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-accent-green transition-colors">
                        <Heart size={16} /> Save to Favorites
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-accent-blue transition-colors">
                        <Send size={16} /> Share Wisdom
                    </button>
                </div>
            </div>

            {/* Motivational Banner */}
            <div className="bg-gradient-to-br from-accent-blue/10 to-accent-green/10 border border-white/5 p-8 rounded-[32px] flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-accent-blue shadow-inner">
                    <Quote size={28} />
                </div>
                <div>
                    <h4 className="font-bold text-lg italic text-white/90">"The best of people are those that are most useful to people."</h4>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">— Prophet Muhammad (PBUH)</p>
                </div>
            </div>
        </div>
    );
};

export default SpiritualFeed;
