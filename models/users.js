const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  accountType: {
    type: String,
  },
  phone: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  address: {
    type: String,
  },

  state: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },

  postalCode: {
    type: String,
  },


  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String, // OTP is usually stored as a string

  },
  wishlist: [
    {
      type: String,
    }
  ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;