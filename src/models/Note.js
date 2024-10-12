import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Untitled Note"
    },
    content: {
        type: String, 
    },
    media: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media' 
    }],
    isSticky: {
        type: Boolean,
        default: false 
    },
    undoHistory: [{
        type: mongoose.Schema.Types.Mixed, 
    }],
    redoHistory: [{
        type: mongoose.Schema.Types.Mixed, 
    }],
    pageType: {
        type: String,
        enum: ['A4', 'Letter', 'Custom'], 
        default: 'A4'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

export default Note;
