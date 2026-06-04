import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    specialty: {
        type: String,
        enum: ['Cardiac', 'Endocrine', 'Bone', 'General', 'Other'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Sent', 'Accepted', 'Booked'],
        default: 'Sent'
    },
    letterNotes: {
        type: String
    }
}, { timestamps: true });

const Referral = mongoose.model('Referral', referralSchema);
export default Referral;
