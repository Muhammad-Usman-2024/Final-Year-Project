import mongoose from 'mongoose';

const searchRequestSchema = new mongoose.Schema({
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    component: {
        type: String,
        enum: ['Whole Blood', 'Platelets', 'Plasma'],
        default: 'Whole Blood'
    },
    city: {
        type: String,
        required: true
    },
    radius: {
        type: Number,
        default: 10 // km
    },
    urgency: {
        type: String,
        enum: ['Normal', 'Urgent', 'Emergency'],
        default: 'Normal'
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Open', 'Fulfilled', 'Expired'],
        default: 'Open'
    }
}, { timestamps: true });

const SearchRequest = mongoose.model('SearchRequest', searchRequestSchema);
export default SearchRequest;
