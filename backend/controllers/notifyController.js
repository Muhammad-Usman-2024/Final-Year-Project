import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import NotifPreference from '../models/NotifPreference.js';
import ScheduledAlert from '../models/ScheduledAlert.js';
import Notification from '../models/Notification.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';
import { dispatchNotification, isQuietHours } from '../utils/notificationDispatcher.js';

// @desc    Update user notification preferences
// @route   PUT /api/notify/preferences/:userId
export const updatePreferences = asyncHandler(async (req, res) => {
    const { channels, quietHours, categories } = req.body;
    
    let prefs = await NotifPreference.findOne({ userId: req.params.userId });
    
    if (!prefs) {
        prefs = await NotifPreference.create({
            userId: req.params.userId,
            channels,
            quietHours,
            categories
        });
    } else {
        prefs.channels = channels || prefs.channels;
        prefs.quietHours = quietHours || prefs.quietHours;
        prefs.categories = categories || prefs.categories;
        await prefs.save();
    }

    return res.status(200).json(new ApiResponse(200, prefs, 'Preferences updated successfully'));
});

// @desc    Schedule a future alert
// @route   POST /api/notify/schedule
export const scheduleAlert = asyncHandler(async (req, res) => {
    const { triggerAt, targetUsers, template, payload, type } = req.body;

    if (!triggerAt || !targetUsers || !type) {
        throw new ApiError(400, 'Trigger date, users, and type are required');
    }

    const alert = await ScheduledAlert.create({
        triggerAt,
        targetUsers,
        template,
        payload,
        type
    });

    return res.status(201).json(new ApiResponse(201, alert, 'Alert scheduled successfully'));
});

// @desc    Broadcast urgent blood request with radius logic
// @route   POST /api/notify/broadcast-urgent
export const broadcastUrgentRadius = asyncHandler(async (req, res) => {
    const { bloodGroup, city, radius, hospitalName } = req.body;

    // In a real geo-app, we'd use $near or $geoWithin. 
    // Here we'll filter by city as a primary radius proxy.
    const potentialDonors = await User.find({
        role: 'Donor',
        bloodGroup: bloodGroup,
        city: city, // Proxy for radius
        isActive: true
    });

    const title = `🚨 URGENT: ${bloodGroup} Needed at ${hospitalName}`;
    const body = `A patient at ${hospitalName} needs ${bloodGroup} blood immediately. Can you help?`;

    // Dispatch to all found donors
    const results = await Promise.all(potentialDonors.map(async (donor) => {
        // 1. Create in-app notification
        await Notification.create({
            userId: donor._id,
            type: 'blood_request',
            title,
            body,
            priority: 'Critical'
        });

        // 2. Dispatch cross-channel (SMS/Email)
        return dispatchNotification(donor._id, {
            title,
            body,
            email: donor.email,
            phone: donor.phone
        });
    }));

    return res.status(200).json(new ApiResponse(200, { alertedCount: potentialDonors.length }, 'Urgent broadcast dispatched'));
});

// @desc    Mark notification as accepted (e.g. for urgent requests)
// @route   PUT /api/notify/respond/:id
export const respondToNotification = asyncHandler(async (req, res) => {
    const { action } = req.body; // 'Accept' or 'Decline'
    const notif = await Notification.findById(req.params.id);

    if (!notif) throw new ApiError(404, 'Notification not found');

    notif.status = action === 'Accept' ? 'Accepted' : 'Declined';
    await notif.save();

    return res.status(200).json(new ApiResponse(200, notif, `Request ${action}ed` ));
});
