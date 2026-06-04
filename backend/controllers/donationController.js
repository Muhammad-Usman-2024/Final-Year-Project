import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import DonationRecord from '../models/DonationRecord.js';
import DonorProfile from '../models/DonorProfile.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';

// @desc    Get available slots for a hospital and date
// @route   GET /api/donation/available-slots
export const getAvailableSlots = async (req, res) => {
    const { hospitalId, date } = req.query;
    
    const allSlots = [
        "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
        "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
        "4:00 PM", "4:30 PM"
    ];

    let bookedSlots = [];

    // Only query if hospitalId is a valid ObjectId to avoid CastError
    if (mongoose.Types.ObjectId.isValid(hospitalId)) {
        const bookedAppointments = await Appointment.find({
            hospitalId,
            date: date, // Matches the String format in Appointment.js (YYYY-MM-DD)
            status: 'Scheduled'
        });
        bookedSlots = bookedAppointments.map(app => app.slot);
    }

    const slotAvailability = allSlots.map(slot => ({
        time: slot,
        isFull: bookedSlots.includes(slot)
    }));

    return res.status(200).json(new ApiResponse(200, slotAvailability, 'Slots fetched successfully'));
};

// @desc    Book donation appointment
// @route   POST /api/donation/schedule
export const bookAppointment = async (req, res) => {
    const { hospitalId, hospitalName, date, slot, type, specialNotes } = req.body;

    // Basic validation for hospitalId if it's meant to be an ObjectId
    if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
        throw new ApiError(400, 'Invalid Hospital ID. Please select a valid hospital.');
    }

    const existingAppointment = await Appointment.findOne({
        hospitalId,
        date: date,
        slot,
        status: 'Scheduled'
    });

    if (existingAppointment) {
        throw new ApiError(400, 'This slot is already booked. Please choose another.');
    }

    const appointment = await Appointment.create({
        userId: req.user._id, // Changed from donorId to userId to match schema
        hospitalId,
        hospitalName,
        date,
        slot,
        type: 'Donation', // Ensure it matches the enum in Appointment.js
        notes: specialNotes // Map specialNotes to notes in Appointment schema
    });

    return res.status(201).json(new ApiResponse(201, appointment, 'Appointment booked successfully'));
};

// @desc    Get donation history for a donor
// @route   GET /api/donation/history/:donorId
export const getDonationHistory = async (req, res) => {
    const history = await DonationRecord.find({ donorId: req.params.donorId }).sort({ date: -1 });
    return res.status(200).json(new ApiResponse(200, history, 'History fetched successfully'));
};

// @desc    Update donation status (Complete/Defer)
// @route   PUT /api/donation/update-status/:id
export const updateDonationStatus = async (req, res) => {
    const { status, vitals, volume, deferralReason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) throw new ApiError(404, 'Appointment not found');

    appointment.status = status === 'Completed' ? 'Completed' : 'Cancelled';
    await appointment.save();

    const record = await DonationRecord.create({
        donorId: appointment.userId, // Changed from donorId to userId
        hospitalId: appointment.hospitalId,
        hospitalName: appointment.hospitalName,
        date: appointment.date,
        type: appointment.type,
        volume,
        vitals,
        status,
        deferralReason
    });

    if (status === 'Completed') {
        const profile = await DonorProfile.findOne({ userId: appointment.userId });
        if (profile) {
            profile.totalDonations += 1;
            profile.lastDonationDate = appointment.date;
            const nextDate = new Date(appointment.date);
            nextDate.setDate(nextDate.getDate() + 90);
            profile.nextEligibleDate = nextDate;
            await profile.save();
        }
    }

    return res.status(200).json(new ApiResponse(200, record, `Donation marked as ${status}`));
};

