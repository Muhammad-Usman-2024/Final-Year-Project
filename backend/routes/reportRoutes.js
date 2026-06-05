import express from 'express';
const router = express.Router();
import {
    getDonationAnalytics,
    getPatientHealthStats,
    getInventoryReports,
    getHospitalPerformance
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.use(protect);
router.use(authorize('SuperAdmin', 'Hospital', 'Doctor'));

router.get('/donations', getDonationAnalytics);
router.get('/patients', getPatientHealthStats);
router.get('/inventory', getInventoryReports);
router.get('/hospitals', getHospitalPerformance);

export default router;
