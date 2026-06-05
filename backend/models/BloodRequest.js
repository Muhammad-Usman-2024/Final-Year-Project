import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
    bloodGroup: {
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
        required: true
    },
    requestingHospital: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Routine', 'Urgent', 'Emergency'],
        default: 'Routine'
    },
    requiredBy: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Dispatched', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    patientId: String, // Optional but recommended
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date,
    fulfilledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fulfilledAt: Date
}, { timestamps: true });

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
export default BloodRequest;
