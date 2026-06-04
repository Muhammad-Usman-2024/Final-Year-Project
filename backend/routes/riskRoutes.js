import express from 'express';
import { predictPatientRisk } from '../controllers/riskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only Doctors and Admins can predict risk
router.get('/predict/:patientId', protect, authorize('Doctor', 'Admin'), predictPatientRisk);

export default router;
