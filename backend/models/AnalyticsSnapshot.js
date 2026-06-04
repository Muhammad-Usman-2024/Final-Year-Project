import mongoose from 'mongoose';

const analyticsSnapshotSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    totalDonors: { type: Number, default: 0 },
    totalPatients: { type: Number, default: 0 },
    unitsCollected: { type: Number, default: 0 },
    unitsIssued: { type: Number, default: 0 },
    wastageCount: { type: Number, default: 0 },
    hospitalPerformance: [{
        hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        donationCount: Number,
        fulfillmentRate: Number
    }]
}, { timestamps: true });

const AnalyticsSnapshot = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
export default AnalyticsSnapshot;
