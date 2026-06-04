import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, BellRing } from 'lucide-react';
import { toggleDrawer, pushNotification, fetchUnreadCount } from '../../store/notificationSlice';


const NotificationBell = () => {
    const dispatch = useDispatch();
    const { unreadCount } = useSelector((state) => state.notifications);
    const { user } = useSelector((state) => state.auth);
    const sseRef = useRef(null);

    // Open SSE connection when user is logged in
    useEffect(() => {
        if (!user) return;

        // Fetch initial unread count
        dispatch(fetchUnreadCount());

        // Establish SSE connection
        const eventSource = new EventSource(
            `${import.meta.env.VITE_API_URL}/notifications/stream?token=${user.accessToken}`,
            { withCredentials: true }
        );

        eventSource.addEventListener('connected', (e) => {
            console.log('[SSE] Connected:', JSON.parse(e.data));
        });

        eventSource.addEventListener('notification', (e) => {
            const notification = JSON.parse(e.data);
            dispatch(pushNotification(notification));

            // Browser notification (if permission granted)
            if (Notification.permission === 'granted') {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: '/favicon.ico'
                });
            }
        });

        eventSource.onerror = () => {
            console.warn('[SSE] Connection error — will auto-reconnect.');
        };

        sseRef.current = eventSource;

        // Request browser notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            eventSource.close();
        };
    }, [user, dispatch]);

    return (
        <button
            onClick={() => dispatch(toggleDrawer())}
            className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
            title="Notifications"
        >
            {unreadCount > 0
                ? <BellRing size={20} className="text-accent-orange animate-[swing_1s_ease-in-out_infinite]" />
                : <Bell size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            }

            {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center bg-accent-red text-white text-[9px] font-black rounded-full shadow-lg shadow-accent-red/40 animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </button>
    );
};

export default NotificationBell;
