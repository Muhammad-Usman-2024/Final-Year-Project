import asyncHandler from 'express-async-handler';
import PatientProfile from '../models/PatientProfile.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';
import { differenceInDays } from 'date-fns';

/**
 * AI Risk Prediction Engine
 * Predicts the likelihood of a patient entering a 'Crisis' state.
 */
export const predictPatientRisk = asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    const profile = await PatientProfile.findOne({ userId: patientId });

    if (!profile) {
        throw new ApiError(404, 'Patient profile not found');
    }

    // 1. Analyze Hemoglobin Trend
    let hbRisk = 0;
    if (profile.hemoglobinLog && profile.hemoglobinLog.length > 0) {
        const sortedHb = [...profile.hemoglobinLog].sort((a, b) => b.date - a.date);
        const lastHb = sortedHb[0].level;
        
        if (lastHb < 7) hbRisk = 50;
        else if (lastHb < 9) hbRisk = 25;

        // Check for sharp drop
        if (sortedHb.length > 1) {
            const drop = sortedHb[1].level - sortedHb[0].level;
            if (drop > 1.5) hbRisk += 20;
        }
    } else {
        hbRisk = 10; // Unknown risk due to lack of data
    }

    // 2. Transfusion Delay Risk
    let transfusionRisk = 0;
    if (profile.transfusions && profile.transfusions.length > 0) {
        const sortedTransfusions = [...profile.transfusions].sort((a, b) => b.date - a.date);
        const lastTransfusionDate = sortedTransfusions[0].date;
        const daysSinceLast = differenceInDays(new Date(), lastTransfusionDate);
        const interval = profile.transfusionInterval || 21; // Default 21 days

        if (daysSinceLast > interval + 7) transfusionRisk = 40;
        else if (daysSinceLast > interval) transfusionRisk = 20;
    } else {
        transfusionRisk = 30; // High risk if no transfusion history found
    }

    // 3. Chelation Compliance Risk
    let chelationRisk = 0;
    if (profile.chelationLog && profile.chelationLog.length > 0) {
        // Assume if they have logs, they are somewhat compliant
        // In a real app, we'd check the frequency of logs
        chelationRisk = 5; 
    } else {
        chelationRisk = 15;
    }

    // Final Score Calculation
    let score = hbRisk + transfusionRisk + chelationRisk;
    score = Math.min(Math.max(score, 0), 100); // Clamp between 0-100

    let status = 'Green';
    let message = 'Patient is stable. Continue regular monitoring.';
    
    if (score >= 70) {
        status = 'Red';
        message = 'CRITICAL: High risk of crisis. Immediate transfusion or clinical review recommended.';
    } else if (score >= 40) {
        status = 'Yellow';
        message = 'WARNING: Moderate risk. Schedule follow-up checkup soon.';
    }

    const prediction = {
        score,
        status,
        message,
        breakdown: {
            hbRisk,
            transfusionRisk,
            chelationRisk
        },
        lastUpdated: new Date()
    };

    return res.status(200).json(new ApiResponse(200, prediction, 'Risk prediction generated successfully'));
});
