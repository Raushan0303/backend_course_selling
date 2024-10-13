import mongoose from "mongoose";

const notebookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section' 
    }],
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
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

const Notebook = mongoose.model('Notebook', notebookSchema);

export default Notebook;
