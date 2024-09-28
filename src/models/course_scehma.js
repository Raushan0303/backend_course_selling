import mongoose from "mongoose";
const Schema = mongoose.Schema;


const videoSchema = new Schema({
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
    required: true 
 },
});


const documentSchema = new Schema({
  title: {
     type: String,
     required: true
    },
  url: {
     type: String,
    required: true 
 },  
  fileType: {
     type: String,
     required: true
     },  // File type, e.g., 'pdf', 'docx'
});

// Schema for course content (either a video or document)
const contentSchema = new Schema({
  contentType: {
     type: String,
     enum: ['video', 'document'],
     required: true
 },  // 'video' or 'document'
  video: videoSchema,  
  document: documentSchema,
});

// Schema for sections in a course
const sectionSchema = new Schema({
  sectionTitle: {
     type: String,
     required: true
    },  
  content: [contentSchema], 
});

// Main Course Schema
const courseSchema = new Schema({
  title: {
    type: String,
    required: true
 },  
  description: {
    type: String
 },  
  sections: [sectionSchema],  
  createdBy: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
 }  // Reference to the course creator (optional)
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
