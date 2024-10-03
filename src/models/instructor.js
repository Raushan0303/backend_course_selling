import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    bio: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    branding: {
        type: String,
        default: "Default Branding",  
    },
    
}, { timestamps: true });

const Instructor = mongoose.model('Instructor', instructorSchema);

export default Instructor;
