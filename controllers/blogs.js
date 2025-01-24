
const Blog = require('../models/blog'); // Assuming the Blog model is in models/Blog.js


// Create a new blog post
const createBlog = async (req, res) => {

    try {
        const { bannerImage, title, description ,uuid,metaTitle,metaDescription} = req.body;
   
        const newBlog = new Blog({ bannerImage, title, description,uuid ,metaTitle,metaDescription});
        await newBlog.save();
        res.status(201).json({ success: true, data: newBlog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

// Get all blog posts
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: blogs });
    } catch (error) {
        console.error('Error retrieving blogs:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

// Get a single blog post by ID
const getBlogById = async (req, res) => {
console.log("req.params.blog",req.params.blog)
    try {
        const blog = await Blog.findOne({ uuid:req.params.blog  });
        console.log("blog",blog)    
        if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        console.error('Error retrieving blog:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

// Update a blog post by ID
const updateBlog = async (req, res) => {
    try {
        const { bannerImage, title, description, metaDescription, metaTitle } = req.body;
        
        // Use the ID directly instead of using an object for the _id field
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.blog, // directly pass the ID
            { bannerImage, title, description, metaDescription, metaTitle }, // fields to update
            { new: true } // option to return the updated document
        );

        // If no blog was found with the provided ID, return an error
        if (!updatedBlog) {
            return res.status(404).json({ success: false, error: 'Blog not found' });
        }

        // Return the updated blog data if the update was successful
        res.status(200).json({ success: true, data: updatedBlog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

// Delete a blog post by ID
const deleteBlog = async (req, res) => {
    try {
        console.log("req.params.uuid",req.params.blog)
        // Use UUID instead of ID to find and delete the blog
        const deletedBlog = await Blog.findOneAndDelete({ _id: req.params.blog });
        console.log("deletedBlog",deletedBlog)

        if (!deletedBlog) {
            return res.status(404).json({ success: false, error: 'Blog not found' });
        }

        res.status(200).json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}


module.exports = {
    deleteBlog,
    updateBlog,
    createBlog,

    getAllBlogs,
    getBlogById
};

