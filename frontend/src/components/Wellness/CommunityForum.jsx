import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Send, User, ShieldCheck, Plus } from 'lucide-react';
import { wellnessService } from '../../api/apiService';
import toast from 'react-hot-toast';

const CommunityForum = () => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await wellnessService.getForumPosts();
            setPosts(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setSubmitting(true);
        try {
            await wellnessService.createPost({ content });
            setContent('');
            toast.success('JazakAllah! Your story has been submitted for moderation and will appear soon.');
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Post Input */}
            <form onSubmit={handleSubmit} className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-accent-blue/10 rounded-xl text-accent-blue">
                        <MessageSquare size={20} />
                    </div>
                    <h3 className="font-bold text-lg">Share Your Journey</h3>
                </div>
                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share a story of hope, a successful treatment, or words of encouragement..."
                    className="input-field min-h-[120px] bg-secondary-bg border-white/5 focus:border-accent-blue/50"
                ></textarea>
                <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck size={12} className="text-accent-green" /> Admin Moderated
                    </p>
                    <button 
                        disabled={submitting || !content.trim()}
                        className="px-8 py-3 bg-accent-blue text-white font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : <><Send size={18} /> Post Story</>}
                    </button>
                </div>
            </form>

            {/* Posts Feed */}
            <div className="space-y-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Community Stories</h4>
                
                {loading ? (
                    <div className="space-y-6">
                        {[1, 2].map(i => <div key={i} className="h-40 bg-white/5 rounded-[32px] animate-pulse"></div>)}
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="bg-card-bg border border-border-color p-8 rounded-[32px] space-y-4 hover:border-white/20 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 border border-white/10">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{post.userId?.fullName || 'Anonymous User'}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-accent-green/10 text-accent-green text-[9px] font-black rounded-lg border border-accent-green/20 uppercase tracking-widest">
                                    Approved
                                </span>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </p>

                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-accent-blue transition-colors">
                                    <ThumbsUp size={16} /> {post.likes?.length || 0} Likes
                                </button>
                                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                                    <MessageSquare size={16} /> Reply
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-600">
                        No stories shared yet. Be the first to inspire others!
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityForum;
