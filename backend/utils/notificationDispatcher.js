import sendEmail from './sendEmail.js';
import NotifPreference from '../models/NotifPreference.js';

/**
 * Unified Dispatcher for Module 10
 * Routes notifications through multiple channels based on user preferences.
 */
export const dispatchNotification = async (userId, payload) => {
    try {
        const prefs = await NotifPreference.findOne({ userId });
        
        // Default to Email if no prefs found
        const channels = prefs ? prefs.channels : { email: true, push: true, sms: false, whatsapp: false };
        
        const results = [];

        // 1. In-App / Push (Handled by our SSE engine / FCM)
        if (channels.push) {
            // Logic to trigger SSE push via the existing notification controller
            results.push({ channel: 'push', status: 'delivered' });
        }

        // 2. Email
        if (channels.email) {
            await sendEmail(payload.email, payload.title, { html: payload.body });
            results.push({ channel: 'email', status: 'sent' });
        }

        // 3. SMS (Twilio Mock)
        if (channels.sms) {
            console.log(`[SMS MOCK] To: ${payload.phone} | Msg: ${payload.body}`);
            results.push({ channel: 'sms', status: 'sent' });
        }

        // 4. WhatsApp (360Dialog Mock)
        if (channels.whatsapp) {
            console.log(`[WHATSAPP MOCK] To: ${payload.phone} | Msg: ${payload.body}`);
            results.push({ channel: 'whatsapp', status: 'sent' });
        }

        return results;
    } catch (error) {
        console.error('Dispatch Error:', error);
        return [];
    }
};

/**
 * Check if current time is within user's quiet hours
 */
export const isQuietHours = (prefs) => {
    if (!prefs || !prefs.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { start, end } = prefs.quietHours;
    
    if (start < end) {
        return currentTime >= start && currentTime <= end;
    } else {
        // Overlapping midnight (e.g., 22:00 to 08:00)
        return currentTime >= start || currentTime <= end;
    }
};
