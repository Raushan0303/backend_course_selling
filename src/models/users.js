import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true  // Ensure email is unique
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'User','Instructor'],
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
        type: Date  // Optional: Track OTP expiration time
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
