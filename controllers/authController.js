const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register a new user
const registerUser = async (req, res) => {
  const { email, username, phoneNumber, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ email, username, phoneNumber, password });
    await user.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {  
        id: user._id,
        name: user.username,  
        email: user.email, 
      } // Return the 'user' object that was just created
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user and generate JWT token
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {  
        id: user._id,
        name: user.username,  
        email: user.email, 
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { registerUser, loginUser };
