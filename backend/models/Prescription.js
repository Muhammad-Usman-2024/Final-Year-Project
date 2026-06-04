import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
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
    pmdcNumber: {
        type: String,
        required: true
    },
    drugs: [{
        name: { type: String, required: true },
        dose: { type: String, required: true },
        frequency: { type: String, required: true }, // e.g. OD, BD, TDS
        duration: { type: String, required: true }  // e.g. 5 days, 1 month
    }],
    instructions: {
        type: String
    }
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
