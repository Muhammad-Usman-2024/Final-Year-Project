import mongoose from 'mongoose';

const clinicalNoteSchema = new mongoose.Schema({
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
    subjective: {
        type: String,
        required: true
    },
    objective: {
        type: String,
        required: true
    },
    assessment: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ClinicalNote = mongoose.model('ClinicalNote', clinicalNoteSchema);
export default ClinicalNote;
