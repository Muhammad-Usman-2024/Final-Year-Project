import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import BroadcastMessage from '../models/BroadcastMessage.js';
import PatientProfile from '../models/PatientProfile.js';
import BloodUnit from '../models/BloodUnit.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';

// @desc    Get system overview stats
// @route   GET /api/admin/overview
export const getAdminOverview = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'Donor' });
    const totalPatients = await User.countDocuments({ role: 'Patient' });
    const totalHospitals = await User.countDocuments({ role: 'Hospital' });

    // Blood group distribution
    const bloodGroupStats = await User.aggregate([
        { $match: { bloodGroup: { $exists: true, $ne: '' } } },
        { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
    ]);

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegs = await User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return res.status(200).json(new ApiResponse(200, {
        kpis: { totalUsers, totalDonors, totalPatients, totalHospitals },
        bloodGroups: bloodGroupStats,
        registrationTrend: recentRegs
    }, 'Overview stats fetched'));
});

// @desc    Get all users with filters
// @route   GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
    const { role, status, search } = req.query;
    let query = {};

    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.isActive = status === 'active';
    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, users, 'Users fetched'));
});

// @desc    Update user role
// @route   PUT /api/admin/user/:id/role
export const updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) throw new ApiError(404, 'User not found');

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Audit log
    await AuditLog.create({
        userId: req.user._id,
        action: 'ROLE_CHANGE',
        resource: `User: ${user.email}`,
        details: `Changed role from ${oldRole} to ${role}`
    });

    return res.status(200).json(new ApiResponse(200, user, 'Role updated successfully'));
});

// @desc    Toggle user status
// @route   PUT /api/admin/user/:id/status
export const toggleUserStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');

    user.isActive = !user.isActive;
    await user.save();

    await AuditLog.create({
        userId: req.user._id,
        action: 'STATUS_TOGGLE',
        resource: `User: ${user.email}`,
        details: `Status changed to ${user.isActive ? 'Active' : 'Inactive'}`
    });

    return res.status(200).json(new ApiResponse(200, user, 'User status toggled'));
});

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
export const getAuditLogs = asyncHandler(async (req, res) => {
    const logs = await AuditLog.find()
        .populate('userId', 'fullName email')
        .sort({ createdAt: -1 })
        .limit(100);
    return res.status(200).json(new ApiResponse(200, logs, 'Audit logs fetched'));
});

// @desc    Send broadcast notification
// @route   POST /api/admin/broadcast
export const sendBroadcast = asyncHandler(async (req, res) => {
    const { title, body, targetRoles } = req.body;

    if (!title || !body || !targetRoles) {
        throw new ApiError(400, 'Title, body, and target roles are required');
    }

    // In a real app, this would trigger Push/Email/SMS jobs
    // For now, we save it and it will be visible in a broadcast feed or sent via our Notification engine
    const broadcast = await BroadcastMessage.create({
        title,
        body,
        targetRoles,
        sentBy: req.user._id
    });

    // Audit log
    await AuditLog.create({
        userId: req.user._id,
        action: 'BROADCAST_SENT',
        resource: 'Broadcast System',
        details: `Sent "${title}" to ${targetRoles.join(', ')}`
    });

    return res.status(201).json(new ApiResponse(201, broadcast, 'Broadcast sent successfully'));
});
