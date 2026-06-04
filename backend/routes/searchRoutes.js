import express from 'express';
const router = express.Router();
import {
    searchDonors,
    fetchCompatibleGroups,
    getNearbyBanks,
    broadcastRequest,
    getAllHospitals
} from '../controllers/searchController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/donors', protect, searchDonors);
router.get('/compatible/:group', protect, fetchCompatibleGroups);
router.get('/nearby-banks', protect, getNearbyBanks);
router.get('/hospitals', protect, getAllHospitals);
router.post('/broadcast', protect, broadcastRequest);

export default router;
