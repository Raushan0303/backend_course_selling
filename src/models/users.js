import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true, 
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true  
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'User', 'Instructor'],
        default: 'User'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,   
        required: false,
    },
    otpExpires: {
        type: Date  
    },
    subdomain: {
        type: String,   
        sparse: true,   // This allows null values and maintains uniqueness for non-null values
        unique: true    // Subdomain should be unique across instructors
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
