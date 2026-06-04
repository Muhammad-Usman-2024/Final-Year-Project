import express from 'express';
const router = express.Router();
import {
    updatePreferences,
    scheduleAlert,
    broadcastUrgentRadius,
    respondToNotification
} from '../controllers/notifyController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.put('/preferences/:userId', updatePreferences);
router.post('/schedule', scheduleAlert);
router.post('/broadcast-urgent', broadcastUrgentRadius);
router.put('/respond/:id', respondToNotification);

export default router;
