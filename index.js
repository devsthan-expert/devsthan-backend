const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const validateToken = require('./middleware/validation');
const multer = require('multer');

const adminAuth = require('./controllers/adminAuth.js')
const wishlist = require('./controllers/wishlist.js')
const blogs = require('./controllers/blogs.js')
const authRouter = require('./controllers/auth.js');
const tourController = require('./controllers/tour.js')
const banners = require('./controllers/banners.js')
const destinations = require('./controllers/destinations.js')
const categegories = require('./controllers/categories.js')
const cart = require('./controllers/cart.js')
const { 
  getCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon ,
  validateCoupon,
  getSingleCoupon
} = require('./controllers/coupons');
const attributes = require('./controllers/attributes.js')
const contacts = require('./controllers/contact.js')
const customizedQuesry = require('./controllers/customizedQuery.js')
const payment = require('./controllers/payment.js')
// const imageUploader=require('./controllers/tour.js')
const imageUploader = require('./controllers/cloudinary.js')
const testimonials = require('./controllers/testimonials.js')
const whyChoose=require('./controllers/whyChoose.js')

const paymentController = require('./services/paymentService.js'
)
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
app.use(express.json({ limit: '50mb' }));
const port = 4000;
// const uri = "mongodb+srv://indiadevsthan:Yq18ukFkrOGK8Gzr@tours.qpddv9d.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb+srv://indiadevsthan:Yq18ukFkrOGK8Gzr@cluster0.3raa0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const mongoose = require('mongoose');
require('dotenv').config();
app.use(bodyParser.json({ limit: '70mb' }));
app.use(bodyParser.urlencoded({ limit: '70mb', extended: true }));
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
mongoose.connect(uri, {});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tours',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [
      {
        quality: 'auto:low',
        fetch_format: 'auto',
      },
    ],
  },
});

// Create multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});
db.once('open', () => {
});
app.use(cors());
app.use(bodyParser.json());
app.post('/api/user/signup', authRouter.signup);
app.post('/api/user/login', authRouter.login);

app.post('/api/user/verify-otp', authRouter.verifyOtp);
app.post('/api/createTours', upload.fields([
  { name: 'bannerImage', maxCount: 1 },  // Single file upload for banner image
  { name: 'images', maxCount: 10 },
  { name: 'standardSiteSeenPhotos', maxCount: 10 },   // Multiple file upload for photos
  { name: 'deluxeSiteSeenPhotos', maxCount: 10 },
  { name: 'premiumSiteSeenPhotos', maxCount: 10 },


  { name: "standardCarPhotos", maxCount: 50 },
  { name: "deluxeCarPhotos", maxCount: 50 },
  { name: "premiumCarPhotos", maxCount: 50 },


  { name: "premiumMealsPhotos", maxCount: 50 },
  { name: "standardMealsPhotos", maxCount: 50 },
  { name: "deluxeMealsPhotos", maxCount: 50 },
  { name: "standardHotelPhotos", maxCount: 50 },
  { name: "deluxeHotelPhotos", maxCount: 50 },
  { name: "premiumHotelPhotos", maxCount: 50 },



]), tourController.createTour);
app.delete('/api/deleteTour/:uuid', tourController.deleteTour);

app.post('/api/updateUser', authRouter.updateUser)
app.post('/api/getUser', authRouter.getUser)
app.post('/api/adminSignup', adminAuth.adminSignup)
app.post('/api/adminLogin', adminAuth.adminLogin)

app.post('/api/allTours', tourController.getAllTours);
app.get('/api/tourSelectedDetails', tourController.getSelectedDetails);
app.post('/api/checkout', paymentController.checkout);
app.post('/api/paymentVerification', paymentController.paymentVerification);
app.post('/api/userBooking', paymentController.userBooking);
app.post('/api/cancelBooking/:orderId', paymentController.cancelTour);

app.post('/api/getBookedUserDetails', paymentController.getBookedUserDetails);
app.post('/api/getBookedTours/:vendorId', paymentController.getBookedToursByVendor);
app.post('/api/updateTourStatus', paymentController.updateBookedToursByVendor);
app.post('/api/getBookedToursbyUser/:userId', paymentController.getBookedToursByUser);
// app.get('/api/tours/:location/:date', tourController.getToursByLocationDate);
app.post('/api/tours/:location', tourController.getToursByFilter);
app.get('/api/getTestimonials', testimonials.getAllTestimonials);
app.post('/api/createTestimonial', testimonials.createTestimonial);
app.post('/api/createDestination', destinations.createDestination);
app.get('/api/getAllLocations', destinations.getAllLocations);
app.post('/api/getDestinationById/:uuid', destinations.getDestinationById);
app.get('/api/getAllDestinations', destinations.getAllDestinations);
app.post('/api/vendorTours', tourController.getToursForVendor);
app.post('/api/updateTour/:tourId', tourController.updateTour);
app.get('/api/getTour/:tourId', tourController.getTourDetails);
app.get('/api/getkey', (req, res) => res.status(200).json("rzp_test_51M4AB2hSU08Ih"))

app.post('/api/addToWishlist', wishlist.addToWishlist);
app.get('/api/wishlist/:userId', wishlist.getWishlist);
app.post('/api/removeFromWishlist', wishlist.removeFromWishlist);
app.post('/api/categories', categegories.createCategories)
app.get('/api/categories', categegories.getCategories)
app.post('/api/createInquiry', contacts.createInquiryOrContact)
app.get('/api/getAllInquiries', contacts.getAllInquiries)
app.get('/api/getAllContacts', contacts.getAllContacts)
app.put('/api/markAsReadOrUnread', contacts.markAsReadOrUnread);


app.delete('/api/categories/:id', categegories.deleteCategory)




app.post('/api/attributes', attributes.createAttribute)
app.get('/api/attributes', attributes.getAttributes)
app.post('/api/attributes/:id/sub-attributes', attributes.addSubAttribute)
app.delete('/api/attributes/:attributeId/sub-attributes/:subAttributeId', attributes.deleteSubattribute)
app.delete('/api/attributes/:id', attributes.deleteAttribute);



app.post('/api/createBlog', blogs.createBlog);
app.delete('/api/deleteBlog/:blog', blogs.deleteBlog);
app.put('/api/updateBlog/:blog', blogs.updateBlog);
app.get('/api/getBlogById/:blog', blogs.getBlogById);
app.get('/api/getAllBlogs', blogs.getAllBlogs);
app.post('/api/createWhyChoose', whyChoose.createWhyChoose);
app.delete('/api/deleteWhyChoose/:WhyChoose', whyChoose.deleteWhyChoose);
app.put('/api/updateWhyChoose/:WhyChoose', whyChoose.updateWhyChoose);
app.get('/api/getAllWhyChoose', whyChoose.getAllWhyChoose);
app.post('/api/addBannerImages', banners.addBanner);
app.delete('/api/deleteBannerImage', banners.deleteBanner);
app.get('/api/getBanner', banners.getAllBannerImages);
app.get('/api/getAllCustomizedQuery', customizedQuesry.getCustomizedQuesry);
app.post('/api/customizedQuery', customizedQuesry.createCustomizedQuesry);
app.delete('/api/customizedQuery/:id', customizedQuesry.deleteCustomizedQuesry);
app.put('/api/customizedQuery/:id', customizedQuesry.editCustomizedQuesry);


app.post('/api/addToCart',  cart.addToCart);
app.post('/api/getCart', cart.getCart)
app.post('/paymentCalculate', payment.paymentCalculate);
app.post('/create-order', payment.createOrder);
app.get('/api/getOrder', payment.getOrder);
app.post('/api/updateOrderStatus', payment.updateOrderStatus);
app.post('/verify-payment', payment.verifyPayment);


app.post('/api/validateCoupon', validateCoupon);
app.get('/api/getCoupons', getCoupons);
app.get('/api/getSingleCoupon/:id', getSingleCoupon);
app.post('/api/createCoupon', createCoupon);
app.put('/api/updateCoupon/:id', updateCoupon);
app.delete('/api/deleteCoupon/:id', deleteCoupon);

app.get('/', (req, res) => {
  res.send('Hello, Express with MongoDB!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});