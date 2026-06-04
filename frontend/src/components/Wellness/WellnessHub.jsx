import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Heart, Activity, Wind, Info } from 'lucide-react';
import SpiritualFeed from './SpiritualFeed';
import MoodTracker from './MoodTracker';
import CommunityForum from './CommunityForum';
import MindfulnessGuide from './MindfulnessGuide';

const WellnessHub = ({ activeSubTab, setActiveSubTab }) => {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 fade-in pb-24">
            {/* Header with Zen aesthetic */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative">
                <div className="space-y-1">
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-accent-green to-accent-blue bg-clip-text text-transparent">Spiritual Wellness</h2>
                    <p className="text-gray-500 italic">Peace comes from within. Do not seek it without.</p>
                </div>
                
                {/* Decorative blur */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent-green/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left/Main Column */}
                <div className="lg:col-span-2 space-y-10">
                    {activeSubTab === 'feed' ? (
                        <>
                            <SpiritualFeed />
                            <MindfulnessGuide />
                        </>
                    ) : (
                        <CommunityForum />
                    )}
                </div>

                {/* Right Sidebar - Emotional Tracking */}
                <div className="space-y-8">
                    <MoodTracker />
                    
                    {/* Daily Tip */}
                    <div className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-4 relative overflow-hidden group">
                        <div className="p-3 bg-accent-orange/10 rounded-2xl text-accent-orange w-fit">
                            <Info size={24} />
                        </div>
                        <h4 className="font-bold text-lg">Wellness Tip</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Gratitude (Shukr) reduces stress by 23%. Try writing down 3 things you are grateful for today before bed.
                        </p>
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Sparkles size={48} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WellnessHub;
