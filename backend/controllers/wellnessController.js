import asyncHandler from 'express-async-handler';
import MoodLog from '../models/MoodLog.js';
import WellnessContent from '../models/WellnessContent.js';
import ForumPost from '../models/ForumPost.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';

// @desc    Get Verse of the Day based on role
// @route   GET /api/wellness/verse-of-day
export const getVerseOfDay = asyncHandler(async (req, res) => {
    const role = req.user.role;
    
    // Find content matching role or 'All'
    const content = await WellnessContent.find({ 
        targetRole: { $in: [role, 'All'] } 
    });

    if (content.length === 0) {
        // Fallback static verse if DB is empty
        return res.status(200).json(new ApiResponse(200, {
            arabic: "وإذا مرضت فهو يشفين",
            urdu: "اور جب میں بیمار ہوتا ہوں تو وہی مجھے شفا دیتا ہے۔",
            category: "Healing"
        }, 'Fallback verse fetched'));
    }

    const randomIndex = Math.floor(Math.random() * content.length);
    return res.status(200).json(new ApiResponse(200, content[randomIndex], 'Verse of the day fetched'));
});

// @desc    Submit daily mood
// @route   POST /api/wellness/mood
export const submitMood = asyncHandler(async (req, res) => {
    const { score, mood, note } = req.body;

    if (!score || !mood) {
        throw new ApiError(400, 'Score and mood are required');
    }

    const moodLog = await MoodLog.create({
        userId: req.user._id,
        score,
        mood,
        note,
        role: req.user.role
    });

    return res.status(201).json(new ApiResponse(201, moodLog, 'Mood submitted successfully'));
});

// @desc    Get mood history for a user
// @route   GET /api/wellness/mood/:userId
export const getMoodHistory = asyncHandler(async (req, res) => {
    const history = await MoodLog.find({ userId: req.params.userId })
        .sort({ date: -1 })
        .limit(30);

    return res.status(200).json(new ApiResponse(200, history, 'Mood history fetched'));
});

// @desc    Get approved forum posts
// @route   GET /api/wellness/forum/posts
export const getForumPosts = asyncHandler(async (req, res) => {
    const posts = await ForumPost.find({ isApproved: true })
        .populate('userId', 'fullName')
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, posts, 'Forum posts fetched'));
});

// @desc    Create forum post
// @route   POST /api/wellness/forum/post
export const createForumPost = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, 'Content is required');
    }

    const post = await ForumPost.create({
        userId: req.user._id,
        content
    });

    return res.status(201).json(new ApiResponse(201, post, 'Post submitted for moderation'));
});

// @desc    Seed wellness content (Dev only)
// @route   POST /api/wellness/seed
export const seedWellness = asyncHandler(async (req, res) => {
    const seedData = [
        { type: 'Verse', arabic: 'فإن مع العسر يسرا', urdu: 'پس یقیناً مشکل کے ساتھ آسانی ہے۔', category: 'Hope', targetRole: 'All' },
        { type: 'Verse', arabic: 'لا يكلف الله نفسا إلا وسعها', urdu: 'اللہ کسی جان پر اس کی طاقت سے زیادہ بوجھ نہیں ڈالتا۔', category: 'Patience', targetRole: 'Patient' },
        { type: 'Hadith', arabic: 'من نفس عن مؤمن كربة من كرب الدنيا نفس الله عنه كربة من كرب يوم القيامة', urdu: 'جس نے کسی مومن کی دنیاوی پریشانیوں میں سے کوئی پریشانی دور کی، اللہ قیامت کے دن اس کی پریشانیوں میں سے کوئی پریشانی دور کرے گا۔', category: 'Reward', targetRole: 'Donor' },
        { type: 'Dua', arabic: 'اللهم رب الناس اذهب الباس اشف انت الشافي', urdu: 'اے اللہ! لوگوں کے رب، تکلیف دور کر دے، شفا عطا فرما، تو ہی شفا دینے والا ہے۔', category: 'Healing', targetRole: 'Patient' }
    ];

    await WellnessContent.deleteMany();
    const content = await WellnessContent.insertMany(seedData);

    return res.status(201).json(new ApiResponse(201, content, 'Wellness content seeded'));
});
