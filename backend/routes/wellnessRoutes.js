import express from 'express';
const router = express.Router();
import {
    getVerseOfDay,
    submitMood,
    getMoodHistory,
    getForumPosts,
    createForumPost,
    seedWellness
} from '../controllers/wellnessController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/verse-of-day', getVerseOfDay);
router.post('/mood', submitMood);
router.get('/mood/:userId', getMoodHistory);
router.get('/forum/posts', getForumPosts);
router.post('/forum/post', createForumPost);
router.post('/seed', seedWellness);

export default router;
