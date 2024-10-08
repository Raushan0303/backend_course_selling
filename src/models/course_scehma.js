import mongoose from "mongoose";
const Schema = mongoose.Schema;


// const videoSchema = new Schema({
//   title: {
//     type: String,
//     required: true 
//  },
//   url: {
//     type: String,
//     required: true 
//  },  
//   duration: {
//     type: Number,
//     required: true 
//  },
// });


// const documentSchema = new Schema({
//   title: {
//      type: String,
//      required: true
//     },
//   url: {
//      type: String,
//     required: true 
//  },  
//   fileType: {
//      type: String,
//      required: true
//      },  // File type, e.g., 'pdf', 'docx'
// });

// Schema for course content (either a video or document)
const contentSchema = new Schema({
  contentType: {
     type: String,
     enum: ['video', 'document'],
     required: true
 },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: function() { return this.contentType === 'video'; }
  },
  fileType: {
    type: String,
    required: function() { return this.contentType === 'document'; }
  }
});


const sectionSchema = new Schema({
  sectionTitle: {
     type: String,
     required: true
  },  
  content: [contentSchema],
  interactionHistory: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      currentContentIndex: {
        type: Number,
        default: 0, 
      },
      startedAt: {
        type: Date,
        default: Date.now
      },
      lastAccessedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});


const courseSchema = new Schema({
  title: {
    type: String,
    required: true
 },  
  description: {
    type: String,
    required: true
 },  
  price: {
    type: String,
    required: true
  },
  sections: [sectionSchema],  
  creator: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  createdBy: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }  // Reference to the course creator
});

const Course = mongoose.model('Course', courseSchema);

export default Course
