import { Router } from 'express';
import { validateAuthBody } from '../middlewares/validators.js';
import { getUser, registerUser } from '../services/users.js';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

const router = Router();

router.get('/logout', (req, res, next) => {
    if (req.session && req.session.user) {
        req.session.destroy(err => {
            if (err) return next(err);
            res.clearCookie(process.env.SESSION_NAME || 'sid');
            res.json({ success: true, message: 'User logged out successfully' });
        });
    } else {
        next({ status: 400, message: 'No user is currently logged in' });
    }
});

router.post('/register', validateAuthBody, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const userType = 'user';
        const result = await registerUser({
            username,
            password,
            role: userType,
            userId: `${userType}-${uuid().substring(0, 5)}`
        });
        if (result) {
            res.status(201).json({ success: true, message: 'New user registered successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Registration unsuccessful' });
        }
    } catch (err) {
        next(err);
    }
});

router.post('/login', validateAuthBody, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await getUser(username);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Store safe user info in session (no JWT)
        if (req.session) {
            req.session.user = { username: user.username, role: user.role, userId: user.userId };
        }

        res.json({
            success: true,
            user: {
                username: user.username,
                role: user.role,
                userId: user.userId
            }
        });
    } catch (err) {
        next(err);
    }
});

export default router;