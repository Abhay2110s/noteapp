const User = require("../model/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Controller
async function registerUser(req, res) {
    try {
        const { username,email, password } = req.body;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Login Controller (Sets Token in Cookie)
async function loginUser(req, res) {
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
        
        // Send token securely inside an HTTP-only cookie
        res.cookie("token", token);

        res.json({ message: "Logged in successfully", username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Logout Controller (Clears the Cookie)
async function logoutUser(req, res) {
    try {
        res.clearCookie("token");
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
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
};