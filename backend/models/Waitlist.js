import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true
    },
    priority: {
        type: String,
        enum: ['Normal', 'Urgent'],
        default: 'Normal'
    },
    isNotified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Waitlist = mongoose.model('Waitlist', waitlistSchema);
export default Waitlist;
