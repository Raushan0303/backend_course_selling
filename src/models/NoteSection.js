import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note' 
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Section = mongoose.model('Section', sectionSchema);

export default Section;
