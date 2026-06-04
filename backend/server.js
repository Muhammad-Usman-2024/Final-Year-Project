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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Health route
app.get('/', (req, res) => {
    res.send('BloodSync Smart Platform API is running...');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Backend is running',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'not connected'
    });
});

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

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Seed admin
const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@bloodsync.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            await User.create({
                fullName: 'System Admin',
                email: adminEmail,
                password: adminPassword,
                phone: '0000000000',
                cnic: '00000-0000000-0',
                role: 'Admin',
                isVerified: true,
                personalInfo: {
                    accountStatus: 'Verified'
                }
            });

            console.log(`Dummy Admin Created: ${adminEmail}`);
        } else {
            console.log('Admin already exists');
        }
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
};

// Connect MongoDB after server starts
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is missing in environment variables');
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected');

        await seedAdmin();
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
    }
};

// Start server first so Render can detect open port
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});