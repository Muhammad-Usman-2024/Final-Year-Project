import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    time: {
        type: String, // HH:mm
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        default: 8
    },
    bookedCount: {
        type: Number,
        default: 0
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure unique slot per hospital/date/time
slotSchema.index({ hospitalId: 1, date: 1, time: 1 }, { unique: true });

const Slot = mongoose.model('Slot', slotSchema);
export default Slot;
