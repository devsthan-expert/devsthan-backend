const jwt = require('jsonwebtoken');
const Cart = require('../models/cart');
const Tour = require('../models/tour');
const SECRET_KEY = process.env.JWT_SECRET;

const addToCart = async (req, res) => {
  try {
    const { adults, children, tourId, userTempId, token, category } = req.body;

    if (
      adults === undefined ||
      !tourId ||
      (!userTempId && !token) ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields (adults, tourId, userTempId, or token)",
      });
    }

    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        userId = decoded.id || decoded.userId;
      } catch (error) {
        return res.status(401).json({
          success: false,
          error:
            error.name === "TokenExpiredError"
              ? "Token expired. Please log in again."
              : "Invalid token. Please log in again.",
        });
      }
    }

    const tour = await Tour.findOne({ uuid: tourId });
    if (!tour) {
      return res.status(404).json({ success: false, error: "Tour not found" });
    }

    let selectedPrice = null;
    let selectedRooms = null;
    const totalPeople = adults + children;
    const childPriceFactor = 0.5;
    const categoryField = category || "standardDetails";

    if (tour?.[categoryField]?.pricing) {
      for (const tier of tour[categoryField].pricing) {
        if (totalPeople <= tier.person) {
          selectedPrice = tier.price;
          selectedRooms = tier.rooms; // Extract rooms from the pricing tier
          break;
        }
      }
    } else {
      console.error(
        `Pricing information for category "${categoryField}" is not available.`
      );
    }

    if (!selectedPrice) {
      return res.status(400).json({
        success: false,
        message: `Pricing not available for ${categoryField} category.`,
      });
    }

    const pricePerPerson = selectedPrice / totalPeople;
    const childPrice = pricePerPerson * childPriceFactor;
    const basePrice = adults * pricePerPerson + children * childPrice;

    const gst = basePrice * 0.05; // Calculate GST (5%)
    const totalPrice = basePrice + gst; // Final price with GST

    console.log(`Base Price: ${basePrice}`);
    console.log(`GST: ${gst}`);
    console.log(`Total Price: ${totalPrice}`);

    // Create a new cart entry
    const newCartItem = new Cart({
      userId: userId || null,
      userTempId: userTempId || null,
      tourId,
      adults,
      children,
      category,
      totalPrice,
      basePrice,
      gst,
      selectedRooms,
      addedAt: new Date(),
    });

    await newCartItem.save();

    return res.status(201).json({
      success: true,
      message: "Item added to cart successfully!",
      data: newCartItem,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to add to cart. Please try again.",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const { token, userTempId } = req.body;
    if (!token && !userTempId) {
      return res.status(400).json({ message: 'Token or userTempId is required.' });
    }

    let cart;
    let tour;

    if (userTempId) {
      cart = await Cart.findOne({ userTempId }).sort({ addedAt: -1 });
      if (cart) {
        const tourId = cart.tourId;
        tour = await Tour.findOne({ uuid: tourId });
      }
    } 
    if (token) {
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log("decoded",decoded)
      const userId = decoded.id || decoded.userId;

      cart = await Cart.findOne({ userId }).sort({ addedAt: -1 });
      if (cart) {
        const tourId = cart.tourId;
        tour = await Tour.findOne({ uuid: tourId });
      }
    }

    if (!cart) {
      return res.status(404).json({ message: 'No cart items found.' });
    }

    return res.status(200).json({
      success: true,
      cart,
      tour: tour ? {
        bannerImage: tour.bannerImage,
        name: tour.name,
      } : null,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = { addToCart,getCart };
