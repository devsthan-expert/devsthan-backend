const mongoose = require('mongoose');

// Cart Schema
const cartSchema = new mongoose.Schema({
  tourId: {
    type: String, // UUID of the tour
    required: true,
  },
  category: {
    type: String, // Category of the tour (e.g., standard, premium, etc.)
    required: true,
  },
  adults: {
    type: Number, // Number of adults
    required: true,
  },
  children: {
    type: Number, // Number of children
    required: true,
  },
  userTempId: {
    type: String, // Temporary user identifier
  },
  userId: {
    type: String, // Registered user identifier
  },
  basePrice: {
    type: Number, // Price before GST
    required: true,
  },
  gst: {
    type: Number, // GST amount (5% of basePrice)
    required: true,
  },
  totalPrice: {
    type: Number, // Total price including GST
    required: true,
  },
  selectedRooms: {
    type: Number, // Number of rooms selected for the booking
  },
  addedAt: {
    type: Date, // Time when the item was added to the cart
    default: Date.now,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
