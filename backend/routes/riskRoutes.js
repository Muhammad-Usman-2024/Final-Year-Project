import express from 'express';
import { predictPatientRisk } from '../controllers/riskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only Doctors and SuperAdmins can predict risk
router.get('/predict/:patientId', protect, authorize('Doctor', 'SuperAdmin'), predictPatientRisk);

export default router;
