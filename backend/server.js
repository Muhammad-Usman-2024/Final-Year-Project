import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import wellnessRoutes from './routes/wellnessRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notifyRoutes from './routes/notifyRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import riskRoutes from './routes/riskRoutes.js';
import forecastRoutes from './routes/forecastRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import User from './models/User.js';
import { formatPhoneNumber } from './utils/phoneFormat.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notify', notifyRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('BloodSync Smart Platform API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const seedSuperAdmin = async () => {
    try {
        const superAdminEmail = process.env.SUPERADMIN_EMAIL || process.env.ADMIN_EMAIL || 'superadmin@bloodsync.com';
        const existingSuperAdmin = await User.findOne({ role: 'SuperAdmin' });

        if (!existingSuperAdmin) {
            const existingSeedUser = await User.findOne({ email: superAdminEmail });

            if (existingSeedUser) {
                existingSeedUser.role = 'SuperAdmin';
                existingSeedUser.isVerified = true;
                existingSeedUser.personalInfo = {
                    ...existingSeedUser.personalInfo,
                    accountStatus: 'Verified'
                };
                await existingSeedUser.save();
                console.log(`SuperAdmin promoted: ${superAdminEmail}`);
            } else {
                await User.create({
                    fullName: 'System SuperAdmin',
                    email: superAdminEmail,
                    password: process.env.SUPERADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'admin123',
                    phone: '+92 000 000 0000',
                    cnic: '00000-0000000-0',
                    role: 'SuperAdmin',
                    isVerified: true,
                    personalInfo: {
                        accountStatus: 'Verified'
                    }
                });
                console.log(`SuperAdmin created: ${superAdminEmail}`);
            }
        }

        await User.updateMany(
            { role: 'Admin' },
            { $set: { role: 'Donor' } }
        );

        await User.updateMany(
            { isActive: { $exists: false } },
            { $set: { isActive: true } }
        );

        await User.updateMany(
            { isActive: { $ne: false }, 'personalInfo.accountStatus': { $ne: 'Verified' } },
            { $set: { 'personalInfo.accountStatus': 'Verified' } }
        );

        await User.updateMany(
            { isActive: false, 'personalInfo.accountStatus': { $ne: 'Suspended' } },
            { $set: { 'personalInfo.accountStatus': 'Suspended' } }
        );

        const superAdmins = await User.find({ role: 'SuperAdmin' }).sort({ createdAt: 1 });
        if (superAdmins.length > 1) {
            const primarySuperAdmin = superAdmins.find(user => user.email === superAdminEmail) || superAdmins[0];
            await User.updateMany(
                { role: 'SuperAdmin', _id: { $ne: primarySuperAdmin._id } },
                { $set: { role: 'Donor' } }
            );
        }

        const usersWithPhone = await User.find({ phone: { $exists: true, $ne: '' } }).select('phone');
        await Promise.all(usersWithPhone.map(async (user) => {
            const formattedPhone = formatPhoneNumber(user.phone);
            if (formattedPhone && formattedPhone !== user.phone) {
                user.phone = formattedPhone;
                await user.save();
            }
        }));
    } catch (error) {
        console.error('Error seeding superadmin:', error);
    }
};

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        await seedSuperAdmin();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB Connection Error:', err));
