const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    influencerEmail: { type: String, required: true },
    applicableTours: { 
      type: String, 
      enum: ['all', 'specific'], 
      default: 'all' 
    },
    specificTours: { type: [String], default: [] }, // Array of tour UUIDs
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
