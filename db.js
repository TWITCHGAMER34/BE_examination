// File: `db.js`
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connectDB() {
    if (!process.env.CONNECTION_STRING) {
        throw new Error('Set CONNECTION_STRING in .env');
    }
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('MongoDB connected');
}