import mongoose from 'mongoose';

const stickyNoteSchema = new mongoose.Schema({
  screenshotUrl: {
    type: String,
    required: true
  },
  sourceUrl: {
    type: String, 
    required: true
  },
  note: {
    type: String,
    default: "" 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }
}, { timestamps: true });

const StickyNote = mongoose.model('StickyNote', stickyNoteSchema);

export default StickyNote;
