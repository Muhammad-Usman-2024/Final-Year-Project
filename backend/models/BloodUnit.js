import mongoose from 'mongoose';

const bloodUnitSchema = new mongoose.Schema({
    group: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    component: {
        type: String,
        enum: ['RBC', 'Platelets', 'FFP'],
        required: true
    },
    units: {
        type: Number,
        required: true,
        default: 1
    },
    collectedDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    hospitalId: {
        type: String,
        required: true
    },
    batchId: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Reserved', 'Issued', 'Expired'],
        default: 'Available'
    },
    source: {
        type: String,
        enum: ['Walk-in donor', 'Camp donation', 'Transfer'],
        default: 'Walk-in donor'
    }
}, { timestamps: true });

const BloodUnit = mongoose.model('BloodUnit', bloodUnitSchema);
export default BloodUnit;
