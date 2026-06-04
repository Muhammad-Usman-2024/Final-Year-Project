import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import BloodUnit from '../models/BloodUnit.js';
import PatientProfile from '../models/PatientProfile.js';
import AnalyticsSnapshot from '../models/AnalyticsSnapshot.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';

// @desc    Get Donation Trends
// @route   GET /api/reports/donations
export const getDonationAnalytics = asyncHandler(async (req, res) => {
    // Blood group breakdown across all donors
    const groupStats = await User.aggregate([
        { $match: { role: 'Donor', bloodGroup: { $exists: true, $ne: '' } } },
        { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    // Monthly registration trends (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrends = await User.aggregate([
        { $match: { role: 'Donor', createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return res.status(200).json(new ApiResponse(200, {
        groupStats,
        monthlyTrends
    }, 'Donation analytics fetched'));
});

// @desc    Get Patient Health Stats (Thalassemia KPIs)
// @route   GET /api/reports/patients
export const getPatientHealthStats = asyncHandler(async (req, res) => {
    // Average Hb Improvement and Ferritin Distribution
    const patientStats = await PatientProfile.aggregate([
        {
            $group: {
                _id: null,
                avgHb: { $avg: "$clinicalStatus.lastHbLevel" },
                avgFerritin: { $avg: "$clinicalStatus.lastFerritinLevel" },
                totalPatients: { $sum: 1 }
            }
        }
    ]);

    // Hb Level Ranges (for distribution chart)
    const hbDistribution = await PatientProfile.aggregate([
        {
            $bucket: {
                groupBy: "$clinicalStatus.lastHbLevel",
                boundaries: [0, 7, 9, 11, 15],
                default: "Other",
                output: { count: { $sum: 1 } }
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, {
        summary: patientStats[0] || {},
        hbDistribution
    }, 'Patient health stats fetched'));
});

// @desc    Get Blood Usage & Wastage Reports
// @route   GET /api/reports/inventory
export const getInventoryReports = asyncHandler(async (req, res) => {
    const totalUnits = await BloodUnit.countDocuments({ status: 'Available' });
    const expiredUnits = await BloodUnit.countDocuments({ status: 'Expired' });
    const issuedUnits = await BloodUnit.countDocuments({ status: 'Issued' });

    const wastageRate = (expiredUnits / (totalUnits + expiredUnits + issuedUnits) * 100).toFixed(1);

    // Most demanded blood groups (based on current inventory low levels)
    const demandStats = await BloodUnit.aggregate([
        { $group: { _id: '$group', available: { $sum: { $cond: [{ $eq: ["$status", "Available"] }, 1, 0] } } } },
        { $sort: { available: 1 } }
    ]);


    return res.status(200).json(new ApiResponse(200, {
        summary: { totalUnits, expiredUnits, issuedUnits, wastageRate },
        demandStats
    }, 'Inventory reports fetched'));
});

// @desc    Get Hospital Performance Leaderboard
// @route   GET /api/reports/hospitals
export const getHospitalPerformance = asyncHandler(async (req, res) => {
    const leaderboard = await User.aggregate([
        { $match: { role: 'Hospital' } },
        {
            $lookup: {
                from: 'bloodunits',
                localField: '_id',
                foreignField: 'hospitalId',
                as: 'units'
            }

        },
        {
            $project: {
                fullName: 1,
                city: 1,
                totalCollected: { $size: "$units" },
                activeStock: {
                    $size: {
                        $filter: {
                            input: "$units",
                            as: "unit",
                            cond: { $eq: ["$$unit.status", "Available"] }
                        }
                    }
                }
            }
        },
        { $sort: { totalCollected: -1 } },
        { $limit: 10 }
    ]);

    return res.status(200).json(new ApiResponse(200, leaderboard, 'Hospital performance fetched'));
});
