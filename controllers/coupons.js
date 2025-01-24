const Coupon = require('../models/coupons');
const CouponUsed= require('../models/usedCoupons');
const Cart = require('../models/cart');
const Tour = require('../models/tour');
// Get all coupons
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
};

// Create a coupon
const createCoupon = async (req, res) => {
  const { code, discount, influencerEmail, applicableTours, specificTours,isActive } = req.body;

  try {
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }

    const coupon = new Coupon({ code, discount, influencerEmail, applicableTours, specificTours,isActive });
    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};


const updateCoupon = async (req, res) => {
  const { id } = req.params;
  const { code, discount, influencerEmail, applicableTours, specificTours } = req.body;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    coupon.code = code || coupon.code;
    coupon.discount = discount || coupon.discount;
    coupon.influencerEmail = influencerEmail || coupon.influencerEmail;
    coupon.applicableTours = applicableTours || coupon.applicableTours;
    coupon.specificTours = specificTours || coupon.specificTours;
    coupon.isActive = isActive || coupon.isActive;
    
    coupon.updatedAt = Date.now();

    await coupon.save();
    res.status(200).json({ message: 'Coupon updated successfully', coupon });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coupon' });
  }
};

// Delete a coupon
const deleteCoupon = async (req, res) => {
  const { id } = req.params; // `id` is retrieved from the URL parameters
  console.log(id);

  try {
    // Use the correct syntax for `findOneAndDelete`
    const coupon = await Coupon.findOneAndDelete({ _id: id }); // Pass the filter object

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, userId, token, tourId } = req.body;

    // Validate required fields
    if (!code || !userId || !token || !tourId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    // Check if the coupon is applicable to the specified tour
    if (coupon.applicableTours === 'specific' && !coupon.specificTours.includes(tourId)) {
      return res.status(400).json({ message: "Coupon not applicable for this tour." });
    }

    // Retrieve the user's latest cart
    const cart = await Cart.findOne({ userId }).sort({ addedAt: -1 });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    // Check if the coupon is already applied
    if (cart.couponCode === code) {
      return res.status(400).json({ message: "Coupon already applied to the cart." });
    }

    // Calculate discounted price
    const discountPercentage = coupon.discount || 0; // Assume `discount` is a percentage
    const discountAmount = cart.basePrice * (discountPercentage / 100); // Calculate discount amount based on percentage
    
    // Add 5% GSTx
    const discountedPrice = cart.basePrice - discountAmount;
    const gst = discountedPrice * 0.05;
    
    const finalPrice = discountedPrice + gst; // Apply discount to the total price
    // Update the cart with coupon and final prices

    cart.couponCode = code;
    cart.discountedPrice = cart.basePrice - discountAmount;
    cart.gst = gst;
    cart.finalPrice = finalPrice;

    // Increment coupon usage
    coupon.timesUsed = (coupon.timesUsed || 0) + 1;
    await coupon.save();

    return res.status(200).json({
      message: "Coupon applied successfully.",
      discountAmount,
      discountedPrice,
      gst,
      finalPrice,
      success: true
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return res.status(500).json({ message: "Internal server error." , success: false });
  }
};

const getSingleCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupons = await CouponUsed.find({ couponCode: id });
    if (coupons.length === 0) {
      return res.status(404).json({ success: false, message: 'No coupons found with the given code.' });
    }
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    console.error('Error fetching coupons by code:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getSingleCoupon
};
