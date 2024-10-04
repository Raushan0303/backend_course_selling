import mongoose from "mongoose";
import {MONGO_URL }from "./config.js";

export const connect = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); 
    }
};