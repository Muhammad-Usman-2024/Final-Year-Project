import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hospitalName: {
        type: String
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot'
    },
    slot: {
        type: String // For simple time strings like "9:00 AM"
    },
    type: {
        type: String,
        enum: ['Donation', 'Consultation', 'Transfusion'],
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'],
        default: 'Scheduled'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    meetingLink: {
        type: String // For telemedicine
    },
    notes: {
        type: String
    }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
