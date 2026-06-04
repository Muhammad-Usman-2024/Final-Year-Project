import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import DonorProfile from '../models/DonorProfile.js';
import BloodUnit from '../models/BloodUnit.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';

// Helper: Blood Compatibility Matrix
const getCompatibleGroups = (group) => {
    const matrix = {
        'A+': ['A+', 'A-', 'O+', 'O-'],
        'A-': ['A-', 'O-'],
        'B+': ['B+', 'B-', 'O+', 'O-'],
        'B-': ['B-', 'O-'],
        'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
        'AB-': ['A-', 'B-', 'AB-', 'O-'],
        'O+': ['O+', 'O-'],
        'O-': ['O-'] // Universal donor
    };
    return matrix[group] || [group];
};

// @desc    Search for compatible donors
// @route   GET /api/search/donors
export const searchDonors = asyncHandler(async (req, res) => {
    const { bloodGroup, city, radius } = req.query;
    
    if (!bloodGroup || !city) {
        throw new ApiError(400, 'Blood group and city are required');
    }

    const compatibleGroups = getCompatibleGroups(bloodGroup);

    // 1. Find Users in the city with compatible blood groups
    const potentialDonors = await User.find({
        role: 'Donor',
        bloodGroup: { $in: compatibleGroups },
        'personalInfo.city': new RegExp(city, 'i')
    }).select('-password');

    // 2. Hydrate with Eligibility Score (Score 0-100)
    const donorsWithScores = await Promise.all(potentialDonors.map(async (donor) => {
        const profile = await DonorProfile.findOne({ userId: donor._id });
        
        let score = 50; // Base score
        let isEligible = true;

        if (profile) {
            // Check eligibility (90 day gap)
            if (profile.lastDonationDate) {
                const diffDays = Math.ceil((new Date() - new Date(profile.lastDonationDate)) / (1000 * 60 * 60 * 24));
                if (diffDays < 90) {
                    isEligible = false;
                    score -= 40;
                } else {
                    score += 20; // Extra points for experienced, eligible donors
                }
            }
            score += Math.min(profile.totalDonations * 2, 20); // Extra points for loyalty
        }

        return {
            donor,
            profile,
            matchScore: score,
            isEligible
        };
    }));

    // Sort by Match Score
    donorsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json(new ApiResponse(200, donorsWithScores, 'Donors found successfully'));
});

// @desc    Get compatible groups for a blood type
// @route   GET /api/search/compatible/:group
export const fetchCompatibleGroups = asyncHandler(async (req, res) => {
    const groups = getCompatibleGroups(req.params.group.toUpperCase());
    return res.status(200).json(new ApiResponse(200, groups, 'Compatibility list fetched'));
});

// @desc    Check nearby blood bank stock
// @route   GET /api/search/nearby-banks
export const getNearbyBanks = asyncHandler(async (req, res) => {
    const { bloodGroup, city } = req.query;
    const compatibleGroups = getCompatibleGroups(bloodGroup);

    const stock = await BloodUnit.aggregate([
        { $match: { group: { $in: compatibleGroups }, status: 'Available' } },
        { $group: {
            _id: { group: '$group', hospitalId: '$hospitalId' },
            count: { $sum: '$units' }
        }}
    ]);

    return res.status(200).json(new ApiResponse(200, stock, 'Nearby hospital stock fetched'));
});

// @desc    Mock urgent broadcast
// @route   POST /api/search/broadcast
export const broadcastRequest = asyncHandler(async (req, res) => {
    // In real app, this would trigger Socket.io / Push Notifications / SMS
    return res.status(200).json(new ApiResponse(200, null, 'Urgent broadcast sent to nearby matching donors!'));
});
// @desc    Get all hospitals
// @route   GET /api/search/hospitals
export const getAllHospitals = asyncHandler(async (req, res) => {
    const hospitals = await User.find({ role: 'Hospital' }).select('-password');
    return res.status(200).json(new ApiResponse(200, hospitals, 'Hospitals fetched successfully'));
});
