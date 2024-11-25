const Booking = require('../models/Booking');

// Get User Bookings (Booking History)
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).populate('userId', 'username email'); // Populate with user details
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a New Booking
const createBooking = async (req, res) => {
  const { service, date, status } = req.body;

  try {
    const newBooking = new Booking({
      userId: req.userId, // Get userId from the authenticated user
      service,
      date,
      status,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getUserBookings, createBooking }