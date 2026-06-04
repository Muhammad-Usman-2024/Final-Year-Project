import express from 'express';
const router = express.Router();
import {
    getStockStatus,
    addInventory,
    requestBlood,
    fulfillRequest,
    getExpiryAlerts,
    searchCompatibleUnits
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.get('/stock', protect, getStockStatus);
router.post('/add', protect, authorize('Hospital', 'Admin'), addInventory);
router.post('/request', protect, authorize('Hospital', 'Doctor'), requestBlood);
router.put('/request/:id/fulfill', protect, authorize('Hospital', 'Admin'), fulfillRequest);
router.get('/expiry-alerts', protect, getExpiryAlerts);
router.post('/compatibility-search', protect, searchCompatibleUnits);

export default router;
