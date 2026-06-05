import mongoose from 'mongoose';

const broadcastMessageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    targetRoles: [{
        type: String,
        enum: ['Patient', 'Donor', 'Hospital', 'Doctor']
    }],
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deliveredCount: {
        type: Number,
        default: 0
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const BroadcastMessage = mongoose.model('BroadcastMessage', broadcastMessageSchema);
export default BroadcastMessage;
