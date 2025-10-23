import User from '../models/User.js';
import bcrypt from 'bcrypt';

export async function registerUser({ username, password, role, userId }) {
    try {
        const existing = await User.findOne({ username });
        if (existing) return null; // username taken

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashed,
            role,
            userId
        });
        return user;
    } catch (err) {
        console.error('registerUser error:', err);
        return null;
    }
}

export async function getUser(username) {
    return await User.findOne({ username }).lean();
}