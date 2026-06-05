import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import DonorProfile from '../models/DonorProfile.js';
import PatientProfile from '../models/PatientProfile.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';
import { notifySuperAdmin, notifyUser } from '../utils/notificationEvents.js';
import { formatPhoneNumber } from '../utils/phoneFormat.js';

// @desc    Get user profile
// @route   GET /api/profile/:id
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');

    // Return profile based on role
    let clinicalProfile = null;
    if (user.role === 'Donor') {
        clinicalProfile = await DonorProfile.findOne({ userId: user._id });
    } else if (user.role === 'Patient') {
        clinicalProfile = await PatientProfile.findOne({ userId: user._id });
    }

    return res.status(200).json(new ApiResponse(200, { user, clinicalProfile }, 'Profile fetched successfully'));
});

// @desc    Update user profile
// @route   PUT /api/profile/update
export const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, 'User not found');

    // Update only allowed fields
    const { fullName, phone, personalInfo } = req.body;
    user.fullName = fullName || user.fullName;
    user.phone = phone ? formatPhoneNumber(phone) : user.phone;
    user.personalInfo = { ...user.personalInfo, ...personalInfo };

    const updatedUser = await user.save();
    await notifyUser(user._id, {
        type: 'profile_update',
        priority: 'low',
        title: 'Profile updated',
        message: 'Your personal profile information was updated successfully.',
        link: '/dashboard/profile'
    });

    return res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
});

// @desc    Update medical history
// @route   PUT /api/profile/medical-history
export const updateMedicalHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, 'User not found');

    user.medicalHistory = { ...user.medicalHistory, ...req.body };
    const updatedUser = await user.save();
    await notifyUser(user._id, {
        type: 'medical_update',
        priority: 'medium',
        title: 'Medical history updated',
        message: 'Your medical history has been updated.',
        link: '/dashboard/profile'
    });

    await notifySuperAdmin({
        type: 'medical_update',
        priority: 'low',
        title: 'Medical history changed',
        message: `${user.fullName} updated medical history.`,
        link: '/admin/users',
        metadata: { userId: user._id, role: user.role }
    });

    return res.status(200).json(new ApiResponse(200, updatedUser, 'Medical history updated'));
});

// @desc    Get donor eligibility
// @route   GET /api/donor/eligibility/:id
export const getDonorEligibility = asyncHandler(async (req, res) => {
    const profile = await DonorProfile.findOne({ userId: req.params.id });
    if (!profile) throw new ApiError(404, 'Donor profile not found');

    // Simple logic: Check if 90 days have passed since last donation
    if (profile.lastDonationDate) {
        const lastDonation = new Date(profile.lastDonationDate);
        const diffDays = Math.ceil((new Date() - lastDonation) / (1000 * 60 * 60 * 24));
        profile.eligibilityStatus.isEligible = diffDays >= 90;
        if (!profile.eligibilityStatus.isEligible) {
            profile.eligibilityStatus.reason = `Only ${diffDays} days have passed. Need 90 days gap.`;
        } else {
            profile.eligibilityStatus.reason = 'Eligible to donate.';
        }
        await profile.save();
    }

    return res.status(200).json(new ApiResponse(200, profile.eligibilityStatus, 'Eligibility checked'));
});

// @desc    Get Thalassemia Clinical Data
// @route   GET /api/patient/thalassemia/:id
export const getPatientData = asyncHandler(async (req, res) => {
    const profile = await PatientProfile.findOne({ userId: req.params.id });
    if (!profile) throw new ApiError(404, 'Patient profile not found');

    return res.status(200).json(new ApiResponse(200, profile, 'Clinical data fetched'));
});

export const addTransfusion = asyncHandler(async (req, res) => {
    const profile = await PatientProfile.findOne({ userId: req.user._id });
    if (!profile) throw new ApiError(404, 'Patient profile not found');

    profile.transfusions.push(req.body);
    await profile.save();
    await notifyUser(req.user._id, {
        type: 'medical_update',
        priority: 'medium',
        title: 'Transfusion record added',
        message: 'A new transfusion record has been added to your profile.',
        link: '/dashboard/profile'
    });

    return res.status(201).json(new ApiResponse(201, profile, 'Transfusion added'));
});
