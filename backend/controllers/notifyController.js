import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import NotifPreference from '../models/NotifPreference.js';
import ScheduledAlert from '../models/ScheduledAlert.js';
import Notification from '../models/Notification.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';
import { dispatchNotification } from '../utils/notificationDispatcher.js';
import { notifySuperAdmin, notifyUser } from '../utils/notificationEvents.js';

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

    await notifyUser(req.params.userId, {
        type: 'system',
        priority: 'low',
        title: 'Notification preferences updated',
        message: 'Your notification delivery preferences were saved.',
        link: '/dashboard/notifications'
    });

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

    await notifySuperAdmin({
        type: 'system',
        priority: 'low',
        title: 'Alert scheduled',
        message: `${targetUsers.length} user(s) were scheduled for a ${type} alert.`,
        link: '/admin/overview',
        metadata: { alertId: alert._id, type, triggerAt }
    });

    return res.status(201).json(new ApiResponse(201, alert, 'Alert scheduled successfully'));
});

// @desc    Broadcast urgent blood request with radius logic
// @route   POST /api/notify/broadcast-urgent
export const broadcastUrgentRadius = asyncHandler(async (req, res) => {
    const { bloodGroup, city, hospitalName } = req.body;

    const potentialDonors = await User.find({
        role: 'Donor',
        bloodGroup,
        'personalInfo.city': city,
        isActive: { $ne: false }
    });

    const title = `URGENT: ${bloodGroup} Needed at ${hospitalName}`;
    const body = `A patient at ${hospitalName} needs ${bloodGroup} blood immediately. Can you help?`;

    await Promise.all(potentialDonors.map(async (donor) => {
        await notifyUser(donor._id, {
            type: 'blood_request',
            priority: 'critical',
            title,
            message: body,
            link: '/dashboard/notifications',
            metadata: { bloodGroup, city, hospitalName }
        });

        return dispatchNotification(donor._id, {
            title,
            body,
            email: donor.email,
            phone: donor.phone
        });
    }));

    await notifySuperAdmin({
        type: 'broadcast_alert',
        priority: 'high',
        title: 'Urgent donor broadcast sent',
        message: `${potentialDonors.length} matching donor(s) were alerted for ${bloodGroup} in ${city}.`,
        link: '/admin/broadcast',
        metadata: { bloodGroup, city, hospitalName, alertedCount: potentialDonors.length }
    });

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

    await notifySuperAdmin({
        type: 'blood_request',
        priority: action === 'Accept' ? 'high' : 'medium',
        title: `Donor ${action}ed request`,
        message: `${req.user.fullName} ${action.toLowerCase()}ed an urgent blood request.`,
        link: '/admin/overview',
        metadata: { notificationId: notif._id, userId: req.user._id, action }
    });

    return res.status(200).json(new ApiResponse(200, notif, `Request ${action}ed`));
});
