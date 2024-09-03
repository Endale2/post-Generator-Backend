import { TodaysPost } from '../models/TodaysPost.js'; // Adjust the import path as needed

// Get all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await TodaysPost.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};