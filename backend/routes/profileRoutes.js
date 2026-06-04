import express from 'express';
const router = express.Router();
import { 
    getUserProfile, 
    updateProfile, 
    updateMedicalHistory, 
    getDonorEligibility,
    getPatientData,
    addTransfusion
} from '../controllers/profileController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// Profile routes
router.get('/:id', protect, getUserProfile);
router.put('/update', protect, updateProfile);
router.put('/medical-history', protect, updateMedicalHistory);

// Donor specific
router.get('/donor/eligibility/:id', protect, getDonorEligibility);

// Patient specific
router.get('/patient/thalassemia/:id', protect, getPatientData);
router.post('/patient/transfusion', protect, authorize('Patient', 'Doctor'), addTransfusion);

export default router;
