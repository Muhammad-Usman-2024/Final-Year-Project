import mongoose from 'mongoose';

const notifPreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    channels: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
        whatsapp: { type: Boolean, default: false }
    },
    quietHours: {
        enabled: { type: Boolean, default: false },
        start: { type: String, default: '22:00' }, // 24h format
        end: { type: String, default: '08:00' }
    },
    categories: {
        urgent: { type: Boolean, default: true },
        reminders: { type: Boolean, default: true },
        system: { type: Boolean, default: true }
    }
}, { timestamps: true });

const NotifPreference = mongoose.model('NotifPreference', notifPreferenceSchema);
export default NotifPreference;
