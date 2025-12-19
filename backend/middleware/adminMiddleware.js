const adminMiddleware = (req, res, next) => {
    // Check if user ia admin (authMiddleware must run first)

    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

module.exports = adminMiddleware;