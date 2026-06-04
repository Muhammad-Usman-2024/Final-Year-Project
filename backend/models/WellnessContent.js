import mongoose from 'mongoose';

const wellnessContentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Verse', 'Hadith', 'Dua'],
        required: true
    },
    arabic: {
        type: String,
        required: true
    },
    urdu: {
        type: String,
        required: true
    },
    english: {
        type: String
    },
    category: {
        type: String,
        enum: ['Healing', 'Patience', 'Reward', 'Hope', 'Gratitude'],
        required: true
    },
    targetRole: {
        type: String,
        enum: ['Patient', 'Donor', 'All'],
        default: 'All'
    }
}, { timestamps: true });

const WellnessContent = mongoose.model('WellnessContent', wellnessContentSchema);
export default WellnessContent;
