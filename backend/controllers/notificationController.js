import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';

// ─── SSE Client Registry ──────────────────────────────────────────────────────
// Maps userId (string) → Express Response object for SSE
const sseClients = new Map();

// ─── SSE Stream Endpoint ──────────────────────────────────────────────────────
// @desc    Open persistent SSE connection for real-time notifications
// @route   GET /api/notifications/stream
export const sseStream = (req, res) => {
    const userId = req.user._id.toString();

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Send initial handshake event
    res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Notification stream connected' })}\n\n`);

    // Register this client
    sseClients.set(userId, res);
    console.log(`[SSE] Client connected: ${userId} | Total: ${sseClients.size}`);

    // Heartbeat every 30s to keep connection alive
    const heartbeat = setInterval(() => {
        res.write(': heartbeat\n\n');
    }, 30000);

    // Clean up on disconnect
    req.on('close', () => {
        clearInterval(heartbeat);
        sseClients.delete(userId);
        console.log(`[SSE] Client disconnected: ${userId} | Total: ${sseClients.size}`);
    });
};

// ─── Internal Helper ──────────────────────────────────────────────────────────
// Used by other controllers to push notifications
export const createNotification = async (userId, { type, priority = 'medium', title, message, link = null, metadata = {} }) => {
    try {
        const notification = await Notification.create({
            userId, type, priority, title, message, link, metadata
        });

        // Push via SSE if user is connected
        const client = sseClients.get(userId.toString());
        if (client) {
            client.write(`event: notification\ndata: ${JSON.stringify(notification)}\n\n`);
        }

        return notification;
    } catch (err) {
        console.error('[Notification] Failed to create:', err.message);
    }
};

// ─── REST Endpoints ───────────────────────────────────────────────────────────

// @desc    Get all notifications for the logged-in user (paginated)
// @route   GET /api/notifications
export const getNotifications = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filter = req.query.filter; // 'unread' | 'blood_request' | etc.

    const query = { userId: req.user._id };
    if (filter === 'unread') query.isRead = false;
    else if (filter && filter !== 'all') query.type = filter;

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

    const notifications = await Notification
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return res.status(200).json(new ApiResponse(200, {
        notifications,
        unreadCount,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }, 'Notifications fetched'));
});

// @desc    Get unread count only
// @route   GET /api/notifications/unread-count
export const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    return res.status(200).json(new ApiResponse(200, { count }, 'Unread count fetched'));
});

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { isRead: true },
        { new: true }
    );
    if (!notification) throw new ApiError(404, 'Notification not found');
    return res.status(200).json(new ApiResponse(200, notification, 'Marked as read'));
});

// @desc    Mark ALL notifications as read
// @route   PUT /api/notifications/mark-all-read
export const markAllRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    return res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

// @desc    Delete a single notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id
    });
    if (!notification) throw new ApiError(404, 'Notification not found');
    return res.status(200).json(new ApiResponse(200, null, 'Notification deleted'));
});

// @desc    Delete all notifications for the user
// @route   DELETE /api/notifications/clear-all
export const clearAllNotifications = asyncHandler(async (req, res) => {
    await Notification.deleteMany({ userId: req.user._id });
    return res.status(200).json(new ApiResponse(200, null, 'All notifications cleared'));
});

// @desc    Seed test notifications (Dev only)
// @route   POST /api/notifications/seed-test
export const seedTestNotifications = asyncHandler(async (req, res) => {
    const seeds = [
        { type: 'blood_request', priority: 'critical', title: '🚨 Emergency Blood Request', message: 'A patient in Lahore urgently needs O- blood. Can you donate today?', metadata: { bloodGroup: 'O-', city: 'Lahore' } },
        { type: 'expiry_alert', priority: 'high', title: '⚠️ Stock Expiry Alert', message: '3 bags of A+ Platelets will expire in 2 days. Issue them immediately.', metadata: { component: 'Platelets', group: 'A+', daysLeft: 2 } },
        { type: 'donation_reminder', priority: 'medium', title: '✅ You are eligible to donate!', message: 'It has been 90 days since your last donation. Book your next appointment now.', metadata: {} },
        { type: 'appointment_update', priority: 'medium', title: '📅 Appointment Confirmed', message: 'Your donation appointment at Services Hospital on June 1st is confirmed.', metadata: { hospital: 'Services Hospital', date: '2026-06-01' } },
        { type: 'broadcast_alert', priority: 'high', title: '📢 Broadcast Match Found', message: 'Your urgent broadcast for B+ blood has found 3 matching donors nearby.', metadata: { matches: 3, bloodGroup: 'B+' } },
        { type: 'system', priority: 'low', title: '🎉 Welcome to Blood Smart Platform!', message: 'Your account is set up. Complete your donor profile to start saving lives.', metadata: {} },
    ];

    const created = await Notification.insertMany(
        seeds.map(s => ({ ...s, userId: req.user._id }))
    );

    return res.status(201).json(new ApiResponse(201, created, `${created.length} test notifications seeded`));
});
