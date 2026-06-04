import asyncHandler from 'express-async-handler';
import BloodUnit from '../models/BloodUnit.js';
import BloodRequest from '../models/BloodRequest.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';
import { isCompatible } from '../utils/compatibilityUtil.js';


// @desc    Get aggregated stock status
// @route   GET /api/inventory/stock
export const getStockStatus = asyncHandler(async (req, res) => {
    const stock = await BloodUnit.aggregate([
        { $match: { status: 'Available' } },
        {
            $group: {
                _id: { group: '$group', component: '$component' },
                totalUnits: { $sum: '$units' }
            }
        },
        {
            $project: {
                _id: 0,
                group: '$_id.group',
                component: '$_id.component',
                totalUnits: 1
            }
        }
    ]);

    // Format for easier frontend consumption
    const formattedStock = {};
    ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].forEach(g => {
        formattedStock[g] = { RBC: 0, Platelets: 0, FFP: 0, status: 'Low' };
    });

    stock.forEach(item => {
        formattedStock[item.group][item.component] = item.totalUnits;
    });

    // Calculate overall status for each group
    Object.keys(formattedStock).forEach(group => {
        const total = formattedStock[group].RBC + formattedStock[group].Platelets + formattedStock[group].FFP;
        if (total >= 20) formattedStock[group].status = 'Good';
        else if (total >= 10) formattedStock[group].status = 'Low';
        else formattedStock[group].status = 'Critical';
    });

    return res.status(200).json(new ApiResponse(200, formattedStock, 'Stock status fetched'));
});

// @desc    Add new blood unit to inventory
// @route   POST /api/inventory/add
export const addInventory = asyncHandler(async (req, res) => {
    const { group, component, units, collectedDate, hospitalId, batchId, source } = req.body;

    // Calculate expiry date based on component
    let expiryDays = 42; // Default RBC
    if (component === 'Platelets') expiryDays = 5;
    else if (component === 'FFP') expiryDays = 365;

    const expiryDate = new Date(collectedDate);
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    const bloodUnit = await BloodUnit.create({
        group, component, units, collectedDate, expiryDate, hospitalId, batchId, source
    });

    return res.status(201).json(new ApiResponse(201, bloodUnit, 'Blood unit added to inventory'));
});

// @desc    Request blood from bank
// @route   POST /api/inventory/request
export const requestBlood = asyncHandler(async (req, res) => {
    const { bloodGroup, component, units, requestingHospital, priority, requiredBy, patientId } = req.body;

    const request = await BloodRequest.create({
        bloodGroup, component, units, requestingHospital, priority, requiredBy, patientId
    });

    return res.status(201).json(new ApiResponse(201, request, 'Blood request submitted'));
});

// @desc    Fulfill blood request
// @route   PUT /api/inventory/request/:id/fulfill
export const fulfillRequest = asyncHandler(async (req, res) => {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) throw new ApiError(404, 'Request not found');

    // Check if enough stock exists
    const availableUnits = await BloodUnit.find({
        group: request.bloodGroup,
        component: request.component,
        status: 'Available'
    }).sort({ expiryDate: 1 }); // FIFO: Use units expiring soon first

    let totalAvailable = availableUnits.reduce((acc, curr) => acc + curr.units, 0);

    if (totalAvailable < request.units) {
        throw new ApiError(400, `Insufficient stock. Only ${totalAvailable} units available.`);
    }

    // Deduct from stock
    let unitsToDeduct = request.units;
    for (const unit of availableUnits) {
        if (unitsToDeduct <= 0) break;
        
        if (unit.units <= unitsToDeduct) {
            unitsToDeduct -= unit.units;
            unit.status = 'Issued';
            await unit.save();
        } else {
            unit.units -= unitsToDeduct;
            unitsToDeduct = 0;
            await unit.save();
        }
    }

    request.status = 'Dispatched';
    request.fulfilledBy = req.user._id;
    request.fulfilledAt = Date.now();
    await request.save();

    return res.status(200).json(new ApiResponse(200, request, 'Request fulfilled and dispatched'));
});

// @desc    Get expiry alerts
// @route   GET /api/inventory/expiry-alerts
export const getExpiryAlerts = asyncHandler(async (req, res) => {
    const today = new Date();
    const alertDate = new Date();
    alertDate.setDate(today.getDate() + 7); // Show alerts for next 7 days

    const alerts = await BloodUnit.find({
        status: 'Available',
        expiryDate: { $lte: alertDate, $gte: today }
    }).sort({ expiryDate: 1 });

    return res.status(200).json(new ApiResponse(200, alerts, 'Expiry alerts fetched'));
});

// @desc    Search compatible units for a patient
// @route   POST /api/inventory/compatibility-search
export const searchCompatibleUnits = asyncHandler(async (req, res) => {
    const { patientGroup, component } = req.body;

    if (!patientGroup) {
        throw new ApiError(400, 'Patient blood group is required');
    }

    // Find all available units of the requested component
    const units = await BloodUnit.find({
        status: 'Available',
        component: component || 'RBC'
    });

    // Filter by compatibility
    const compatibleUnits = units.map(unit => ({
        ...unit.toObject(),
        isCompatible: isCompatible(patientGroup, unit.group)
    })).filter(unit => unit.isCompatible);

    return res.status(200).json(new ApiResponse(200, compatibleUnits, 'Compatible units found'));
});

