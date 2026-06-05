import express from 'express';
import { getForecastingData } from '../controllers/forecastController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only SuperAdmins and Hospital managers can see forecasting
router.get('/', protect, authorize('SuperAdmin', 'Hospital'), getForecastingData);

export default router;
