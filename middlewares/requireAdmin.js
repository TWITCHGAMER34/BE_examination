export default function requireAdmin(req, res, next) {
    const user = req.session && req.session.user;
    if (user && user.role === 'admin') return next();
    next({ status: 403, message: 'Admin role required' });
}