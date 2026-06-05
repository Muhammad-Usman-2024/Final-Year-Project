import User from '../models/User.js';
import { createNotification } from '../controllers/notificationController.js';

export const notifyUser = async (userId, payload) => {
    if (!userId) return null;
    return createNotification(userId, payload);
};

export const notifySuperAdmin = async (payload) => {
    const superAdmin = await User.findOne({ role: 'SuperAdmin' }).select('_id');
    if (!superAdmin) return null;
    return createNotification(superAdmin._id, payload);
};

export const notifyUsersByRole = async (roles, payload) => {
    const users = await User.find({ role: { $in: roles } }).select('_id');
    return Promise.all(users.map(user => createNotification(user._id, payload)));
};
