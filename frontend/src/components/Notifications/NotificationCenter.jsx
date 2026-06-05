import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, CheckCheck, FlaskConical, Trash2 } from 'lucide-react';
import { timeAgo } from '../../utils/timeAgo';
import {
    clearAll,
    deleteOne,
    fetchNotifications,
    markAllRead,
    markOneRead,
    seedTestNotifications
} from '../../store/notificationSlice';

const typeConfig = {
    blood_request: { color: 'bg-accent-red/20 text-accent-red border-accent-red/30', code: 'BR', label: 'Blood Request' },
    expiry_alert: { color: 'bg-accent-orange/20 text-accent-orange border-accent-orange/30', code: 'EX', label: 'Expiry Alert' },
    donation_reminder: { color: 'bg-accent-green/20 text-accent-green border-accent-green/30', code: 'DN', label: 'Donation' },
    broadcast_alert: { color: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30', code: 'BC', label: 'Broadcast' },
    appointment_update: { color: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30', code: 'AP', label: 'Appointment' },
    slot_available: { color: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30', code: 'SL', label: 'Slot' },
    medical_update: { color: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30', code: 'MD', label: 'Medical' },
    profile_update: { color: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30', code: 'PF', label: 'Profile' },
    inventory_update: { color: 'bg-accent-orange/20 text-accent-orange border-accent-orange/30', code: 'IN', label: 'Inventory' },
    user_management: { color: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30', code: 'UM', label: 'User' },
    request_fulfilled: { color: 'bg-accent-green/20 text-accent-green border-accent-green/30', code: 'OK', label: 'Fulfilled' },
    system: { color: 'bg-white/10 text-gray-400 border-white/10', code: 'SY', label: 'System' },
};

const priorityConfig = {
    critical: 'border-l-4 border-l-accent-red shadow-[inset_4px_0_0_rgba(239,68,68,0.3)]',
    high: 'border-l-4 border-l-accent-orange',
    medium: '',
    low: '',
};

const filters = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'blood_request', label: 'Blood Requests' },
    { key: 'appointment_update', label: 'Appointments' },
    { key: 'medical_update', label: 'Medical' },
    { key: 'inventory_update', label: 'Inventory' },
    { key: 'broadcast_alert', label: 'Broadcasts' },
    { key: 'system', label: 'System' },
];

const NotificationCenter = () => {
    const dispatch = useDispatch();
    const { items, unreadCount, pagination, isLoading } = useSelector((state) => state.notifications);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchNotifications({ filter: activeFilter }));
    }, [activeFilter, dispatch]);

    return (
        <div className="fade-in max-w-5xl mx-auto space-y-8 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-orange/10 rounded-2xl text-accent-orange border border-accent-orange/20">
                        <Bell size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Notification Center</h1>
                        <p className="text-gray-500 text-sm">
                            {unreadCount > 0 ? (
                                <>
                                    <span className="text-accent-orange font-bold">{unreadCount} unread</span> notifications
                                </>
                            ) : (
                                'All caught up - no unread notifications'
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => dispatch(seedTestNotifications())}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-gray-400"
                    >
                        <FlaskConical size={14} /> Seed Demo Data
                    </button>
                    {unreadCount > 0 && (
                        <button
                            onClick={() => dispatch(markAllRead())}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-accent-blue/10 border border-accent-blue/20 text-accent-blue rounded-xl hover:bg-accent-blue/20 transition-all"
                        >
                            <CheckCheck size={14} /> Mark All Read
                        </button>
                    )}
                    {items.length > 0 && (
                        <button
                            onClick={() => dispatch(clearAll())}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-accent-red/10 border border-accent-red/20 text-accent-red rounded-xl hover:bg-accent-red/20 transition-all"
                        >
                            <Trash2 size={14} /> Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                {filters.map((filter) => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-all ${
                            activeFilter === filter.key
                                ? 'bg-accent-red text-white border-accent-red shadow-lg shadow-accent-red/20'
                                : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {isLoading && [...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 bg-white/3 rounded-2xl animate-pulse border border-white/5" />
                ))}

                {!isLoading && items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-sm font-black border border-white/5">
                            SY
                        </div>
                        <p className="text-gray-500">No notifications in this category.</p>
                    </div>
                )}

                {!isLoading && items.map((notif) => {
                    const cfg = typeConfig[notif.type] || typeConfig.system;
                    return (
                        <div
                            key={notif._id}
                            className={`p-5 rounded-2xl border transition-all group flex items-start gap-5 ${
                                notif.isRead
                                    ? 'bg-white/2 border-white/5'
                                    : 'bg-card-bg border-white/10 hover:border-white/20'
                            } ${priorityConfig[notif.priority] || ''}`}
                        >
                            <div className={`w-12 h-12 rounded-xl border shrink-0 text-xs font-black flex items-center justify-center ${cfg.color}`}>
                                {cfg.code}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-1">
                                    <p className={`font-bold ${notif.isRead ? 'text-gray-400' : 'text-white'}`}>
                                        {notif.title}
                                    </p>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {!notif.isRead && <div className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                                        <span className="text-[10px] text-gray-600 whitespace-nowrap">{timeAgo(notif.createdAt)}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{notif.message}</p>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.color}`}>
                                        {cfg.label}
                                    </span>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                        notif.priority === 'critical' ? 'bg-accent-red/10 text-accent-red border-accent-red/20' :
                                            notif.priority === 'high' ? 'bg-accent-orange/10 text-accent-orange border-accent-orange/20' :
                                                'bg-white/5 text-gray-500 border-white/5'
                                    }`}>
                                        {notif.priority}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notif.isRead && (
                                    <button
                                        onClick={() => dispatch(markOneRead(notif._id))}
                                        className="p-2 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue hover:bg-accent-blue/20 transition-all"
                                        title="Mark as read"
                                    >
                                        <CheckCheck size={14} />
                                    </button>
                                )}
                                <button
                                    onClick={() => dispatch(deleteOne(notif._id))}
                                    className="p-2 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red hover:bg-accent-red/20 transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {pagination.pages > 1 && (
                <p className="text-center text-xs text-gray-600">
                    Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </p>
            )}
        </div>
    );
};

export default NotificationCenter;
