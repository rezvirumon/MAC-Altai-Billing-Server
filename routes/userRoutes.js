const express = require('express');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

// POST /api/users
router.post('/', async (req, res) => { // Change here
    try {
        const { uid, email, name, mobile, area, role, panelCharge, photoURL } = req.body;

        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ uid }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user
        const user = new User({
            uid,
            email,
            name,
            mobile,
            area,
            role,
            panelCharge,
            photoURL,
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});



// GET /api/users
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

module.exports = router;
