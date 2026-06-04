import express from 'express';
const router = express.Router();
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/refresh-token', refreshAccessToken);

export default router;
