import dotenv from 'dotenv';
dotenv.config();

// config.js
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:/course-selling'
export const JWT_SECRET = process.env.JWT_SECRET
export const RESEND_API_KEY = process.env.RESEND_API_KEY
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
export const Secret_key = process.env.Secret_key