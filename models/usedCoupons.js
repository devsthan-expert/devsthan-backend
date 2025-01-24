const mongoose = require('mongoose');

// Define the schema for coupon usage
const couponUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User', 
   
  },
  userEmail: {
    type: String, // Email of the user
   
  },
  couponCode: {
    type: String, // The applied coupon code
   
  },
  couponName: {
    type: String, // The name of the coupon
   
  },
  tourId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Tour model
    ref: 'Tour', 
   
  },
  tourName: {
    type: String, // Name of the tour
   
  },
  discountApplied: {
    type: Number, // The discount amount applied
   
  },
  usedAt: {
    type: Date, // Timestamp when the coupon was used
    default: Date.now,
  },
});

// Create and export the model for coupon usage
const CouponUsage = mongoose.model('CouponUsage', couponUsageSchema);

module.exports = CouponUsage;
