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
    Instructor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    notebooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notebook'
    }],
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1, sparse: true });
userSchema.index({ subdomain: 1, sparse: true });

const User = mongoose.model('User', userSchema);

export default User;
