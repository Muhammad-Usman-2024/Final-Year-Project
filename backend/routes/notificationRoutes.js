import express from 'express';
const router = express.Router();
import {
    sseStream,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllRead,
    deleteNotification,
    clearAllNotifications,
    seedTestNotifications
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

// SSE real-time stream — must be first
router.get('/stream', protect, sseStream);

// REST API
router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/mark-all-read', protect, markAllRead);
router.put('/:id/read', protect, markAsRead);
router.delete('/clear-all', protect, clearAllNotifications);
router.delete('/:id', protect, deleteNotification);

// Dev seed route
router.post('/seed-test', protect, seedTestNotifications);

export default router;
