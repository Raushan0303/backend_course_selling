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
        enum: ['User', 'Instructor'],
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
        required: function() {
            return this.role === 'Instructor';  // Subdomain is required only for Instructor
        },
        unique: true,  // Subdomain should be unique across instructors
        sparse: true   // Allow null or undefined for other roles
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
