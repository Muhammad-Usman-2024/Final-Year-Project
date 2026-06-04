import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, CheckCheck, Trash2, ExternalLink, Bell } from 'lucide-react';
import { closeDrawer, fetchNotifications, markOneRead, markAllRead } from '../../store/notificationSlice';
import { timeAgo } from '../../utils/timeAgo';

const typeConfig = {
    blood_request:     { color: 'bg-accent-red/20 text-accent-red border-accent-red/30',      icon: '🩸', label: 'Blood Request' },
    expiry_alert:      { color: 'bg-accent-orange/20 text-accent-orange border-accent-orange/30', icon: '⚠️', label: 'Expiry Alert' },
    donation_reminder: { color: 'bg-accent-green/20 text-accent-green border-accent-green/30',   icon: '✅', label: 'Reminder' },
    broadcast_alert:   { color: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30', icon: '📢', label: 'Broadcast' },
    appointment_update:{ color: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',     icon: '📅', label: 'Appointment' },
    request_fulfilled: { color: 'bg-accent-green/20 text-accent-green border-accent-green/30',   icon: '✔️', label: 'Fulfilled' },
    system:            { color: 'bg-white/10 text-gray-400 border-white/10',                     icon: '🔔', label: 'System' },
};

const priorityGlow = {
    critical: 'border-l-4 border-l-accent-red',
    high:     'border-l-4 border-l-accent-orange',
    medium:   '',
    low:      'opacity-75',
};

const NotificationDrawer = () => {
    const dispatch = useDispatch();
    const { items, unreadCount, drawerOpen, isLoading } = useSelector((state) => state.notifications);

    useEffect(() => {
        if (drawerOpen) dispatch(fetchNotifications({ filter: 'all' }));
    }, [drawerOpen, dispatch]);

    const recentItems = items.slice(0, 8);

    return (
        <>
            {/* Backdrop */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
                    onClick={() => dispatch(closeDrawer())}
                />
            )}

            {/* Drawer Panel */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-[90] bg-primary-bg border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent-orange/10 rounded-xl text-accent-orange">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Notifications</h3>
                            <p className="text-[11px] text-gray-500">{unreadCount} unread</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={() => dispatch(markAllRead())}
                                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-accent-blue hover:text-white transition-colors px-3 py-1.5 bg-white/5 rounded-lg border border-white/5"
                            >
                                <CheckCheck size={14} /> All Read
                            </button>
                        )}
                        <button
                            onClick={() => dispatch(closeDrawer())}
                            className="p-2 hover:bg-white/10 rounded-xl text-gray-500 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Notification List */}
                <div className="flex-1 overflow-y-auto overscroll-contain space-y-1 p-3">
                    {isLoading && (
                        <div className="space-y-3 p-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-20 bg-white/3 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    )}

                    {!isLoading && recentItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl">
                                🔔
                            </div>
                            <p className="text-gray-500 text-sm">You're all caught up! No new notifications.</p>
                        </div>
                    )}

                    {recentItems.map((notif) => {
                        const cfg = typeConfig[notif.type] || typeConfig.system;
                        return (
                            <div
                                key={notif._id}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                                    notif.isRead
                                        ? 'bg-white/2 border-white/5 hover:bg-white/5'
                                        : 'bg-white/5 border-white/10 hover:bg-white/8'
                                } ${priorityGlow[notif.priority] || ''}`}
                                onClick={() => !notif.isRead && dispatch(markOneRead(notif._id))}
                            >
                                <div className="flex gap-3">
                                    <span className="text-xl shrink-0 mt-0.5">{cfg.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className={`text-sm font-bold leading-snug ${notif.isRead ? 'text-gray-400' : 'text-white'}`}>
                                                {notif.title}
                                            </p>
                                            {!notif.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-accent-blue shrink-0 mt-1.5 shadow-[0_0_6px_rgba(59,130,246,0.8)]"></div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{notif.message}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.color}`}>
                                                {cfg.label}
                                            </span>
                                            <span className="text-[10px] text-gray-600">
                                                {timeAgo(notif.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 shrink-0">
                    <button
                        onClick={() => dispatch(closeDrawer())}
                        className="w-full py-3 text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <ExternalLink size={14} /> View All Notifications
                    </button>
                </div>
            </div>
        </>
    );
};

export default NotificationDrawer;
