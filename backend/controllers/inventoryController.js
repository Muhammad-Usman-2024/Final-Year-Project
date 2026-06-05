import asyncHandler from 'express-async-handler';
import BloodUnit from '../models/BloodUnit.js';
import BloodRequest from '../models/BloodRequest.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';
import { isCompatible } from '../utils/compatibilityUtil.js';
import { notifySuperAdmin, notifyUser } from '../utils/notificationEvents.js';


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

    await notifyUser(hospitalId || req.user._id, {
        type: 'inventory_update',
        priority: 'medium',
        title: 'Blood stock added',
        message: `${units} unit(s) of ${group} ${component} were added to inventory.`,
        link: '/dashboard/inventory',
        metadata: { bloodUnitId: bloodUnit._id, group, component, units }
    });

    await notifySuperAdmin({
        type: 'inventory_update',
        priority: 'low',
        title: 'Inventory updated',
        message: `${req.user.fullName} added ${units} unit(s) of ${group} ${component}.`,
        link: '/admin/overview',
        metadata: { bloodUnitId: bloodUnit._id, hospitalId: hospitalId || req.user._id }
    });

    return res.status(201).json(new ApiResponse(201, bloodUnit, 'Blood unit added to inventory'));
});

// @desc    Request blood from bank
// @route   POST /api/inventory/request
export const requestBlood = asyncHandler(async (req, res) => {
    const { bloodGroup, component, units, requestingHospital, priority, requiredBy, patientId } = req.body;
    const hospitalName = requestingHospital || req.user.hospitalName || req.user.fullName;

    const request = await BloodRequest.create({
        bloodGroup, component, units, requestingHospital: hospitalName, priority, requiredBy, patientId
    });

    await notifySuperAdmin({
        type: 'blood_request',
        priority: priority === 'Emergency' ? 'critical' : 'high',
        title: 'New blood request',
        message: `${hospitalName} requested ${units} unit(s) of ${bloodGroup} ${component}.`,
        link: '/admin/overview',
        metadata: { requestId: request._id, bloodGroup, component, units }
    });

    if (patientId) {
        await notifyUser(patientId, {
            type: 'blood_request',
            priority: priority === 'Emergency' ? 'critical' : 'high',
            title: 'Blood request submitted',
            message: `Your request for ${bloodGroup} ${component} has been submitted.`,
            link: '/dashboard/search',
            metadata: { requestId: request._id, bloodGroup, component, units }
        });
    }

    return res.status(201).json(new ApiResponse(201, request, 'Blood request submitted'));
});

// @desc    Get blood requests
// @route   GET /api/inventory/requests
export const getBloodRequests = asyncHandler(async (req, res) => {
    const query = {};

    if (req.user.role === 'Hospital') {
        query.requestingHospital = req.user.hospitalName || req.user.fullName;
    }

    const requests = await BloodRequest.find(query)
        .populate('approvedBy', 'fullName email role')
        .populate('fulfilledBy', 'fullName email role')
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, requests, 'Blood requests fetched'));
});

// @desc    Approve blood request
// @route   PUT /api/inventory/request/:id/approve
export const approveRequest = asyncHandler(async (req, res) => {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) throw new ApiError(404, 'Request not found');
    if (request.status !== 'Pending') {
        throw new ApiError(400, `Only pending requests can be approved. Current status is ${request.status}.`);
    }

    const totalAvailable = await BloodUnit.aggregate([
        {
            $match: {
                group: request.bloodGroup,
                component: request.component,
                status: 'Available'
            }
        },
        { $group: { _id: null, totalUnits: { $sum: '$units' } } }
    ]);

    const availableUnits = totalAvailable[0]?.totalUnits || 0;
    if (availableUnits < request.units) {
        throw new ApiError(400, `Insufficient stock. Only ${availableUnits} units available.`);
    }

    request.status = 'Approved';
    request.approvedBy = req.user._id;
    request.approvedAt = Date.now();
    await request.save();

    await notifySuperAdmin({
        type: 'blood_request',
        priority: 'medium',
        title: 'Blood request approved',
        message: `${request.units} unit(s) of ${request.bloodGroup} ${request.component} request was approved.`,
        link: '/admin/overview',
        metadata: { requestId: request._id, approvedBy: req.user._id }
    });

    return res.status(200).json(new ApiResponse(200, request, 'Request approved successfully'));
});

// @desc    Fulfill blood request
// @route   PUT /api/inventory/request/:id/fulfill
export const fulfillRequest = asyncHandler(async (req, res) => {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) throw new ApiError(404, 'Request not found');
    if (request.status !== 'Approved') {
        throw new ApiError(400, `Request must be approved before dispatch. Current status is ${request.status}.`);
    }

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

    await notifySuperAdmin({
        type: 'request_fulfilled',
        priority: 'medium',
        title: 'Blood request fulfilled',
        message: `${request.units} unit(s) of ${request.bloodGroup} ${request.component} were dispatched.`,
        link: '/admin/overview',
        metadata: { requestId: request._id, fulfilledBy: req.user._id }
    });

    if (request.patientId) {
        await notifyUser(request.patientId, {
            type: 'request_fulfilled',
            priority: 'high',
            title: 'Blood request dispatched',
            message: `${request.units} unit(s) of ${request.bloodGroup} ${request.component} have been dispatched.`,
            link: '/dashboard/notifications',
            metadata: { requestId: request._id }
        });
    }

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

    if (alerts.length > 0) {
        await notifySuperAdmin({
            type: 'expiry_alert',
            priority: 'high',
            title: 'Blood stock expiring soon',
            message: `${alerts.length} blood unit record(s) will expire within the next 7 days.`,
            link: '/admin/overview',
            metadata: { count: alerts.length }
        });
    }

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

