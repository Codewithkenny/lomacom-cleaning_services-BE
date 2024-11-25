const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    // Fetch the user using the userId from the request (which is set by the auth middleware)
    const user = await User.findById(req.userId); // req.userId is set after authentication
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user profile details
    res.json({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  try {
    const user = await User.findById(req.userId); // Find the logged-in user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the fields that were provided in the request
    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (password) {
      // If the password is being updated, hash the new password before saving
      user.password = await bcrypt.hash(password, 10);
    }

    user.updatedAt = Date.now();

    await user.save();
    res.json({
      message: 'Profile updated successfully',
      user: {
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getUserProfile, updateUserProfile}