const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // Prefer a Bearer token in the Authorization header (works reliably
    // across different domains). Fall back to the cookie for same-origin
    // setups where that still works fine.
    const authHeader = req.headers.authorization || "";
    const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = headerToken || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token found." });
    }

    try {
        // Verify token using your secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user payload (contains user id) to the request object
        req.user = verified;
        
        // Proceed to the next middleware or controller
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyToken;