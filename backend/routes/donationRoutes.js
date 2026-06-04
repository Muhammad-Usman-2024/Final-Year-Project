import express from 'express';
import asyncHandler from 'express-async-handler';
const router = express.Router();
import {
    getAvailableSlots,
    bookAppointment,
    getDonationHistory,
    updateDonationStatus
} from '../controllers/donationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.get('/available-slots', protect, asyncHandler(getAvailableSlots));
router.post('/schedule', protect, authorize('Donor'), asyncHandler(bookAppointment));
router.get('/history/:donorId', protect, asyncHandler(getDonationHistory));
router.put('/update-status/:id', protect, authorize('Hospital', 'Admin'), asyncHandler(updateDonationStatus));

export default router;
