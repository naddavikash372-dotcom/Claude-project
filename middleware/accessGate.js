
function accessGate(req, res, next) {
    // Check if it's the auth endpoint or health check
    // Since this is typically mounted on /api, we check for relative paths
    if (req.path === '/auth' || req.path === '/health') {
        return next();
    }

    // For all other routes, check for body.password
    const { password } = req.body;
    if (!password || password !== process.env.ACCESS_PASSWORD) {
        return res.status(401).json({ error: 'unauthorized_access' });
    }

    next();
}

module.exports = accessGate;
