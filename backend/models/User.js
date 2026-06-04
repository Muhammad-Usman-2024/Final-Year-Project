import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please add a full name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    cnic: {
        type: String,
        required: [true, 'Please add a CNIC/ID']
    },
    role: {
        type: String,
        enum: ['Admin', 'Donor', 'Patient', 'Hospital', 'Doctor'],
        default: 'Donor'
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    
    // Module 2 Additions
    personalInfo: {
        dob: Date,
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        city: String,
        address: String,
        avatar: String,
        accountStatus: { type: String, enum: ['Pending', 'Verified', 'Suspended'], default: 'Pending' }
    },
    
    medicalHistory: {
        chronicDiseases: { type: String, default: 'None' },
        currentMedications: { type: String, default: 'None' },
        allergies: { type: String, default: 'None' },
        previousSurgeries: { type: String, default: 'None' },
        recentTravel: { type: String, default: 'None outside Pakistan' },
        hivHepStatus: { type: String, default: 'All negative' }
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    refreshToken: String,
}, {
    timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
