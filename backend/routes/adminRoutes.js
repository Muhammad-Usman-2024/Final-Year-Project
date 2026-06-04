import express from 'express';
const router = express.Router();
import {
    getAdminOverview,
    getAllUsers,
    updateUserRole,
    toggleUserStatus,
    getAuditLogs,
    sendBroadcast
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// All admin routes are strictly protected
router.use(protect);
router.use(authorize('Admin'));

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.put('/user/:id/role', updateUserRole);
router.put('/user/:id/status', toggleUserStatus);
router.get('/audit-logs', getAuditLogs);
router.post('/broadcast', sendBroadcast);

export default router;
