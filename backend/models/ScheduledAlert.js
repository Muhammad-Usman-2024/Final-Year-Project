import mongoose from 'mongoose';

const scheduledAlertSchema = new mongoose.Schema({
    triggerAt: {
        type: Date,
        required: true
    },
    targetUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    template: {
        type: String,
        required: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed
    },
    isProcessed: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['DonationReminder', 'TransfusionReminder', 'ExpiryAlert'],
        required: true
    }
}, { timestamps: true });

const ScheduledAlert = mongoose.model('ScheduledAlert', scheduledAlertSchema);
export default ScheduledAlert;
