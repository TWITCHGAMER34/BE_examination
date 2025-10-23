

export default function auth(req, res, next) {
    if (req.session && req.session.user) return next();
    next({ status: 401, message: 'Authentication required' });
}