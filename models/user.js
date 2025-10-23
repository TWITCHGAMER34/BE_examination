import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: { type: String, default: 'user' },
    userId: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);