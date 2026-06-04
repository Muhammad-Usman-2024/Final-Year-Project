import asyncHandler from 'express-async-handler';
import Slot from '../models/Slot.js';
import Appointment from '../models/Appointment.js';
import Waitlist from '../models/Waitlist.js';
import Notification from '../models/Notification.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';

// @desc    Get available slots for a hospital on a date
// @route   GET /api/appointments/slots/:hospitalId
export const getAvailableSlots = asyncHandler(async (req, res) => {
    const { date } = req.query;
    if (!date) throw new ApiError(400, 'Date is required');

    const slots = await Slot.find({
        hospitalId: req.params.hospitalId,
        date: date,
        isBlocked: false
    }).sort({ time: 1 });

    return res.status(200).json(new ApiResponse(200, slots, 'Slots fetched'));
});

// @desc    Book an appointment
// @route   POST /api/appointments/book
export const bookAppointment = asyncHandler(async (req, res) => {
    const { slotId, type, isRecurring, doctorId, notes } = req.body;

    const slot = await Slot.findById(slotId);
    if (!slot) throw new ApiError(404, 'Slot not found');
    if (slot.bookedCount >= slot.capacity) throw new ApiError(400, 'Slot is full');

    // Atomic-like update (Check again before booking)
    slot.bookedCount += 1;
    await slot.save();

    const appointment = await Appointment.create({
        userId: req.user._id,
        hospitalId: slot.hospitalId,
        slotId: slot._id,
        type,
        date: slot.date,
        isRecurring,
        doctorId,
        notes,
        meetingLink: type === 'Consultation' ? `https://meet.jit.si/blood-platform-${Math.random().toString(36).substring(7)}` : null
    });

    return res.status(201).json(new ApiResponse(201, appointment, 'Appointment booked successfully'));
});

// @desc    Cancel appointment & Notify Waitlist
// @route   PUT /api/appointments/:id/cancel
export const cancelAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) throw new ApiError(404, 'Appointment not found');

    appointment.status = 'Cancelled';
    await appointment.save();

    // Release slot capacity
    const slot = await Slot.findById(appointment.slotId);
    if (slot) {
        slot.bookedCount = Math.max(0, slot.bookedCount - 1);
        await slot.save();

        // Check Waitlist
        const nextInLine = await Waitlist.findOne({ slotId: slot._id, isNotified: false }).sort({ priority: -1, createdAt: 1 });
        if (nextInLine) {
            await Notification.create({
                userId: nextInLine.userId,
                type: 'slot_available',
                title: 'Slot Available!',
                body: `A slot just opened up at ${slot.time} on ${slot.date}. Book it now!`,
                priority: 'High'
            });
            nextInLine.isNotified = true;
            await nextInLine.save();
        }
    }

    return res.status(200).json(new ApiResponse(200, appointment, 'Appointment cancelled'));
});

// @desc    Manage Hospital Slots (CRUD)
// @route   POST /api/appointments/slots/manage
export const manageSlots = asyncHandler(async (req, res) => {
    const { date, slots } = req.body; // slots: [{time, capacity}]

    // Remove existing for that date and replace or update
    // Simple implementation: Create new or update existing
    const operations = slots.map(s => ({
        updateOne: {
            filter: { hospitalId: req.user._id, date, time: s.time },
            update: { $set: { capacity: s.capacity, isBlocked: s.isBlocked || false } },
            upsert: true
        }
    }));

    await Slot.bulkWrite(operations);
    return res.status(200).json(new ApiResponse(200, null, 'Slots updated successfully'));
});

// @desc    Get My Appointments
// @route   GET /api/appointments/my
export const getMyAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ userId: req.user._id })
        .populate('hospitalId', 'fullName location city')
        .populate('slotId', 'time')
        .sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, appointments, 'Appointments fetched'));
});
