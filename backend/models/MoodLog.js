import mongoose from 'mongoose';

const moodLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    mood: {
        type: String,
        enum: ['Anxious', 'Hopeful', 'Tired', 'Blessed', 'Peaceful'],
        required: true
    },
    note: {
        type: String
    },
    role: {
        type: String,
        required: true
    }
}, { timestamps: true });

const MoodLog = mongoose.model('MoodLog', moodLogSchema);
export default MoodLog;
