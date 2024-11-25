const express = require('express');
const { getUserBookings, createBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Get user bookings
router.get('/bookings', protect, getUserBookings);

// Create a new booking
router.post('/bookings', protect, createBooking);

module.exports = router;
