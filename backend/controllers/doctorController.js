import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import PatientProfile from '../models/PatientProfile.js';
import ClinicalNote from '../models/ClinicalNote.js';
import Prescription from '../models/Prescription.js';
import Referral from '../models/Referral.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';

// @desc    Get all patients (for simplicity, returning all patients or assigned if there was logic)
// @route   GET /api/doctor/patients
export const getDoctorPatients = asyncHandler(async (req, res) => {
    // In a real scenario, this might filter by assigned doctor. For now, returning all patients.
    const patients = await User.find({ role: 'Patient' }).select('-password');
    
    // Attach profile info (ferritin, transfusion due)
    const patientsWithProfiles = await Promise.all(patients.map(async (p) => {
        const profile = await PatientProfile.findOne({ userId: p._id });
        return {
            ...p.toObject(),
            profile: profile || {}
        };
    }));

    return res.status(200).json(new ApiResponse(200, patientsWithProfiles, 'Patients retrieved successfully'));
});

// @desc    Add clinical note (SOAP)
// @route   POST /api/doctor/note/:patientId
export const addClinicalNote = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { subjective, objective, assessment, plan } = req.body;
    const doctorId = req.user._id;

    if (!subjective || !objective || !assessment || !plan) {
        throw new ApiError(400, 'All SOAP fields are required');
    }

    const note = await ClinicalNote.create({
        patientId,
        doctorId,
        subjective,
        objective,
        assessment,
        plan
    });

    return res.status(201).json(new ApiResponse(201, note, 'Clinical note added successfully'));
});

// @desc    Get clinical notes for a patient
// @route   GET /api/doctor/note/:patientId
export const getClinicalNotes = asyncHandler(async (req, res) => {
    const notes = await ClinicalNote.find({ patientId: req.params.patientId }).sort({ date: -1 }).populate('doctorId', 'fullName');
    return res.status(200).json(new ApiResponse(200, notes, 'Clinical notes retrieved'));
});

// @desc    Issue digital prescription
// @route   POST /api/doctor/prescription/:patientId
export const issuePrescription = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { pmdcNumber, drugs, instructions } = req.body;
    const doctorId = req.user._id;

    if (!pmdcNumber || !drugs || drugs.length === 0) {
        throw new ApiError(400, 'PMDC number and at least one drug are required');
    }

    const prescription = await Prescription.create({
        patientId,
        doctorId,
        pmdcNumber,
        drugs,
        instructions
    });

    return res.status(201).json(new ApiResponse(201, prescription, 'Prescription issued successfully'));
});

// @desc    Get prescriptions for a patient
// @route   GET /api/doctor/prescription/:patientId
export const getPrescriptions = asyncHandler(async (req, res) => {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId }).sort({ date: -1 }).populate('doctorId', 'fullName');
    return res.status(200).json(new ApiResponse(200, prescriptions, 'Prescriptions retrieved'));
});

// @desc    Update treatment plan
// @route   PUT /api/doctor/plan/:patientId
export const updateTreatmentPlan = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { targetFerritin, targetHb, chelationPlan, transfusionFrequencyDays } = req.body;

    let profile = await PatientProfile.findOne({ userId: patientId });
    if (!profile) {
        // Create an empty profile if not exists to store treatment plan
         profile = await PatientProfile.create({ userId: patientId, medicalHistory: [], currentMedications: [] });
    }

    // Since our original PatientProfile might not have these exact fields, we'll store them in a 'treatmentPlan' object 
    // Let's assume we can add a treatmentPlan mixed type or just update fields. 
    // Mongoose allows adding properties if schema is not strict or we can just save it into medicalHistory as a plan update.
    // For proper typing, it's better to update the PatientProfile schema or just save the update in a note.
    // Let's add it as a new medicalHistory entry for the sake of standard flow, or if the user requested a specific "Plan" object, we'll mock it for now.
    
    // We'll update the profile object directly using strict: false or if it's supported.
    profile.set('treatmentPlan', { targetFerritin, targetHb, chelationPlan, transfusionFrequencyDays, updatedBy: req.user._id, updatedAt: new Date() });
    await profile.save({ strict: false }); // Bypass schema strictness for this dynamic update

    return res.status(200).json(new ApiResponse(200, profile.treatmentPlan, 'Treatment plan updated'));
});

// @desc    Create a referral
// @route   POST /api/doctor/referral/:patientId
export const createReferral = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { specialty, reason, letterNotes } = req.body;
    const doctorId = req.user._id;

    if (!specialty || !reason) {
        throw new ApiError(400, 'Specialty and reason are required');
    }

    const referral = await Referral.create({
        patientId,
        doctorId,
        specialty,
        reason,
        letterNotes
    });

    return res.status(201).json(new ApiResponse(201, referral, 'Referral created successfully'));
});

// @desc    Get referrals for a patient
// @route   GET /api/doctor/referral/:patientId
export const getReferrals = asyncHandler(async (req, res) => {
     const referrals = await Referral.find({ patientId: req.params.patientId }).sort({ date: -1 }).populate('doctorId', 'fullName');
     return res.status(200).json(new ApiResponse(200, referrals, 'Referrals retrieved'));
});

// @desc    Upload lab result
// @route   POST /api/doctor/lab/:patientId
export const uploadLabResult = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { testName, result, unit, date } = req.body;

    let profile = await PatientProfile.findOne({ userId: patientId });
    if (!profile) {
        throw new ApiError(404, 'Patient profile not found');
    }

    profile.medicalHistory.push({
        condition: `Lab: ${testName}`,
        diagnosisDate: date || new Date(),
        notes: `Result: ${result} ${unit}`
    });

    await profile.save();

    return res.status(201).json(new ApiResponse(201, profile, 'Lab result uploaded successfully'));
});
