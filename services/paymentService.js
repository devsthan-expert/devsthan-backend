const Razorpay = require("razorpay");
require("dotenv").config();
const Booking = require("../models/userBooking");
const Orders = require("../models/orders");
const nodemailer = require("nodemailer");
const User=require("../models/users");
const instance = new Razorpay({
  key_id: "rzp_test_51M4AB2hSU08Ih",
  key_secret: "njtg5niFstEhGvYxIqzlr6uf",
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const checkout = async (req, res) => {
  const { price } = req.body;

  try {
    const options = {
      amount: Number(price * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const crypto = require("crypto");
const secret = "njtg5niFstEhGvYxIqzlr6uf";

const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("Payment verification successful");
      res.status(200).json({
        message: "Payment verification successful",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      console.log("Payment verification failed");
      res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userBooking = async (req, res) => {
  try {
    const {
      orderId,
      userId,
      userDetails,
      totalPrice,
      paymentId,
      addressLine1,
      addressLine2,
      state,
      postalCode,
      specialRequests,
      bookedTour,
      vendorId,
      status,
      tourName,
    } = req.body;

    const newUserBooking = new Booking({
      orderId,
      userId,
      userDetails,
      totalPrice,
      paymentId,
      addressLine1,
      addressLine2,
      state,
      postalCode,
      specialRequests,
      bookedTour,
      vendorId,
      status,
      tourName,
    });

    const newBooking = await newUserBooking.save();

    res
      .status(200)
      .json({ message: "User booking details saved successfully" });
  } catch (error) {
    console.error("Error saving user booking details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getBookedUserDetails = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const bookedUserDetails = await Booking.findOne({ paymentId });

    if (!bookedUserDetails) {
      return res.status(404).json({
        error: "No booking details found for the provided payment ID",
      });
    }

    res.status(200).json({ bookedUserDetails });
  } catch (error) {
    console.error("Error fetching user booking details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getBookedToursByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const bookedTours = await Booking.find({ vendorId: vendorId });
    res.status(200).json({ bookedTours });
  } catch (error) {
    console.error("Error fetching user booking details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getBookedToursByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookedTours = await Orders.find({ userId: userId });
    res.status(200).json({ bookedTours });
  } catch (error) {
    console.error("Error fetching user booking details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const updateBookedToursByVendor = async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;

   
    const updatedTour = await Booking.findOneAndUpdate(
      { orderId: orderId }, 
      { status: newStatus }, 
     
    );

    if (!updatedTour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    console.log(`Status of tour with ID ${orderId} updated to ${newStatus}`);

    res.status(200).json({ message: 'Tour status updated successfully', updatedTour });
  } catch (error) {
    console.error('Error updating tour status:', error);
    res.status(500).json({ error: 'Failed to update tour status' });
  }
};

const cancelTour = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the tour order to cancel
    const updatedTour = await Orders.findByIdAndUpdate(
      orderId,
      { cancelStatus: true },
      { new: true }
    );

    if (!updatedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Find the user associated with the order
    const user = await User.findById(updatedTour.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Email content for user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Tour Cancellation Confirmation',
      text: `Dear ${user.name},\n\nYour tour with ID: ${updatedTour._id} has been successfully cancelled.\n\nIf you have any further questions, feel free to contact us.\n\nBest regards,\nDevsthan Expert Team`,
    };

    // Email content for admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Admin email (make sure this is defined in your .env file)
      subject: 'Tour Cancellation Notification',
      text: `Dear Admin,\n\nThe tour with ID: ${updatedTour._id} has been cancelled by the user ${user.username} (Email: ${user.email}).\n\nPlease review the cancellation.\n\nBest regards,\nDevsthan Expert Team`,
    };

    // Send email to the user
    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email to user:', error);
      } else {
        console.log('Email sent to user:', info.response);
      }
    });

    // Send email to the admin
 transporter.sendMail(adminMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email to admin:', error);
      } else {
        console.log('Email sent to admin:', info.response);
      }
    });

    // Return success response
    res.status(200).json({ message: 'Tour cancelled successfully', tour: updatedTour, success: true });

  } catch (error) {
    console.error('Error cancelling tour:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

module.exports = {
  checkout,
  cancelTour,
  paymentVerification,
  userBooking,
  getBookedUserDetails,
  getBookedToursByVendor,
  getBookedToursByUser,
  updateBookedToursByVendor
};
