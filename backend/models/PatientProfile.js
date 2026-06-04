import mongoose from 'mongoose';

const patientProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    diagnosisType: { type: String, required: true }, // e.g., "Thalassemia Major"
    genotype: String, // e.g., "β0/β0"
    transfusionInterval: Number, // in days
    serumFerritinLog: [{
        date: { type: Date, default: Date.now },
        level: Number // in ng/mL
    }],
    transfusions: [{
        date: { type: Date, default: Date.now },
        units: Number,
        hospital: String,
        bloodGroup: String
    }],
    chelationLog: [{
        date: { type: Date, default: Date.now },
        medication: String,
        dosage: String
    }],
    hemoglobinLog: [{
        date: { type: Date, default: Date.now },
        level: Number // in g/dL
    }],
    weightLog: [{
        date: { type: Date, default: Date.now },
        value: Number // in kg
    }]
}, { timestamps: true });

const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema);
export default PatientProfile;
