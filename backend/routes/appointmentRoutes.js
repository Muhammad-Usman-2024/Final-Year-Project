import express from 'express';
const router = express.Router();
import {
    getAvailableSlots,
    bookAppointment,
    cancelAppointment,
    manageSlots,
    getMyAppointments
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/my', getMyAppointments);
router.get('/slots/:hospitalId', getAvailableSlots);
router.post('/book', bookAppointment);
router.put('/:id/cancel', cancelAppointment);

// Hospital only management
router.post('/slots/manage', authorize('Hospital', 'SuperAdmin'), manageSlots);

export default router;
