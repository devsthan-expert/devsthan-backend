const User = require("../models/users.js");
const Vendor = require("../models/vendors.js");
const bcrypt = require("bcryptjs")
const Cart = require('../models/cart');
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const { configDotenv } = require("dotenv");
configDotenv();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


const signup = async (req, res) => {
  try {

    const { name, email, password, confirmPassword, phone } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Generate OTP
    const generateNumericOTP = (length) => {
      const digits = '0123456789';
      let otp = '';
      for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
      }
      return otp;
    };

    const otp = generateNumericOTP(6);

    // Save user with OTP and mark as unverified
    const newUser = new User({
      name,
      email,
      password, // Ideally, hash this password before saving
      phone,
      otp,
      isVerified: false,
    });

    await newUser.save();

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Account - OTP",
      text: `Hello ${name},\n\nThank you for signing up on our platform. To verify your account, please use the following OTP:\n\nOTP: ${otp}\n\nThis OTP will expire in 10 minutes. Please do not share this OTP with anyone.\n\nBest regards,\nDevsthan Expert`,
    };

    // Send email with OTP
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Error sending OTP email." });
      }
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify OTP sent to your email.",
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp, phone, name, userTempId } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Debugging: Log OTP values and lengths


    // Trim and normalize both values to avoid any hidden discrepancies
    const dbOtp = user.otp.trim().normalize();
    const inputOtp = otp.trim().normalize();

    // Compare OTPs
    if (dbOtp !== inputOtp) {
      user.isVerified = false;
      return res.status(400).json({ error: "Invalid OTP" });
    }
    user.isVerified = true;
    user.otp = null;
    console.log("user", user._id)
    await user.save();
    if (userTempId) {
      const cart = await Cart.findOne({ userTempId: userTempId }).sort({ addedAt: -1 })
      console.log("cart", cart)
      if (cart) {
        cart.userId = user._id;
        await cart.save();
        console.log("Cart updated with user ID:", cart);
      } else {
        console.log("No cart found for the provided tempId.");
      }
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '72h' } // Token expires in 72 hours
    );

    // Aisensy payload for WhatsApp message
    const aisensyPayload = {
      apiKey: process.env.AISENSY_API_KEY,
      campaignName: "welcome",
      destination: phone,
      userName: "Devsthan Expert",
      templateParams: [name],
      source: "whatsapp_inquiry_tour IMAGE",
      buttons: [],
      carouselCards: [],
      location: {},
      paramsFallbackValue: {}
    };

    // Send WhatsApp message using Aisensy API
    try {
      const aisensyResponse = await axios.post(
        'https://backend.aisensy.com/campaign/t1/api/v2',
        aisensyPayload,
        {
          headers: {
            'Authorization': `Bearer ${aisensyPayload.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('WhatsApp message sent via Aisensy:', aisensyResponse.data);
    } catch (aisensyError) {
      console.error("Aisensy API Error:", aisensyError.response?.data || aisensyError.message);
    }

    // Return success response with user details and token
    res.status(200).json({
      success: true,
      message: "OTP verified successfully. Redirecting to home page.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please create an account to continue.",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }

    // User exists and password is valid
    return res.status(200).json({
      success: true,
      message: "Login successful. User verified.",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const getUser = async (req, res) => {
  try {
    const { userId } = req.body;



    const user = await User.findOne({ _id: userId });

    if (!user) {

      return res.status(404).json({ error: "User not found" });
    }

    // If the user is found, send the user details to the frontend
    res.status(200).json(user);
  } catch (error) {
    // If an error occurs during the process, handle it
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const mongoose = require('mongoose');

const updateUser = async (req, res) => {
  try {
    const { _id, name, email, lastName, phone, address, state, city, country, postalCode } = req.body;
console.log("req.body",_id)  
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: 'Invalid user ID', success: false });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found', success: false });
    }
    console.log("user", user)
    // Update user details
    user.name = name;
    user.email = email;
    
    user.phone = phone;
    user.address = address;
 
    user.state = state;
    user.postalCode = postalCode;
   
    user.city = city;
    user.country = country;
   

    // Save the updated user details
    await user.save();

    res.status(200).json({ message: 'User details updated successfully', success: true });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};


module.exports = updateUser;

updateUser;
module.exports = {
  signup,
  login,
  updateUser,
  verifyOtp,
  getUser,

};
