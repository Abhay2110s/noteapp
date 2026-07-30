const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  path: "/",
};

// Register Controller
async function register(req, res) {
    try {
        const { username , email, password } = req.body;
        
        const existingUser = await User.findOne({$or: [{ username }, { email }]});
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Login Controller (Sets Token in Cookie)
async function login(req, res) {
    try {
        const { username, email, password } = req.body;

        const user = await User.findOne({$or: [{ username }, { email }]});
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
        // Also set it as a cookie for same-origin setups where that works.
        res.cookie("token", token, cookieOptions);

        // Cross-domain deployments (frontend and backend on different
        // domains, e.g. Netlify + Render) can't rely on the cookie being
        // sent back, since browsers increasingly block third-party
        // cookies. Sending the token in the body lets the frontend store
        // it and attach it as an Authorization header on future requests.
        res.json({ message: "Logged in successfully", username: user.username, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Logout Controller (Clears the Cookie)
async function logout(req, res) {
    try {
        res.clearCookie("token", cookieOptions);
        res.json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get Current User Profile Controller
async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    register,
    login,
    logout,
    getProfile,
};
