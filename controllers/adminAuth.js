const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminAuth'); // Adjust path as needed

const adminSignup = async (req, res) => {
  try {
    const { name, email, password, accountType } = req.body;

    // Validate the email format directly in the API
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Validate password strength (at least 8 characters)
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password is too weak. It should contain at least 8 characters." });
    }

    // Check if the accountType is valid
    const validAccountTypes = ['admin', 'superAdmin', 'vendor', 'influencer'];
    if (!validAccountTypes.includes(accountType)) {
      return res.status(400).json({ success: false, message: "Invalid account type. Valid options are: admin, superAdmin, vendor, influencer." });
    }

    // Check if the email is already registered
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin with this email already exists." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin instance
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      accountType,
    });

    // Save the new admin in the database
    await newAdmin.save();

    // Generate a JWT token (optional for authentication purposes)
    const token = jwt.sign({ id: newAdmin._id, accountType: newAdmin.accountType }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Admin account created successfully.",
      data: {
        name: newAdmin.name,
        email: newAdmin.email,
        accountType: newAdmin.accountType,
        token,
      },
    });
  } catch (error) {
    console.error("Error in admin signup:", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if email is provided
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide both email and password." });
      }
  
      // Find the admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ success: false, message: "Admin not found with this email." });
      }
  
      // Compare the password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid password." });
      }
  
      // Generate JWT token for the logged-in user
      const token = jwt.sign(
        { id: admin._id, accountType: admin.accountType }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
  
      // Respond with success and the token
      return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: {
          name: admin.name,
          email: admin.email,
          accountType: admin.accountType,
          token,
        },
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  };
  
module.exports = { adminSignup ,adminLogin};
