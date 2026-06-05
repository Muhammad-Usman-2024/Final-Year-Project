import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { notifySuperAdmin, notifyUser } from '../utils/notificationEvents.js';
import { formatPhoneNumber } from '../utils/phoneFormat.js';

// @desc    Register user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    const { fullName, email, password, phone, cnic, role, bloodGroup, pmdcLicense, hospitalName } = req.body;
    const allowedRoles = ['Donor', 'Patient', 'Hospital', 'Doctor'];
    const safeRole = allowedRoles.includes(role) ? role : 'Donor';

    const userExists = await User.findOne({ email });
    if (userExists) throw new ApiError(400, 'User already exists');

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
        fullName,
        email,
        password,
        phone: formatPhoneNumber(phone),
        cnic,
        role: safeRole,
        bloodGroup,
        pmdcLicense,
        hospitalName,
        verificationToken,
        isActive: true,
        personalInfo: {
            accountStatus: 'Verified'
        }
    });

    if (user) {
        await notifyUser(user._id, {
            type: 'system',
            priority: 'medium',
            title: 'Welcome to BloodSync',
            message: 'Your account has been created successfully. Complete your profile to get started.',
            link: '/dashboard'
        });

        await notifySuperAdmin({
            type: 'user_management',
            priority: 'medium',
            title: 'New user registered',
            message: `${user.fullName} registered as ${user.role}.`,
            link: '/admin/users',
            metadata: { userId: user._id, role: user.role }
        });

        try {
            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
            await sendEmail({
                email: user.email,
                subject: 'Account Verification',
                html: `<h1>Verify Your Email</h1><p>Please click <a href="${verificationUrl}">here</a> to verify.</p>`
            });
        } catch (error) {
            console.error('Email sending failed:', error.message);
            // We continue even if email fails to avoid blocking the user during development
        }

        return res.status(201).json(new ApiResponse(201, { _id: user._id }, 'Registration successful. You can now login.'));
    } else {
        throw new ApiError(400, 'Invalid user data');
    }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        if (user.isActive === false && user.role !== 'SuperAdmin') {
            throw new ApiError(403, 'Your account is inactive. Please contact support.');
        }

        // Removed email verification check as per open-access requirement

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json(new ApiResponse(200, {
            user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role, isActive: user.isActive !== false },
            accessToken
        }, 'Login successful'));
    } else {
        throw new ApiError(401, 'Invalid credentials');
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });

    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh-token
export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new ApiError(401, 'Refresh token missing');

    const user = await User.findOne({ refreshToken });
    if (!user) throw new ApiError(401, 'Invalid refresh token');

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (user._id.toString() !== decoded.id) {
            throw new ApiError(401, 'Invalid refresh token');
        }
        if (user.isActive === false && user.role !== 'SuperAdmin') {
            user.refreshToken = null;
            await user.save();
            throw new ApiError(403, 'Your account is inactive. Please contact support.');
        }

        const accessToken = generateAccessToken(decoded.id);
        return res.status(200).json(new ApiResponse(200, { accessToken }, 'Token refreshed'));
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(401, 'Refresh token expired');
    }
};
