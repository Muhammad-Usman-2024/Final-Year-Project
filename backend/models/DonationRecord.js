import mongoose from 'mongoose';

const donationRecordSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hospitalId: {
        type: String,
        required: true
    },
    hospitalName: String,
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['Whole blood', 'Plasma', 'Platelets', 'Double red cells'],
        required: true
    },
    volume: String, // e.g., "450 ml"
    vitals: {
        bp: String,
        hb: Number,
        temp: Number,
        pulse: Number
    },
    status: {
        type: String,
        enum: ['Completed', 'Deferred'],
        required: true
    },
    certificateUrl: String,
    deferralReason: String,
    nextEligibleDate: Date
}, { timestamps: true });

const DonationRecord = mongoose.model('DonationRecord', donationRecordSchema);
export default DonationRecord;
