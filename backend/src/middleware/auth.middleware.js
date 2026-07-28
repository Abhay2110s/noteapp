const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // Read the token from the HTTP-only cookie
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token found in cookies." });
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