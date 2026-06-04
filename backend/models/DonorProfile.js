import mongoose from 'mongoose';

const donorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalDonations: { type: Number, default: 0 },
    livesSaved: { type: Number, default: 0 },
    lastDonationDate: Date,
    nextEligibleDate: Date,
    weight: Number,
    hbLevel: Number,
    eligibilityStatus: {
        isEligible: { type: Boolean, default: true },
        reason: String
    },
    donations: [{
        date: { type: Date, default: Date.now },
        location: String,
        hbLevel: Number,
        volume: String, // e.g., "450ml"
        status: { type: String, enum: ['Completed', 'Cancelled'], default: 'Completed' }
    }]
}, { timestamps: true });

const DonorProfile = mongoose.model('DonorProfile', donorProfileSchema);
export default DonorProfile;
