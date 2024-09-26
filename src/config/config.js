import dotenv from 'dotenv';
dotenv.config();

// config.js
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:/course-selling'
export const JWT_SECRET = process.env.JWT_SECRET
export const RESEND_API_KEY = process.env.RESEND_API_KEY