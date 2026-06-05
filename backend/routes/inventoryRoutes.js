import express from 'express';
const router = express.Router();
import {
    getStockStatus,
    addInventory,
    requestBlood,
    getBloodRequests,
    approveRequest,
    fulfillRequest,
    getExpiryAlerts,
    searchCompatibleUnits
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.get('/stock', protect, getStockStatus);
router.post('/add', protect, authorize('Hospital', 'SuperAdmin'), addInventory);
router.post('/request', protect, authorize('Hospital', 'Doctor'), requestBlood);
router.get('/requests', protect, authorize('Hospital', 'Doctor', 'SuperAdmin'), getBloodRequests);
router.put('/request/:id/approve', protect, authorize('Hospital', 'SuperAdmin'), approveRequest);
router.put('/request/:id/fulfill', protect, authorize('Hospital', 'SuperAdmin'), fulfillRequest);
router.get('/expiry-alerts', protect, getExpiryAlerts);
router.post('/compatibility-search', protect, searchCompatibleUnits);

export default router;
