import asyncHandler from 'express-async-handler';
import AnalyticsSnapshot from '../models/AnalyticsSnapshot.js';
import BloodUnit from '../models/BloodUnit.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as ss from 'simple-statistics';
import { addDays, format, startOfDay } from 'date-fns';

/**
 * Blood Demand Forecasting Engine
 * Predicts blood group requirements for the next week.
 */
export const getForecastingData = asyncHandler(async (req, res) => {
    // 1. Fetch historical analytics (last 30 days)
    const history = await AnalyticsSnapshot.find().sort({ date: 1 }).limit(30);

    if (history.length < 2) {
        // Not enough data for regression, return dummy trend or empty
        return res.status(200).json(new ApiResponse(200, {
            predicted: [],
            historical: history,
            message: 'Insufficient historical data for accurate forecasting.'
        }, 'Forecasting data retrieved'));
    }

    // 2. Prepare data for Simple Linear Regression
    // X = day index (0 to N), Y = unitsIssued
    const issuedData = history.map((h, i) => [i, h.unitsIssued || 0]);
    const collectedData = history.map((h, i) => [i, h.unitsCollected || 0]);

    const issuedLine = ss.linearRegression(issuedData);
    const collectedLine = ss.linearRegression(collectedData);

    const issuedFunc = ss.linearRegressionLine(issuedLine);
    const collectedFunc = ss.linearRegressionLine(collectedLine);

    // 3. Predict for next 7 days
    const lastDayIndex = history.length - 1;
    const predictions = [];
    const lastDate = history[history.length - 1].date;

    for (let i = 1; i <= 7; i++) {
        const nextIndex = lastDayIndex + i;
        predictions.push({
            date: addDays(lastDate, i),
            predictedIssued: Math.max(0, Math.round(issuedFunc(nextIndex))),
            predictedCollected: Math.max(0, Math.round(collectedFunc(nextIndex)))
        });
    }

    // 4. Calculate group-specific current inventory
    const inventory = await BloodUnit.aggregate([
        { $match: { status: 'Available' } },
        { $group: { _id: '$group', count: { $sum: 1 } } }
    ]);

    const result = {
        historical: history.map(h => ({
            date: h.date,
            issued: h.unitsIssued,
            collected: h.unitsCollected
        })),
        predictions,
        currentInventory: inventory,
        alert: predictions.some(p => p.predictedIssued > p.predictedCollected) 
            ? 'HIGH DEMAND ALERT: Predicted issues exceed collections in the coming week.'
            : 'Inventory stable.'
    };

    return res.status(200).json(new ApiResponse(200, result, 'Forecasting data generated'));
});
