import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    url: {
        type: String, 
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'pdf', 'spreadsheet', 'document'], 
        required: true
    },
    note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note', 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);

export default Media;
