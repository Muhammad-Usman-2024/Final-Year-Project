import express from 'express';
const router = express.Router();
import {
    getDoctorPatients,
    addClinicalNote,
    getClinicalNotes,
    issuePrescription,
    getPrescriptions,
    updateTreatmentPlan,
    createReferral,
    getReferrals,
    uploadLabResult
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// All doctor routes require 'Doctor' or 'Admin' role
router.use(protect);
router.use(authorize('Doctor', 'Admin'));

router.get('/patients', getDoctorPatients);

router.route('/note/:patientId')
    .post(addClinicalNote)
    .get(getClinicalNotes);

router.route('/prescription/:patientId')
    .post(issuePrescription)
    .get(getPrescriptions);

router.put('/plan/:patientId', updateTreatmentPlan);

router.route('/referral/:patientId')
    .post(createReferral)
    .get(getReferrals);

router.post('/lab/:patientId', uploadLabResult);

export default router;
